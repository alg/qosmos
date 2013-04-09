module.exports = function(net) {

  var self         = this,
      Config       = require('./config'),
      GameState    = require('./game_state'),
      gameState    = new GameState(Config.fieldWidth, Config.fieldHeight),
      GameEngine   = require('./game_engine'),
      gameEngine   = new GameEngine(),
      IdlePhase    = require('./idle_phase'),
      idlePhase    = new IdlePhase(),
      RunningPhase = require('./running_phase'),
      runningPhase = new RunningPhase(),
      phase        = idlePhase;

  self.handle = function(nodeName, json) {
    phase.handle(self, gameState, net, nodeName, json);
  }

  self.broadcastState = function() {
    net.broadcast({ e: 'state', state: gameState.serialize() });
  }

  var tickTimer    = null,
      tickInterval = Config.tickInterval,
      tickCount    = 0;

  // single game tick
  var tick = function() {
    gameEngine.process(gameState, tickCount);

    self.broadcastState();

    if (gameState.isGameOver()) {
      phase = idlePhase;
      net.broadcast({ e: 'game_over', scores: gameState.scores(), ticks: tickCount });
    } else {
      tickCount++;
      tickTimer = setTimeout(tick, tickInterval);
    }
  }

  // start game (joins will be disallowed)
  self.start = function() {
    if (phase == idlePhase) {
      gameEngine.newRound(gameState);

      phase = runningPhase;
      gameState.phase = 'running';

      net.broadcast({ e: 'game_started' });
      self.broadcastState();

      tickTimer = setTimeout(tick, tickInterval);
    }
  }

  // stop game
  self.stop = function() {
    if (phase == runningPhase) {
      if (tickTimer) {
        clearTimeout(tickTimer);
        tickTimer = null;
      }

      phase = idlePhase;
      gameState.phase = 'idle';

      net.broadcast({ e: 'game_stopped', ticks: tickCount });
      self.broadcastState();
    }
  }

  return self;
}
