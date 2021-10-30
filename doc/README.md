# Screep notes
## Introduction
These are personal notes, taken when going through the Screeps tutorial and [documentation](https://docs.screeps.com/).

## Tutorial
### Steps
Basic steps done in the tutorial, required "tasks" to play the game:
- Spawn creep
- Collect energy
    1) Return energy to spawn, needed to spawn more creeps
    2) Deliver energy to room controller
- Upgrade room controller
- Build extensions, to store more energy
- Build bigger creeps
- Construct tower
### Scripts
[Tutorial scripts on github](https://github.com/screeps/tutorial-scripts)
### Basic Scripting
#### Spawn Creep
```
Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, MOVE], 'Harvester1' );
```
#### Energy Source
Harvest with creeps that have `WORK` parts, transport with creeps that have `CARRY` parts.
```
module.exports.loop = function () {
    var creep = Game.creeps['Harvester1'];
    var sources = creep.room.find(FIND_SOURCES);
    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0]);
    }
}
```
[Room.find](https://docs.screeps.com/api/#Room.find)
#### Return energy to spawn
```
module.exports.loop = function () {
    var creep = Game.creeps['Harvester1'];

    if(creep.store.getFreeCapacity() > 0) {
        var sources = creep.room.find(FIND_SOURCES);
        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0]);
        }
    }
    else {
        if( creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE ) {
            creep.moveTo(Game.spawns['Spawn1']);
        }
    }
}
```
[Creep.transfer](https://docs.screeps.com/api/#Creep.transfer)
[Creep.store](https://docs.screeps.com/api/#Creep.store)
#### Second creep
```
Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, MOVE], 'Harvester2' );
```

```
module.exports.loop = function () {
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        if(creep.store.getFreeCapacity() > 0) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else {
            if(creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['Spawn1']);
            }
        }
    }
}
```
#### Separate scripts in modules
https://docs.screeps.com/modules.html
```
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.store.getFreeCapacity() > 0) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else {
            if(creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['Spawn1']);
            }
        }
	}
};

module.exports = roleHarvester;
```
Change the main module code:
```
var roleHarvester = require('role.harvester');

module.exports.loop = function () {

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        roleHarvester.run(creep);
    }
}
```
### Upgrading Controller
Invincible structure used to build faclilities in the room.
Required! Controller loses level with every 20000 game ticks. Level 0 = lose control.
#### Upgrader Creep
```
Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, MOVE], 'Upgrader1' );
```
#### Creeper memory
Used to assign a different role
```
Game.creeps['Harvester1'].memory.role = 'harvester';
Game.creeps['Upgrader1'].memory.role = 'upgrader';
```
#### role.upgrader module
```
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.store[RESOURCE_ENERGY] == 0) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
	}
};

module.exports = roleUpgrader;
```
https://docs.screeps.com/api/#RoomObject.room
https://docs.screeps.com/api/#Room.controller
https://docs.screeps.com/api/#Creep.upgradeController

Update main module with divided roles:
```
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');

module.exports.loop = function () {

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
    }
}
```

### Building structures
Controller upgrade gives access to new structures:
- walls
- ramparts
- extensions
#### Extensions
- Allows to build larger creeps
- More body parts = works faster
- Number of extensions increases with every controller level
#### Builder creep
```
Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, MOVE], 'Builder1', { memory: { role: 'builder' } } );
```

`role.builder`:
- search construction site
- remember creeper task in memory
- visualizePathStyle
```
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
	    }
	    else {
	        var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
	    }
	}
};

module.exports = roleBuilder;
```
https://docs.screeps.com/api/#Creep.say
https://docs.screeps.com/api/#Creep.build
http://unicode.org/emoji/charts/emoji-style.txt

Update `main`:
```
var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
```
#### Maintain extensions
Extensions also require energy
Update `harverster.role`:
- filter on found structures: `Game.structures` object or search within the room with the help of `Room.find(FIND_STRUCTURES)`. In both cases, you will need to filter the list of items on the condition `structure.structureType == STRUCTURE_EXTENSION` (or, alternatively, `structure instanceof StructureExtension`)`


```
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.store.getFreeCapacity() > 0) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
	}
};

module.exports = roleHarvester;
```
[Game.structures](https://docs.screeps.com/api/#Game.structures)
[StructureExtension](https://docs.screeps.com/api/#StructureExtension)
#### Output total amount of energy in the room
`main`:
```
var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

    for(var name in Game.rooms) {
        console.log('Room "'+name+'" has '+Game.rooms[name].energyAvailable+' energy');
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
```
#### Bigger creep
```
Game.spawns['Spawn1'].spawnCreep( [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], 'HarvesterBig', { memory: { role: 'harvester' } } );
```
=> Drains the 550 energy the room had to 0
Benifits of larger/powerfull creeps:
- improve effectiveness
- save CPU resources in controller them (lof of small vs few larger)
### Auto-spawning creeps
Add the output of the number of creeps with the role harvester into the console:
```
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');

module.exports.loop = function () {

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    console.log('Harvesters: ' + harvesters.length);

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
    }
}
```
https://docs.screeps.com/api/#Game.creeps
https://lodash.com/docs#filter

- RoomVisual call in order to visualize what creep is being spawned.
```
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');

module.exports.loop = function () {

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    console.log('Harvesters: ' + harvesters.length);

    if(harvesters.length < 2) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: 'harvester'}});        
    }

    if(Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
    }
}
```
https://docs.screeps.com/api/#RoomVisual
https://docs.screeps.com/api/#StructureSpawn.spawnCreep
#### Simulate dead of creeper
```
Game.creeps['Harvester1'].suicide()
```
#### Clear memory
An important point here is that the memory of dead creeps is not erased but kept for later reuse. If you create creeps with random names each time it may lead to memory overflow, so you should clear it in the beginning of each tick (prior to the creep creation code).
```
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    console.log('Harvesters: ' + harvesters.length);

    if(harvesters.length < 2) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: 'harvester'}});
    }

    if(Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
    }
}
```
#### Renew creep
Another option (instead of respawning a creep):
https://docs.screeps.com/api/#StructureSpawn.renewCreep
### Defending your room
https://docs.screeps.com/defense.html
#### Activate safe mode
The surest way to fend off an attack is using the room Safe Mode. In safe mode, no other creep will be able to use any harmful methods in the room (but you’ll still be able to defend against strangers).
```
Game.spawns['Spawn1'].room.controller.activateSafeMode();
```
http://docs.screeps.com/api/#StructureController.activateSafeMode
#### Construct tower
Place the construction site for the tower (manually or using the code below).
```
Game.spawns['Spawn1'].room.createConstructionSite( 23, 22, STRUCTURE_TOWER );
```
=> "builder" creeper should start construction
http://docs.screeps.com/api/#StructureTower
http://docs.screeps.com/api/#Room.createConstructionSite
#### Provide tower with energy
Add STRUCTURE_TOWER to the module role.harvester filter and wait for the energy to appear in the tower.
```
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.store.getFreeCapacity() > 0) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
	}
};

module.exports = roleHarvester;
```
#### Use tower
Like a creep, a tower has several similar methods: attack, heal, and repair. Each action spends 10 energy units. We need to use attack on the closest enemy creep upon its discovery. Remember that distance is vital: the effect can be several times stronger with the same energy cost!

main:
```
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

   var tower = Game.getObjectById('423c7470fd9878945619e0ce');
   if(tower) {
       var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
       if(closestHostile) {
           tower.attack(closestHostile);
       }
   }

   for(var name in Game.creeps) {
       var creep = Game.creeps[name];
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
```
http://docs.screeps.com/api/#Game.getObjectById
http://docs.screeps.com/api/#RoomObject.pos
http://docs.screeps.com/api/#RoomPosition.findClosestByRange
http://docs.screeps.com/api/#StructureTower.attack
#### Repair damaged structures
Damaged structures can be repaired by both creeps and towers. Let’s try to use a tower for that. We’ll need the method `repair`. You will also need the method `Room.find` and a filter to locate the damaged walls.
Note that since walls don’t belong to any player, finding them requires the constant `FIND_STRUCTURES` rather than `FIND_MY_STRUCTURES`.
```
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

    var tower = Game.getObjectById('423c7470fd9878945619e0ce');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
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
```
http://docs.screeps.com/api/#Room.find
http://docs.screeps.com/api/#StructureTower.repair

## Documentation

### API
https://docs.screeps.com/api/
### Game
https://docs.screeps.com/api/#Game
### Memory
https://docs.screeps.com/global-objects.html#Memory-object
