var roleRepairer = require('role.repairer');

module.exports = {
  run: function(creep) {
    if (creep.room.name != 'E55S48') {
      var westRoom = new RoomPosition(25, 25, 'E55S48');
      creep.moveTo(westRoom);
    } else {
      if (creep.memory.HAVE_LOAD == false && creep.carry.energy == creep.carryCapacity) {
        creep.memory.HAVE_LOAD = true;
        creep.say('\u{1F528}'); // hammer emojii unicode
      }
      if (creep.memory.HAVE_LOAD == true && creep.carry.energy == 0) {
        creep.memory.HAVE_LOAD = false;
        creep.say('\u{267B}'); // recycle emojii unicode
      }
      // Variables
      var HAVE_LOAD = creep.memory.HAVE_LOAD
      var source = creep.pos.findClosestByPath(FIND_SOURCES);
      var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
      // Step 1: Creep does not HAVE_LOAD, is at dropped energy or container -> Pick it up or withdraw it
      // Creep withdraws
      if (!HAVE_LOAD && null != source && creep.pos.isNearTo(source)) {
        creep.harvest(source);
        return OK;
      }
      // Step 2: Creep does not HAVE_LOAD, not at source -> Move to closest one
      if (!HAVE_LOAD && null != source && !creep.pos.isNearTo(source)) {
        creep.moveTo(source, {
          visualizePathStyle: {
            stroke: '#ffffff'
          }
        });
        return OK;
      }
      if (HAVE_LOAD && null != constructionSite && creep.pos.inRangeTo(constructionSite, 3)) {
        creep.build(constructionSite);
        return OK;
      }
      // Step 2: Creep does not HAVE_LOAD, not at container -> Move to fullest one
      if (HAVE_LOAD && null != constructionSite && !creep.pos.inRangeTo(constructionSite, 3)) {
        creep.moveTo(constructionSite, {
          visualizePathStyle: {
            stroke: '#ffffff'
          }
        });
        return OK;
      }
    }
  }
}
