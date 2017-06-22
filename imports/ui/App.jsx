import React, { PureComponent } from 'react';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import { EorzeaClock } from './components';
import { MobDropsTab, GatheringNodesTab } from './components/tabs';
import { TimedNodesTab } from './components/tabs/TimedNodes'

export default class App extends PureComponent {
  constructor() {
    super();

    this.state = {
      lastHour: null,
      lastNodeWindow: null,
    };
  }

  setLastHour(hour) {
    this.setState({ lastHour: hour });
  }

  setLastNodeWindow(hour) {
    this.setState({ lastNodeWindow: hour });
  }

  render() {
    const { lastHour, lastNodeWindow } = this.state;
    return (
      <div>
        <EorzeaClock
          setLastHour={this.setLastHour.bind(this)}
          setLastNodeWindow={this.setLastNodeWindow.bind(this)}
        />
        <PageHeader>Stormblood Overworld Item Tracker</PageHeader>
        <Tabs defaultActiveKey={1} id="table-tabs" mountOnEnter>
          <Tab eventKey={1} title="Timed Nodes">
            <TimedNodesTab lastHour={lastHour} lastWindow={lastNodeWindow} />
          </Tab>
          <Tab eventKey={2} title="Gathering Nodes">
            <GatheringNodesTab />
          </Tab>
          <Tab eventKey={3} title="Mob Drops" >
            <MobDropsTab />
          </Tab>
        </Tabs>
        <span>{this.state.lastWindow}</span>
      </div>
    );
  }
};
