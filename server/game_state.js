module.exports = function(fieldWidth, fieldHeight) {

  var self     = this,
      NodeInfo = require('./node_info'),
      nodes    = {};

  self.phase       = 'idle';
  self.fieldWidth  = fieldWidth;
  self.fieldHeight = fieldHeight;
  self.nodes       = nodes;

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
    var nd = 0;

    for (var i in nodes) {
      var node = nodes[i];
      if (!node.dead) {
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
    var node = nodes[nodeName];
    if (node) node.tickMove = move;
  }

  self.eachNode = function(cb) {
    for (var i in nodes) cb(nodes[i]);
  }

  self.serialize = function() {
    var nodeInfos = [];
    self.eachNode(function(node) {
      nodeInfos.push({
        n: node.name,
        x: node.x,
        y: node.y,
        e: node.energy,
        s: node.score });
    });

    return {
      phase: self.phase,
      field: { w: fieldWidth, h: fieldHeight },
      nodes: nodeInfos
    };
  }

  return self;
}
