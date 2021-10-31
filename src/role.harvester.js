/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing'
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester')
 * mod.thing == 'a thing' // true
 */
const Logger = require("logger");
const L = require("./logger.constants");

const roleHarvester = {
  /** @param {Creep} creep **/
  run: function (creep) {
    const log = new Logger(L.INFO);

    if (creep.carry.energy < creep.carryCapacity) {
      // TODO: sources already searched in main
      // - loop found found sources
      // - assign (empty) creep to source with most energy
      var sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0]);
      }
    } else {
      // Room.find(type, [opts]) -> more info, see Room api
      //    - type = One of the FIND_* constants.
      //    - opts = filter object, function, string
      //             The result list will be filtered using the Lodash.filter method.
      //           In this case:
      //             - filter: callback funtion
      //             - callback function as ES6 arrow function: (structure) => { return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0; }
      //             - what is after 'return' is the "if" condition or structure has to apply to
      let targets = creep.room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
          return (
            (structure.structureType == STRUCTURE_EXTENSION ||
              structure.structureType == STRUCTURE_SPAWN) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
          );
        }
      });
      // console.log(targets)
      for (let target in targets) {
        log.msg(
          L.DEBUG,
          targets[target].structureType +
            targets[target].id +
            " free capacity: " +
            targets[target].store.getFreeCapacity(RESOURCE_ENERGY)
        );
      }
      if (targets.length > 0) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: "#ffffff" }
          });
        }
      }
    }
  }
};

module.exports = roleHarvester;
