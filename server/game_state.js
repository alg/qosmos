module.exports = function(fieldWidth, fieldHeight) {

  var self     = this,
      NodeInfo = require('./node_info'),
      nodes    = {};

  self.phase = 'idle';

  // add a node
  self.join = function(nodeName, name) {
    var newNode = !nodes[nodeName];
    nodes[nodeName] = new NodeInfo(name);
    return newNode;
  }

  // prepare the state for a new game round
  self.resetOnStart = function() {
    // place nodes on the map
    // reset energy
    // reset scores
  }

  // checks if the game is over
  self.isGameOver = function() {
    return false;
  }

  // returns this round scores
  self.scores = function() {
    return { 'nodeName': 0 };
  }

  self.setTickMove = function(nodeName, move) {
    var node = nodes[nodeName];
    if (node) node.tickMove = move;
  }

  self.serialize = function() {
    var nodeInfos = [];
    for (var i in nodes) {
      var node = nodes[i];
      console.log(node);
      nodeInfos.push({
        n: node.name,
        x: node.x,
        y: node.y,
        e: node.energy,
        s: node.score });
    }

    return {
      phase: self.phase,
      field: { w: fieldWidth, h: fieldHeight },
      nodes: nodeInfos
    };
  }

  return self;
}
