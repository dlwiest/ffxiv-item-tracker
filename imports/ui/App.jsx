import React, { Component } from 'react';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import { MobDropsTab, TimedNodesTab, GatheringNodesTab } from './components/tabs';

export default App = () => {
  return (
    <span>
      <PageHeader>Stormblood Overworld Item Tracker</PageHeader>
      <p>Track new gathered items and drops by adding them here as we find them. Items will appear in real time as they're added.</p>
      <Tabs defaultActiveKey={1} id="table-tabs" mountOnEnter>
        <Tab eventKey={1} title="Mob Drops" >
          <MobDropsTab />
        </Tab>
        <Tab eventKey={3} title="Gathering Nodes">
          <GatheringNodesTab />
        </Tab>
        <Tab eventKey={2} title="Timed Nodes">
          <TimedNodesTab />
        </Tab>
      </Tabs>
    </span>
  );
};
