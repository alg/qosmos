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

  return { x: x, y: y };
}

module.exports = function() {
  var self = this;

  // initializes for the new round
  self.newRound = function(gameState) {
    var map = [];
    gameState.eachNode(function(nodeInfo) {
      var pos = getPlacementPosition(map, gameState.fieldWidth, gameState.fieldHeight);

      nodeInfo.x = pos.x;
      nodeInfo.y = pos.y;
      nodeInfo.energy = 100;
    });
  }

  // processes current game state and makes all moves
  self.process = function(gameState, tick) {
    if (tick > 0) {
      moveNodes(gameState);
      exchangeEnergy(gameState);
      dieNodes(gameState);

      if (tick % 10) {
        deployEnergy(gameState);
      }
    }
  }

  var moveNodes = function(gameState) {
    gameState.eachNode(function(n) {
      switch (n.tickMove) {
        case 'move_left':
          if (n.x > 0) n.x--;
          break;

        case 'move_down':
          if (n.y < gameState.fieldHeight) n.y++;
          break;

        case 'move_up':
          if (n.y > 0) n.y--;
          break;

        case 'move_right':
          if (n.x < gameState.fieldWidth) n.x++;
          break;
      }

      // reset moves
      n.tickMove = null;
    });
  }

  var exchangeEnergy = function(gameState) {}
  var dieNodes = function(gameState) {}
  var deployEnergy = function(gameState) {}

  return self;
}
