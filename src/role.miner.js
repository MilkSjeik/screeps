const Logger = require('./logger');
const L = require('./logger.constants');

const roleMiner = {
  /** @param {Creep} creep **/
  run: function (creep) {
    const log = new Logger(L.DEBUG);

    if (!creep.memory.source) {
      let foundSource = false;
      // TODO: find energy source with container nearby
      // Sources already stored in memory:
      // room.memory.sources
      let sources = creep.room.memory.sources;
      for(const i in Game.creeps) {
        // loop all creeps and pull each source found
      }


      for (source in sources) {
        // check if another creep already uses this source
        let iSourceId = sources[source];
        log.msg(L.DEBUG, 'Verifing sourceid: ' + iSourceId);
        for(const i in Game.creeps) {

        }
      }
    }


/*
  room.memory.sources = table of sourceids

  => miner spawned -> link to source id
    - only source id that has no miner!
    - what when miner dies?
    - what when we want more then one miner?

    options:
    1) store in miner
      - loop all miners
      - keep only source that has no miners assigned
        = assign this source
      => more difficult when multilpe miners are wanted
    2) store in room
      - assign first spawn miner id where not enough miners are found
      - when miner dies, loop all rooms and all spawns


*/

  }
}

module.exports = roleMiner;
