var _ = require('../lib/underscore');

module.exports = function() {
  var self = this,
      prevPositions = {};

  // Moves all live nodes in the game state and updates it.
  // Avoids collisions.
  self.move = function(gameState) {
    var collidedNodes = [],
        nodes = gameState.liveNodes;

    _.each(nodes, function(n) {
      self.moveNode(n, gameState.fieldWidth, gameState.fieldHeight);
    });

    do {
      collidedNodes = getCollisions(nodes);
      _.each(collidedNodes, function(n) { resetPosition(n); });
    } while (collidedNodes.length > 0)
  }

  self.moveNode = function(n, fieldWidth, fieldHeight) {
    prevPositions[n.name] = { x: n.x, y: n.y };

    switch (n.tickMove) {
      case 'move_left':
        if (n.x > 0) n.x--;
        break;

      case 'move_down':
        if (n.y < fieldHeight - 1) n.y++;
        break;

      case 'move_up':
        if (n.y > 0) n.y--;
        break;

      case 'move_right':
        if (n.x < fieldWidth - 1) n.x++;
        break;
    }
  }

  // returns the list of nodes in a collision
  var getCollisions = function(nodes) {
    var collidedNodes = [],
        positions = {};

    positions = _.groupBy(nodes, function(n) {
      return JSON.stringify({ x: n.x, y: n.y });
    });

    collidedNodes = _.select(positions, function(nodes, key) {
      return nodes.length > 1;
    });

    return _.flatten(collidedNodes);
  }

  // resets the position of a node
  var resetPosition = function(n) {
    var pp = prevPositions[n.name];
    if (pp) {
      n.x = pp.x;
      n.y = pp.y;
    }
  }

  return self;
}
