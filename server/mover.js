var _ = require('../lib/underscore');

module.exports = function() {
  var self = this,
      prevPositions = {};

  // Moves all live players in the game state and updates it.
  // Avoids collisions.
  self.move = function(gameState) {
    var collidedPlayers = [],
        players = gameState.livePlayers;

    _.each(players, function(n) {
      self.movePlayer(n, gameState.fieldWidth, gameState.fieldHeight);
    });

    do {
      collidedPlayers = getCollisions(players);
      _.each(collidedPlayers, function(n) { resetPosition(n); });
    } while (collidedPlayers.length > 0)
  }

  self.movePlayer = function(n, fieldWidth, fieldHeight) {
    prevPositions[n.name] = { x: n.x, y: n.y };

    switch (n.tickMove) {
      case 'move_left':
        if (n.x > 0) n.x--;
        break;

      case 'move_down':
        if (n.y < fieldHeight - 1) n.y++;
        break;

      case 'move_up':
        if (n.y > 0) n.y--;
        break;

      case 'move_right':
        if (n.x < fieldWidth - 1) n.x++;
        break;
    }
  }

  // returns the list of players in a collision
  var getCollisions = function(players) {
    var collidedPlayers = [],
        positions = {};

    positions = _.groupBy(players, function(n) {
      return JSON.stringify({ x: n.x, y: n.y });
    });

    collidedPlayers = _.select(positions, function(players, key) {
      return players.length > 1;
    });

    return _.flatten(collidedPlayers);
  }

  // resets the position of a player
  var resetPosition = function(n) {
    var pp = prevPositions[n.name];
    if (pp) {
      n.x = pp.x;
      n.y = pp.y;
    }
  }

  return self;
}
