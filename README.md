Requirements
------------

- node 0.10.1+
- npm install ansi

Rules
-----

- game field has known dimensions
- bots are deployed to the game field in random spots
- bots are controlled remotely by players' client applications
- each bot has 100 points of energy
- in the beginning of each game tick the state of the field is broadcast
- bots have certain time (currently 300ms) to make a decision and send
  a move command (up, down, left or right)
- neighboring bots exchange energy in a way that the one with more
  energy sucks 5 points of energy per game tick from the weaker one
- you get score points for each kill
- every now and then an energy pack is deployed
- and it expires in (fieldWidth + fieldHeight) ticks
- to collect energy pack you need to walk on it
- the goal is to beat the rest


Outstanding tasks
-----------------

- resetting bots list
  - add PING - PONG and remove non-responding bots at
    the beginning of the round

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
