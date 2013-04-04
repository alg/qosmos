var Config      = require('./config'),
    GameServer  = require('./game_server'),
    gameServer  = new GameServer();

Config.multicastHost = Config.multicastHost + (1 + parseInt(Math.random() * 254));
gameServer.init();
