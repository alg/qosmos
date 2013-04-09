module.exports = function(fieldWidth, fieldHeight) {
  var self    = this,
      Player  = require('./player'),
      players = {},
      _       = require('../lib/underscore');

  self.phase       = 'idle';
  self.fieldWidth  = fieldWidth;
  self.fieldHeight = fieldHeight;
  self.players     = players;
  self.livePlayers = [];

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

    return {
      phase: self.phase,
      field: { w: fieldWidth, h: fieldHeight },
      players: playerInfos
    };
  }

  return self;
}
