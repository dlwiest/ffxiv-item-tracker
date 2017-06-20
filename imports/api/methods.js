import { MobDrops, TimedNodes, GatheringNodes } from './collections';

Meteor.methods({
  addNewTimedNode({ itemName, job, level, type, time, map, xCoord, yCoord, slot, note }) {
    return TimedNodes.insert({
      itemName,
      job,
      level,
      type,
      time,
      map,
      xCoord,
      yCoord,
      slot,
      note,
      createdDate: new Date()
    });
  },
  editTimedNode({ nodeId, itemName, job, level, type, time, map, xCoord, yCoord, slot, note }) {
    return TimedNodes.update({
      _id: nodeId
    }, {
      $set: {
        itemName,
        job,
        level,
        type,
        time,
        map,
        xCoord,
        yCoord,
        slot,
        note
      }
    });
  },
  removeTimedNode({ nodeId }) {
    return TimedNodes.remove({ _id: nodeId });
  },
  addNewGatheringNode({ itemName, map, xCoord, yCoord, note }) {
    return GatheringNodes.insert({
      itemName,
      map,
      xCoord,
      yCoord,
      note,
      createdDate: new Date()
    });
  },
  editGatheringNode({ nodeId, itemName, map, xCoord, yCoord, note }) {
    return GatheringNodes.update({
      _id: nodeId
    }, {
      $set: {
        itemName,
        map,
        xCoord,
        yCoord,
        note
      }
    });
  },
  removeGatheringNode({ nodeId }) {
    return GatheringNodes.remove({ _id: nodeId });
  },
  addNewMobDrop({ itemName, mobName, map, xCoord, yCoord, note }) {
    return MobDrops.insert({
      itemName,
      mobName,
      map,
      xCoord,
      yCoord,
      note,
      createdDate: new Date()
    });
  },
  editMobDrop({ itemName, mobDropId, mobName, map, xCoord, yCoord, note }) {
    return MobDrops.update({
      _id: mobDropId
    }, {
      $set: {
        itemName,
        mobName,
        map,
        xCoord,
        yCoord,
        note
      }
    });
  },
  removeMobDrop({ mobDropId }) {
    return MobDrops.remove({ _id: mobDropId });
  }
});
