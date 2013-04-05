Requirements
------------

- node 0.10.1+
- npm install ansi

Outstanding tasks
-----------------

- resetting bots list
  - add PING - PONG and remove non-responding bots at
    the beginning of the round

- deploying static energy pods every N ticks at random

- inform a bot when trying to connect to a running game
  - make example bots wait for 'idle' state and rejoin

- add CLI args to client and command center enter the server IP

- console enchancements:
  - incremental rendering of the screen
  - using colors for bots
  - using darker colors for dead bots


Starting server
---------------

    $ node server/main.js


Connecting with the sample bot
------------------------------

    $ node client/main.js

or

    $ node client/random.js

(server must be running)


Connecting with console
-----------------------

    $ node command/main.js

(server must be running)
