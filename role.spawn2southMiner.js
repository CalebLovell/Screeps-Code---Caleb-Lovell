module.exports = {
  run: function(creep) {
    var HAVE_LOAD = creep.memory.HAVE_LOAD;
    // state switching
    if (creep.memory.HAVE_LOAD == false && creep.carry.energy == creep.carryCapacity) {
      creep.memory.HAVE_LOAD = true;
      creep.say('\u{1F6E0}'); // hammer and wrench emojii unicode
    }
    if (creep.memory.HAVE_LOAD == true && creep.carry.energy == 0) {
      creep.memory.HAVE_LOAD = false;
      creep.say('\u{26CF}'); // pick emojii unicode
    }
    if (creep.room.name != 'E55S48') {
      var westRoom = new RoomPosition(25, 25, 'E55S48');
      creep.moveTo(westRoom);
    } else {
      var brokenContainer = creep.pos.findInRange(FIND_STRUCTURES, 0, {
        filter: (s) => (s.structureType == STRUCTURE_CONTAINER) &&
          s.hits < s.hitsMax
      });
      let sources = creep.room.find(FIND_SOURCES);
      var chosenSource;
      var containerBySource;
      for (var s in sources) {
        var nearByMiners = sources[s].pos.findInRange(FIND_MY_CREEPS, 1, {
          filter: (c) => c.memory.role == 'spawn2southMiner' && c != creep
        });
        // console.log("sources: " + sources[s]);
        containerBySource = sources[s].pos.findInRange(FIND_STRUCTURES, 1, {
          filter: {
            structureType: STRUCTURE_CONTAINER
          }
        })
        if (containerBySource.length == 0) {
          continue;
        }
        if (nearByMiners.length == 0) {
          chosenSource = s;
          break;
        }
      }
      //console.log("chosensource: " + chosenSource);
      let allContainers = creep.room.find(FIND_STRUCTURES, {
        filter: {
          structureType: STRUCTURE_CONTAINER
        }
      });
      //console.log(allContainers)
      var onContainer = false;
      for (var i in allContainers) {
        if (creep.pos.isEqualTo(allContainers[i])) {
          onContainer = true;
        }
      }
      //console.log("cont:" + container);
      if (onContainer) {
        if (brokenContainer.length > 0 && HAVE_LOAD) {
          creep.repair(brokenContainer[0])
        } else {
          //console.log("on container");
          var sourceToHarvest = creep.pos.findInRange(FIND_SOURCES, 1);
          creep.harvest(sourceToHarvest[0]);
        }
      } else {
        //console.log("not on container")
        creep.moveTo(containerBySource[0], {
          visualizePathStyle: {
            stroke: '#ffaa00'
          }
        });
      }
    }
  }
};
