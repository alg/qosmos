require('coffee-script');

// renders the screen contents and delegates commands
module.exports = function(delegate) {
  var self = this;
      // TermUI = require('node-term-ui');

  self.render = function(state) {
    // TermUI.clear();

    renderDash(state);
    renderField(state);
    renderPlayers(state);
  }

  var renderDash = function(state) {
    // TermUI.pos(1,1).fg(TermUI.C.w).out("Hello, world!");
    console.log(state);
  }

  var renderField = function(state) {}
  var renderPlayers = function(state) {}

  return self;
}
