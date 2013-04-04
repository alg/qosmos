module.exports = function() {
  var self = this;

  self.handle = function(game, gameState, net, nodeName, json) {
    if (json.c == 'move_left' ||
        json.c == 'move_right' ||
        json.c == 'move_up' ||
        json.c == 'move_down') {
      gameState.setTickMove(nodeName, json.c);
    }
  }

  return self;
}
