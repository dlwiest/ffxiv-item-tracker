import { MobDrops, TimedNodes, GatheringNodes } from './collections';

Meteor.publish('mobDrops', function() {
  this.unblock();

  return MobDrops.find();
});

Meteor.publish('timedNodes', function() {
  this.unblock();

  return TimedNodes.find();
});

Meteor.publish('gatheringNodes', function() {
  this.unblock();

  return GatheringNodes.find();
});
