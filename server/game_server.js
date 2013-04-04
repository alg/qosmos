module.exports = function() {

  var self = this,
      Game = require('./game'),
      Config = require('./config'),
      game = new Game(self);

  var dgram = require('dgram'),
      server = dgram.createSocket('udp4'),
      broadcastSocket = dgram.createSocket('udp4'),
      commandSocket = dgram.createSocket('udp4');

  self.init = function() {
    initBroadcastSocket();
    initGameServerSocket();
    initCommandCenterSocket();
  }

  self.broadcast = function(m) {
    var msg = JSON.stringify(m);
    console.log('Broadcast: ' + msg);

    var buf = new Buffer(msg);
    broadcastSocket.send(buf, 0, buf.length, Config.multicastPort, Config.multicastHost);
  }

  self.sendDirectly = function(nodeName, m) {
    var msg = JSON.stringify(m),
        buf = new Buffer(msg);

    console.log('Direct: ' + msg + ' to ' + nodeName);

    var p = nodeName.match(/^(.*):(.*)$/),
        host = p[1],
        port = p[2];

    server.send(buf, 0, buf.length, port, host);
  }

  var initBroadcastSocket = function() {
    broadcastSocket.bind(Config.multicastPort);
    broadcastSocket.on('listening', function() {
      console.log("Broadcasting to: " + Config.multicastHost + ":" + Config.multicastPort);
      broadcastSocket.setBroadcast(true);
      broadcastSocket.setMulticastTTL(128);
      broadcastSocket.addMembership(Config.multicastHost);
    });
  }

  var initGameServerSocket = function() {
    server.on("message", function(msg, rinfo) {
      var nodeName = rinfo.address + ":" + rinfo.port;

      try {
        var json = JSON.parse(msg);
        game.handle(nodeName, json);
      } catch(e) {
        console.log("Error: " + e);
      }
    });

    // display connection information on init
    server.on("listening", function() {
      var address = server.address();
      console.log("Game server at:  " + address.address + ":" + address.port);
    });

    server.bind(Config.gameServerPort);
  }

  var initCommandCenterSocket = function() {
    commandSocket.on("listening", function() {
      var address = commandSocket.address();
      console.log("Command center at: " + address.address + ":" + address.port);
    });

    commandSocket.on("message", function(msg, rinfo) {
      var json = JSON.parse(msg);

      if (json.c == 'info') {
        var res = JSON.stringify({ host: Config.multicastHost, port: Config.multicastPort }),
            buf = new Buffer(res);

        commandSocket.send(buf, 0, buf.length, rinfo.port, rinfo.address);
      } else if (json.c == 'state') {
        game.broadcastState();
      }
    });

    commandSocket.bind(Config.commandCenterPort);
  }

  return self;
}
