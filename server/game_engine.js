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

    gameState.eachNode(function(nodeInfo) {
      var pos = getPlacementPosition(map, gameState.fieldWidth, gameState.fieldHeight);

      nodeInfo.x = pos.x;
      nodeInfo.y = pos.y;
      nodeInfo.energy = 100 * Math.floor(Math.random() * 5 + 1) * 5;
      nodeInfo.dead = false;
    });

    gameState.resetOnNewRound();
  }

  // processes current game state and makes all moves
  self.process = function(gameState, tick) {
    if (tick > 0) {
      moveNodes(gameState);
      exchangeEnergy(gameState);

      if (tick % 10) {
        deployEnergy(gameState);
      }
    }
  }

  var moveNodes = function(gameState) {
    mover.move(gameState);

    // reset moves
    gameState.eachNode(function(n) { n.tickMove = null; });
  }

  var exchangeEnergy = function(gameState) {
    var sorted = _.sortBy(gameState.liveNodes, function(n) { return -n.energy; });

    for (var i = 0; i < sorted.length; i++) {
      var node = sorted[i];

      for (var j = i + 1; j < sorted.length; j++) {
        var other = sorted[j];

        if (other.closeTo(node) && other.energy < node.energy) {
          node.takesEnergyOf(other);

          // if died, mark as dead
          if (other.dead) gameState.nodeHasDied(other);
        }
      }
    }
  }

  var deployEnergy = function(gameState) {}

  return self;
}
