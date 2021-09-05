/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
      if(creep.carry.energy < creep.carryCapacity) {
          // TODO: sources already searched in main
          // - loop found found sources
          // - assign (empty) creep to source with most energy
          var sources = creep.room.find(FIND_SOURCES);
          if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
              creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
          }
      }
      else {
        // find targets (spawn or extensions) that can receive energy
        let targets = creep.room.find(FIND_STRUCTURES, { filter: (structure) => {return
                                        (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN)
                                        && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;}
                                      });
        console.log('Found ' + targets.length + ' in need of energy');
        // TODO: filter above not working as expected
        let testtargets = creep.room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_EXTENSION }});
        console.log('Found ' + testtargets.length + ' testtargets: ' + testtargets);

        let extensions = creep.room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_EXTENSION }});
        for (let extension in extensions) {
          console.log('extension free capacity: ' + extension.getFreeCapacity);
        }

        if(targets.length > 0) {
          if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
          }
        }
      }
    }
};

module.exports = roleHarvester;
