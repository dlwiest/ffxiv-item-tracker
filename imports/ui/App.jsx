import React, { Component } from 'react';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import { EorzeaClock } from './components';
import { MobDropsTab, TimedNodesTab, GatheringNodesTab } from './components/tabs';

export default App = () => {
  return (
    <div>
      <EorzeaClock />
      <PageHeader>Stormblood Overworld Item Tracker</PageHeader>
      <Tabs defaultActiveKey={1} id="table-tabs" mountOnEnter>
        <Tab eventKey={1} title="Timed Nodes">
          <TimedNodesTab />
        </Tab>
        <Tab eventKey={2} title="Gathering Nodes">
          <GatheringNodesTab />
        </Tab>
        <Tab eventKey={3} title="Mob Drops" >
          <MobDropsTab />
        </Tab>
      </Tabs>
    </div>
  );
};
