var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1]);
            }
        }
        else {
            console.log(creep.name + ": energy full");
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                console.log(creep.name + ": moving to room controller");
                creep.moveTo(creep.room.controller);
            }
        }
	}
};

module.exports = roleUpgrader;
