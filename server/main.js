var Config      = require('./config'),
    GameServer  = require('./game_server'),
    gameServer  = new GameServer();

var OS = require('os'),
    ni = OS.networkInterfaces();

for (var i in ni) {
  var gr = ni[i];
  for (var d in gr) {
    var dev = gr[d];
    if (!dev.internal && dev.family == 'IPv4') {
      Config.multicastHost = Config.multicastHost + dev.address.match(/\.([^\.]*)$/)[1];
    }
  }
}

gameServer.init();
