module.exports = function() {
  var self = this;

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

  var moveNodes = function(gameState) {}
  var exchangeEnergy = function(gameState) {}
  var dieNodes = function(gameState) {}
  var deployEnergy = function(gameState) {}

  return self;
}
