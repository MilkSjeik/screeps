function cleanup () {
  // cleanup memory deleted screeps
  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log('Clearing non-existing creep memory:', name);
    }
  }
}


function initBrain() {
  // Set default number of creeps per role
  _.forEach(Game.rooms, (room) => {
    // Verify if the room is already stored in memory
    if (!room.memory.creeps) {
      // If not, define default number of creep per role
      room.memory.creeps = [{ "role" : "miner", "number": 1},
                            { "role" : "transporter", "number": 1},
                            { "role" : "builder", "number": 3},
                            { "role" : "harvester", "number": 3},
                            { "role" : "upgrader", "number": 3}];
    }
  });
}

// TODO: retrieve number of wanted creeps with lodash filter function:
//         var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.room.name == room.name);


function findSources () {
  // Find sources per room')
  _.forEach(Game.rooms, (room) => {
    // JSON.stringify((Game.rooms['E41N16']).memory) = {}
    // Verify if the room is already stored in memory
    if (!room.memory.sources) { // If not, find sources
      let sources = room.find(FIND_SOURCES);
      let sourceids = [];

      for (let sourceKey in sources) {
        let source = sources[sourceKey];
        console.log('🟡 Position source with id: ' + source.id + ' in ' + source.pos.roomName + ': x=' + source.pos.x + ' y=' + source.pos.y);
        sourceids.push(source.id);
      }
      room.memory.sources = sourceids;
    }
  });
}

module.exports = {
  run: function () {
    cleanup();
    initBrain();
    findSources();
  }
};
