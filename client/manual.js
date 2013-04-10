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

var sendCommand = function(cmd) {
  cmd = JSON.stringify(cmd);

  console.log("Sending: " + cmd);
  var buf = new Buffer(cmd);
  sendSocket.send(buf, 0, buf.length, serverPort, serverHost);
}

var offsets = {
  '77': 'move_up',    // w
  '61': 'move_left',  // a
  '73': 'move_down',  // s
  '64': 'move_right', // d
};

var lastCommand = null;

process.stdin.resume();
process.stdin.setRawMode(true);

process.stdin.on('data', function(buffer) {
  var keyCode = buffer.toString('hex');
  switch(keyCode) {
    case '03': // Ctrl-C
    case '1b': // Esc
      process.exit(1);
      break;
    default:
      lastCommand = offsets[keyCode];
      console.log(lastCommand);
  }
});

process.stdin.on('end', function() {
  process.stdout.write('end');
});

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
      if(lastCommand) sendCommand({ c: lastCommand });
      lastCommand = null;
    }
  }
});

sendSocket.on("listening", function() {
  var address = sendSocket.address();
  console.log("Send socket at:  " + address.address + ":" + address.port);

  // send JOIN to the server
  sendCommand({c: 'join', name: myName });
});

sendSocket.bind();
