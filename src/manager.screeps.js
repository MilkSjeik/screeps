const Logger = require('./logger');
const L = require('./logger.constants');
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleMiner = require('role.miner');

const log = new Logger(L.DEBUG);

/** @param {Room} oRoom **/
function getBody (oRoom, sRole) {
  let body = [];

  let energyAvailable = oRoom.energyAvailable;

  if (sRole === 'miner') {
    // only one MOVE and CARRY part
    body.push(MOVE);
    body.push(CARRY);

    let creepCost = _.sum(body, p => BODYPART_COST[p]);
    // what is left = WORK parts
    let maxparts = Math.floor((energyAvailable - creepCost)/BODYPART_COST[WORK]);

    log.msg(L.DEBUG, 'Energy available: ' + energyAvailable);
    log.msg(L.DEBUG, 'Basic creep cost: ' + creepCost);

    _.times(maxparts, function() {
      body.push(WORK)
    });
  }
  log.msg(L.DEBUG, 'Wanted creep with role ' + sRole + ' and body: ' + body);
  //sSpawnPoint.spawnCreep(getBody(oRoom, sRole), newName, {memory: {role: sRole}});

  return body;
}

function runCreeps () {
  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    // console.log(creep.name + ": role = " + creep.memory.role)
    if (creep.memory.role == 'harvester') {
      roleHarvester.run(creep);
    }
    else if (creep.memory.role == 'upgrader') {
      roleUpgrader.run(creep);
    }
    else if (creep.memory.role == 'builder') {
      roleBuilder.run(creep);
    }
    else if (creep.memory.role == 'miner') {
      roleMiner.run(creep);
    }
  }
}

/** @param {Room} oRoom **/
function spawnCreep (oRoom, sRole) {
  const sSpawnPoint = oRoom.find(FIND_MY_SPAWNS)[0];
  const newName = sRole + Game.time;

  sSpawnPoint.spawnCreep(getBody(oRoom, sRole), newName, {memory: {role: sRole}});

  if (sSpawnPoint.spawning) {
    var spawningCreep = Game.creeps[sSpawnPoint.spawning.name];
    sSpawnPoint.room.visual.text(
      '🛠️' + spawningCreep.memory.role,
      sSpawnPoint.pos.x + 1,
      sSpawnPoint.pos.y,
      {align: 'left', opacity: 0.8});
  }
}

/** @param {Room} oRoom **/
function verifyCreeps (oRoom) {
/*
  log.msg(L.DEBUG, JSON.stringify(oRoom.memory.creeps));
  log.msg(L.DEBUG, (_.find(oRoom.memory.creeps, {"role" : "miner"})).number);

  const nMiners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
  if (nMiners <
*/
  const numberOfMinersWanted = (_.find(oRoom.memory.creeps, {"role" : "miner"})).number;
  const numberOfMinerCreeps = (_.filter(oRoom.find(FIND_CREEPS), (creep) => creep.memory.role == 'miner')).length;
  log.msg(L.DEBUG, 'Miners: ' + numberOfMinerCreeps + '/' + numberOfMinersWanted);
  if (numberOfMinerCreeps < numberOfMinersWanted) {
    spawnCreep(oRoom, 'miner');
  }
}


module.exports = {
  /** @param {Room} oRoom **/
  run: function (oRoom) {
    verifyCreeps(oRoom);
    runCreeps();
  }
};
