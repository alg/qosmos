var _ = require('../lib/underscore');

module.exports = function() {
  var self = this,
      prevPositions = {};

  var getCollisions = function(nodes) {
    var collidedNodes = [],
        positions = {};

    nodes = _.filter(nodes, function(n){ return !n.dead });

    positions = _.groupBy(nodes, function(n){
      return JSON.stringify({x: n.x, y: n.y});
    });

    collidedNodes = _.select(positions, function(nodes, key){
      return nodes.length > 1;
    });

    return _.flatten(collidedNodes);
  }



  self.move = function(gameState) {
    var collidedNodes = [];

    gameState.eachNode(function(n){
      self.moveNode(n, gameState.fieldWidth, gameState.fieldHeight);
    });

    do {
      collidedNodes = getCollisions(gameState.nodes);
      _.each(collidedNodes, function(n){ self.resetPosition(n); });
    } while(collidedNodes.length > 0)
  }

  self.moveNode = function(n, fieldWidth, fieldHeight){
    if (n.dead) return;

    prevPositions[n.name] = {x: n.x, y: n.y};

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

  self.resetPosition = function(n){
    if(prevPositions[n.name]) {
      n.x = prevPositions[n.name].x;
      n.y = prevPositions[n.name].y;
    }
  }

  return self;
}
