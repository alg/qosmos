Requirements
------------

- node 0.10.1+
- npm install ansi

Outstanding tasks
-----------------

- collision detection
- reducing energy (when two bots sit next to each other,
  the one with more energy sucks the energy out of the weaker one)
- winning conditions
- scoring (bot gets a score point for each bot it outlived)
- map rendering
- resetting bots list
- deploying static energy pods every N ticks at random
- inform a bot when trying to connect to a running game
- add CLI args to client and command center enter the server IP


Starting server
---------------

    $ node server/main.js


Connecting with the sample bot
------------------------------

    $ node client/main.js

(server must be running)


Connecting with console
-----------------------

    $ node command/main.js

(server must be running)
