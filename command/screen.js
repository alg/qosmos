var ansi = require('ansi'),
    c = ansi(process.stdout);

var cellWidth    = 4,
    cellHeight   = 2,
    cellPadding  = 1,
    fieldOffsetX = 1,
    fieldOffsetY = 7;

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

    c.goto(1, 1);
  }

  var renderDash = function(state) {
    console.log("[1] Start [2] Stop [Q] Quit\n")
    console.log(state);
  }

  var renderField = function(state) {
    var p = '    ';

    var fh = state.field.h, fw = state.field.w;

    for (var y = 0; y < fh; y++) {
      for (var x = 0; x < fw; x++) {
        for (var l = 0; l < cellHeight; l++) {
          c.goto(x * (cellWidth + cellPadding) + fieldOffsetX, y * (cellHeight + cellPadding) + fieldOffsetY + l);
          c.bg.grey();
          process.stdout.write(p);
        }
      }
    }

    c.bg.black();
  }

  var renderPlayers = function(state) {
    c.bg.green();

    var nodes = state.nodes;
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node.e > 0) {
        var x = fieldOffsetX + node.x * (cellWidth + cellPadding),
            y = fieldOffsetY + node.y * (cellHeight + cellPadding);

        c.goto(x, y);
        process.stdout.write('    ');
        c.goto(x, y + 1);
        process.stdout.write('    ');
        c.goto(x, y + 1);
        process.stdout.write(String(node.e));
      }
    }

    c.bg.black();
  }

  return self;
}
