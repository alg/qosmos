module.exports = function(fieldWidth, fieldHeight) {
  var self    = this,
      Player  = require('./player'),
      players = {},
      _       = require('../lib/underscore');

  self.phase       = 'idle';
  self.fieldWidth  = fieldWidth;
  self.fieldHeight = fieldHeight;
  self.players     = players;
  self.energyPack  = null;
  self.livePlayers = [];

  var allSpots = Array(fieldHeight * fieldWidth);
  for (var i = 0; i < allSpots.length; i++) allSpots[i] = i;

  // add a player
  self.join = function(nodeName, name) {
    var newPlayer = !players[nodeName];
    players[nodeName] = new Player(name);
    return newPlayer;
  }

  // prepare the state for a new game round
  self.resetOnNewRound = function() {
    self.livePlayers = _.toArray(players);
  }

  // remove the player from live list
  self.playerHasDied = function(player) {
    self.livePlayers = _.without(self.livePlayers.without, [ player ]);
  }

  // checks if the game is over
  self.isGameOver = function() {
    var nd = 0;

    for (var i in players) {
      var player = players[i];
      if (!player.dead) {
        nd++;
        if (nd > 1) return false;
      }
    }
    return true;
  }

  // returns this round scores
  self.scores = function() {
    return { 'nodeName': 0 };
  }

  self.setTickMove = function(nodeName, move) {
    var player = players[nodeName];
    if (player) player.tickMove = move;
  }

  self.eachPlayer = function(cb) {
    for (var i in players) cb(players[i]);
  }

  // returns a random unoccupied spot
  self.getEmptySpot = function() {
    var occupied = [];
    _.each(self.livePlayers, function(p) {
      occupied.push(y * fieldWidth + x);
    });

    var empty = _.difference(allSpots, occupied),
        spot  = empty[_.random(empty.length - 1)],
        x     = spot % fieldWidth,
        y     = (spot - x) / fieldWidth;

    return { x: x, y: y };
  }

  self.serialize = function() {
    var playerInfos = [];
    self.eachPlayer(function(player) {
      playerInfos.push({
        n: player.name,
        x: player.x,
        y: player.y,
        e: player.energy,
        s: player.score });
    });

    var ep = null;
    var e = self.energyPack;
    if (e) {
      ep = { x: e.x, y: e.y, e: e.energy };
    }

    return {
      phase:    self.phase,
      field:    { w: fieldWidth, h: fieldHeight },
      players:  playerInfos,
      ep:       ep
    };
  }

  return self;
}
