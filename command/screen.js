var ansi = require('ansi');

function lf() { return '\n' }
function clearScreen() {
  ansi(process.stdout)
    .write(Array.apply(null, Array(process.stdout.getWindowSize()[1])).map(lf).join(''))
    .eraseData(2)
    .goto(1, 1);
}

// renders the screen contents and delegates commands
module.exports = function(delegate) {
  var self = this;

  self.render = function(state) {
    clearScreen();

    renderDash(state);
    renderField(state);
    renderPlayers(state);
  }

  var renderDash = function(state) {
    console.log("[1] Start [2] Stop [Q] Quit\n")
    console.log(state);
  }

  var renderField = function(state) {}
  var renderPlayers = function(state) {}

  return self;
}
