// Scenario:
//
// 1. connect to the known game server host port
// 2. send join command. If server is in idle state (game hasn't started yet)
//    you will get a direct response with { host: ..., port: ... } for receiving
//    broadcasts.
// 3. open socket and listen
//
// You still send commands to the initial socket with the game server, but receive
// broadcast updates on the second one.
//
var dgram = require('dgram'),
    serverHost = 'localhost',
    serverPort = 41414;

var sendSocket = dgram.createSocket("udp4"),
    recvSocket = dgram.createSocket("udp4");

var myName = 'tester-' + new Date().getTime();

function findNode(nodes) {
  if (!nodes) return null;

  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    if (node.name == myName) return node;
  }

  return null;
}

function random(max){
  return Math.floor(Math.random() * max)
}

sendSocket.on('message', function(msg, rinfo) {
  console.log("Got direct: " + msg);

  var json = JSON.parse(msg),
      host = json.host,
      port = json.port;

  // got response to JOIN, initialize broadcast listener
  recvSocket.bind(port);
  recvSocket.on('listening', function() {
    console.log("Broadcast socket at: " + host + ":" + port);
    recvSocket.addMembership(host);
  });
});

var offsets = [ 'move_right', 'move_down', 'move_left', 'move_up' ],
    step = 0;

// listening to broadcasts
recvSocket.on('message', function(msg, rinfo) {
  console.log("Got broadcast: " + msg);

  var json = JSON.parse(msg),
      state = json.state;

  if (json.e == 'game_started') {
    var xo = 1;
    var yo = 0;
  } else if (state) {
    if (state.phase == 'idle') {
      //
    } else if (state.phase == 'running') {
      // take state, analyze, return command for this round

      var myNode = findNode(state.nodes);

      sendCommand({ c: offsets[ random(offsets.length) ] });
      // sendCommand({ c: 'move_left'});
      step++;
    }
  }
});

var sendCommand = function(cmd) {
  cmd = JSON.stringify(cmd);

  console.log("Sending: " + cmd);
  var buf = new Buffer(cmd);
  sendSocket.send(buf, 0, buf.length, serverPort, serverHost);
}

sendSocket.on("listening", function() {
  var address = sendSocket.address();
  console.log("Send socket at:  " + address.address + ":" + address.port);

  // send JOIN to the server
  sendCommand({c: 'join', name: myName });
});

sendSocket.bind();

