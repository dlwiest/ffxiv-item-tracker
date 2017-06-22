import React, { PureComponent } from 'react';
import { Row, Col, Panel, Form, FormGroup, Checkbox, Well } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { TimedNodes } from '/imports/api/collections';
import TimedNodesTable from './TimedNodesTable';
import bindFunc from 'memobind';

class TimedNodesTab extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        showMiner: true,
        showBotanist: true,
        showUnspoiled: true,
        showEphemeral: true,
        showFolklore: true,
      }
    };
  }

  filterNodes(nodes) {
    const { form: { showMiner, showBotanist, showUnspoiled, showEphemeral, showFolklore } } = this.state;
    const { lastWindow } = this.props;

    // Handle filter checkboxes
    const filtered = _.filter(nodes, node => {
      return (((showMiner && node.job === 'MIN') || (showBotanist && node.job === 'BTN')) &&
        ((showUnspoiled && node.type === 'Unspoiled') || (showEphemeral && node.type === 'Ephemeral') || (showFolklore && node.type === 'Folklore')));
    });

    // Sort by time, beginning with the most recent active window
    const sorted = _.sortBy(filtered, node => {
      let hour = Number(node.time.split(':')[0]);
      if ((node.type !== 'Ephemeral' && hour < lastWindow) || (node.type === 'Ephemeral' && (hour + 2) < lastWindow)) hour += 12;
      return hour;
    });

    return sorted;
  }

  toggleCheckbox(fieldName) {
    let { form } = this.state;
    const newValue = !form[fieldName];
    form = { ...form, [fieldName]: newValue };
    this.setState({ form });
  }

  render() {
    if (this.props.loading) return <Row><Col sm={12}><p>Loading...</p></Col></Row>;

    const { form: { showMiner, showBotanist, showUnspoiled, showEphemeral, showFolklore } } = this.state;
    const { timedNodes, lastHour, lastWindow } = this.props;
    const filteredNodes = this.filterNodes(timedNodes);

    return (
      <div>
        <Row>
          <Col sm={12}><br /><p>Items that can only be gathered during specific windows Eorzea Time.</p></Col>
        </Row>
        <Panel>
          <Row>
            <Col sm={9}>
              <Form>
                <Row>
                  <Col sm={2}><strong>Job:</strong></Col>
                  <Col sm={10}>
                    <FormGroup>
                      <Checkbox inline checked={showBotanist} onChange={bindFunc(this, 'toggleCheckbox', 'showBotanist')}>Botanist</Checkbox>
                      <Checkbox inline checked={showMiner} onChange={bindFunc(this, 'toggleCheckbox', 'showMiner')}>Miner</Checkbox>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col sm={2}><strong>Nodes:</strong></Col>
                  <Col sm={10}>
                    <FormGroup>
                      <Checkbox inline checked={showUnspoiled} onChange={bindFunc(this, 'toggleCheckbox', 'showUnspoiled')}>Unspoiled</Checkbox>
                      <Checkbox inline checked={showEphemeral} onChange={bindFunc(this, 'toggleCheckbox', 'showEphemeral')}>Ephemeral</Checkbox>
                      <Checkbox inline checked={showFolklore} onChange={bindFunc(this, 'toggleCheckbox', 'showFolklore')}>Folklore</Checkbox>
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </Col>
            <Col sm={3}>
              <strong>Legend:</strong><br />
              <span className="text-success">{`Expires in less than 4 hours`}</span><br />
              <span className="text-warning">{`Expires in less than 2 hours`}</span><br />
              <span className="text-danger">{`Expires in less than 1 hour`}</span><br />
            </Col>
          </Row>
        </Panel>
        <Row>
          <Col sm={12}>
            <TimedNodesTable
              rows={filteredNodes}
              lastWindow={lastWindow}
              lastHour={lastHour}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default TimedNodesTabContainer = createContainer(() => {
  const subHandle = Meteor.subscribe('timedNodes');

  return {
    loading: !subHandle.ready(),
    timedNodes: TimedNodes.find({}, {sort: { type: -1 }}).fetch(),
  }
}, TimedNodesTab);
