var dgram = require('dgram'),
    serverHost = 'localhost',
    serverPort = 41412;

var sendSocket = dgram.createSocket("udp4"),
    recvSocket = dgram.createSocket("udp4"),
    Commands   = require('./commands'),
    commands   = new Commands(sendSocket, serverPort, serverHost),
    Screen     = require('./screen'),
    screen     = new Screen(commands);

sendSocket.on('message', function(msg, rinfo) {
  var json = JSON.parse(msg),
      host = json.host,
      port = json.port;

  if (host && port) {
    // got response to INFO, initialize broadcast listener
    recvSocket.bind(port);
    recvSocket.on('listening', function() {
      console.log("Broadcast socket at: " + host + ":" + port);
      recvSocket.addMembership(host);
      commands.state();
    });
  }
});

// listening to broadcasts
recvSocket.on('message', function(msg, rinfo) {
  console.log("Got broadcast: " + msg);

  var json = JSON.parse(msg);
  if (json.state) {
    screen.render(json.state);
  }
});

sendSocket.on("listening", function() {
  var address = sendSocket.address();
  console.log("Send socket at:  " + address.address + ":" + address.port);

  commands.info();
});
sendSocket.bind();

