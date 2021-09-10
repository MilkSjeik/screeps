function cleanup () {
  // cleanup memory deleted screeps
  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log('Clearing non-existing creep memory:', name);
    }
  }
}

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
    findSources();
  }
};
