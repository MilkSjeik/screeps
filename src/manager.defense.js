var defenseManager = {

    /** @param {Room} oRoom **/
    defendRoom: function(oRoom) {
      // Tower defense
      const towers = oRoom.find(FIND_MY_STRUCTURES, { filter: (structure) => { return structure.structureType == STRUCTURE_TOWER; } });
      if (towers.length) {
        _.forEach(towers, function(tower){
          // Attack hostile creeps
          const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS); // TODO: attack only creeps with an ATTACK body part
          if (closestHostile) {
            // Taunt, why not?
            oRoom.visual.text(
               '🏹 Ready to defend!',
               tower.pos.x + 1,
               tower.pos.y,
               {align: 'left', opacity: 0.8});
            tower.attack(closestHostile);
          }
          // Repair
          // TODO: let creeps do repairs
          const closestDamagedStructure = tower.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: (structure) => { return structure.hits < structure.hitsMax; } });
          if (closestDamagedStructure){
            tower.repair(closestDamagedStructure);
          }
        });
      }
    }
};
module.exports = defenseManager;
