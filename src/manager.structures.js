var structManager = {

    /** @param {StructureSpawn} sSpawnPoint **/
    buildExtensions: function(sSpawnPoint) {
      // We can only build extensions starting at controller level 2
      let room = sSpawnPoint.room;
      if (room.controller.level > 1) {
        // Check if there are already extenions build
        const extensions = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_EXTENSION }});
        // console.log('Spawn has ' + extensions.length + ' extensions available');
        const constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES);
        // console.log('Room has ' + constructionSites.length + ' construction sites');
        // TODO: fix this, until extensions are fully build, this check is 0
        // => Store in room memory
        if (extensions.length == 0 && constructionSites.length < 5) {
          // TODO: check if the given locations around our spawn are free of other structures
          // Build extensions around our spawn
          room.createConstructionSite(sSpawnPoint.pos.x, sSpawnPoint.pos.y-1, STRUCTURE_EXTENSION); // top
          room.createConstructionSite(sSpawnPoint.pos.x, sSpawnPoint.pos.y+1, STRUCTURE_EXTENSION); // bottom
          room.createConstructionSite(sSpawnPoint.pos.x-1, sSpawnPoint.pos.y, STRUCTURE_EXTENSION); // left
          room.createConstructionSite(sSpawnPoint.pos.x+1, sSpawnPoint.pos.y, STRUCTURE_EXTENSION); // right
          // TODO: build number 5
          // Increase number of extensions in our room memory
        }
/*
        // Test codes
        for (var site in constructionSites) {
          console.log(site);
          console.log(site.id + " has stucture type" + site.structureType);
        }
*/
      }
    }
};

module.exports = structManager;
