// Constants
const sSpawnName = 'MilkyWay' // The primary StructureSpawn created at the start of the game

// Spawn a creep:
// Game.spawns.MilkyWay.createCreep([WORK,CARRY,MOVE,MOVE])
// Returns a name? -> Michael
// Set role: Game.creeps.Michael.memory.role = 'harvester'

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {
  let sSpawnPoint = undefined;

  // Lookup SpawnPoint
  for (let spawn in Game.spawns) {
    // TODO: build debugging mode flag
    // console.log("Found spawn point: " + spawn)
    // Obsolete check?
    if (spawn == sSpawnName) { // our own spawn point
      sSpawnPoint = Game.spawns[spawn];
    }
    else { // when another room is "captured"
      console.log("Found spawn point with another name: " + spawn)
      sSpawnPoint = Game.spawns[spawn];
    }

    // Double check if a StructureSpawn object is found
    if (sSpawnPoint != undefined) {
      // TODO: when called the first time, save sources in Room.memory
      // Check StructureSpawn Position
      /* console.log("Spawn position in " + sSpawnPoint.pos.roomName
                  + ": x=" + sSpawnPoint.pos.x
                  + " y=" + sSpawnPoint.pos.y);
      */
      // Lookup energy sources in the room where the StructureSpawn is located
      // Lookup energy sources
      let sources = sSpawnPoint.room.find(FIND_SOURCES);
      for (let sourceKey in sources) {
        let source = sources[sourceKey];
        //console.log("🟡 Position source with id: " + source.id + " in " + source.pos.roomName + ": x=" + source.pos.x + " y=" + source.pos.y);
      }
    }
  }


  // Cleanup Memory
  for(var name in Memory.creeps) {
    if(!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log('Clearing non-existing creep memory:', name);
    }
  }

  // Creeps
  // Count our harvesters
  var nHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
//  console.log('# harvesters: ' + nHarvesters.length);
  var nBuilders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
//  console.log('# builders: ' + nBuilders.length);
  var nUpgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
//  console.log('# upgraders: ' + nUpgraders.length);

  if(nHarvesters.length < 2) {
    var newName = 'Harvester' + Game.time;
    console.log('Spawning new harvester: ' + newName);
    sSpawnPoint.spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'harvester'}});
  }
  else if(nUpgraders.length < 1) {
    var newName = 'Upgrader' + Game.time;
    console.log('Spawning new upgrader: ' + newName);
    sSpawnPoint.spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'upgrader', upgrading: false}});
  }
  else if(nBuilders.length < 1) {
    var newName = 'Builder' + Game.time;
    console.log('Spawning new builder: ' + newName);
    sSpawnPoint.spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'builder'}});
  }

  // Display message when spawning a creep
  if(sSpawnPoint.spawning) {
    var spawningCreep = Game.creeps[Game.spawns['MilkyWay'].spawning.name];
    sSpawnPoint.room.visual.text(
        '🛠️' + spawningCreep.memory.role,
        Game.spawns['MilkyWay'].pos.x + 1,
        Game.spawns['MilkyWay'].pos.y,
        {align: 'left', opacity: 0.8});
  }

  // We can only build extensions starting at controller level 2
  if (sSpawnPoint.room.controller.level > 1) {
    // Check if there are already extenions build
    const extensions = sSpawnPoint.room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_EXTENSION }});
    console.log('Spawn has ' + extensions.length + ' extensions available');
    // TODO: fix this, until extensions are fully build, this check is 0
    // => Store in room memory
    if (extensions.length == 0) {
      // Build extensions around our spawn when a builder creep is available
      /* 4 extensions around spawn:
         - top    = y - 2
         - bottom = y + 2
         - left   = x - 2
         - right  = y + 2
      */
    }
  // Spawn location:
  // sSpawnPoint.pos.x
  // sSpawnPoint.pos.y
  //sSpawnPoint.room.createConstructionSite()
  }


  for(var name in Game.creeps) {
    var creep = Game.creeps[name];
    //console.log(creep.name + ": role = " + creep.memory.role);
    if(creep.memory.role == 'harvester') {
      roleHarvester.run(creep);
    }
    if(creep.memory.role == 'upgrader') {
      roleUpgrader.run(creep);
    }
    if(creep.memory.role == 'builder') {
      roleBuilder.run(creep);
    }
  }
}
