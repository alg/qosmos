module.exports = function(socket, port, host) {
  var self = this;

  self.info = function() {
    send({c: 'info'});
  }

  self.state = function() {
    send({c: 'state'});
  }

  var send = function(m) {
    var msg = JSON.stringify(m),
        buf = new Buffer(msg);

    socket.send(buf, 0, buf.length, port, host);
  }

  return self;
}
