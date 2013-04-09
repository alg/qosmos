var gx = 2,
    _ = require('../lib/underscore');

function getPlacementPosition(map, fw, fh) {
  var found = false,
      x, y;

  while (!found) {
    x = Math.floor(Math.random() * fw);
    y = Math.floor(Math.random() * fh);

    if (!map[y * fw + x]) {
      map[y * fw + x] = true;
      found = true;
    }
  }


  gx += 1;
  return { x: x, y: y };
}

module.exports = function() {
  var self = this,
      Mover = require('./mover'),
      mover = new Mover();

  // initializes for the new round
  self.newRound = function(gameState) {
    var map = [];

    gameState.eachPlayer(function(playerInfo) {
      var pos = getPlacementPosition(map, gameState.fieldWidth, gameState.fieldHeight);

      playerInfo.x = pos.x;
      playerInfo.y = pos.y;
      playerInfo.energy = 100 * Math.floor(Math.random() * 5 + 1) * 5;
      playerInfo.dead = false;
    });

    gameState.resetOnNewRound();
  }

  // processes current game state and makes all moves
  self.process = function(gameState, tick) {
    if (tick > 0) {
      movePlayers(gameState);
      exchangeEnergy(gameState);

      if (tick % 10) {
        deployEnergy(gameState);
      }
    }
  }

  var movePlayers = function(gameState) {
    mover.move(gameState);

    // reset moves
    gameState.eachPlayer(function(n) { n.tickMove = null; });
  }

  // exchange energies and award points for kills
  var exchangeEnergy = function(gameState) {
    var sorted = _.sortBy(gameState.livePlayers, function(n) { return -n.energy; });

    for (var i = 0; i < sorted.length; i++) {
      var player = sorted[i];
      if (player.dead) continue;

      for (var j = i + 1; j < sorted.length; j++) {
        var other = sorted[j];

        if (other.closeTo(player) && other.energy < player.energy) {
          if (player.takesEnergyOf(other)) {
            // if died, mark as dead
            gameState.playerHasDied(other);

            player.scorePoint();
          }
        }
      }
    }
  }

  var deployEnergy = function(gameState) {}

  return self;
}
