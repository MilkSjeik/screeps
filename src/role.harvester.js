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
                creep.moveTo(sources[0]);
            }
        }
        else if(Game.spawns['MilkyWay'].store[RESOURCE_ENERGY] < Game.spawns['MilkyWay'].store.getCapacity(RESOURCE_ENERGY)) {
            if(creep.transfer(Game.spawns['MilkyWay'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['MilkyWay']);
            }
        }
    }
};

module.exports = roleHarvester;
