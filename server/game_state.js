module.exports = function(fieldWidth, fieldHeight) {
  var self     = this,
      NodeInfo = require('./node_info'),
      nodes    = {},
      _        = require('../lib/underscore');

  self.phase       = 'idle';
  self.fieldWidth  = fieldWidth;
  self.fieldHeight = fieldHeight;
  self.nodes       = nodes;
  self.liveNodes   = [];

  // add a node
  self.join = function(nodeName, name) {
    var newNode = !nodes[nodeName];
    nodes[nodeName] = new NodeInfo(name);
    return newNode;
  }

  // prepare the state for a new game round
  self.resetOnNewRound = function() {
    self.liveNodes = _.toArray(nodes);
  }

  // remove the node from live
  self.nodeHasDied = function(node) {
    self.liveNodes = _.without(self.liveNodes.without, [ node ]);
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
