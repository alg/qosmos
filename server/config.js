module.exports = {
  commandCenterPort: 41412,
  gameServerPort: 41414,
  multicastHost: '224.0.0.',
  multicastPort: 41413,

  fieldWidth:  10,
  fieldHeight: 10,
  tickInterval: 200,

  // energy to suck from the weaker
  energyDrain: 5,

  // energy in refill pack
  energyInPack: 10,

  // ticks between deployments of energy packs
  energyPackInterval: 15
}
