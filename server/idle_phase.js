// players can join

module.exports = function() {
  var self = this;

  self.handle = function(game, gameState, net, nodeName, json) {
    if (json.c == 'join' && json.name) {
      var Config = require('./config');

      // if it's a new node, notify others
      if (gameState.join(nodeName, json.name)) {
        net.broadcast({ e: 'player_joined', name: json.name });
        game.broadcastState();
      }

      net.sendDirectly(nodeName, { host: Config.multicastHost, port: Config.multicastPort });
    }
  }

  return self;
}
