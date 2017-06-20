import React, { PureComponent } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { TimedNodes } from '/imports/api/collections';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Label from 'react-bootstrap/lib/Label';
import Popover from 'react-bootstrap/lib/Popover';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { AddEditTimedNodeModal, ConfirmModal } from '../modals';
import bindFunc from 'memobind';
import SmahtTable from '../SmahtTable';

class TimedNodesTab extends PureComponent {
  constructor(props) {
    super(props);

    this.removeNode = this.removeNode.bind(this);

    this.state = {
      selectedNode: {},
      modals: {
        addModal: false,
        editModal: false,
        removeModal: false
      }
    };
  }

  showModal(modalName, show) {
    let { modals } = this.state;
    modals = { ...modals, [modalName]: show };
    this.setState({ modals });
  }

  editNode(selectedNode) {
    this.setState({
      selectedNode
    }, () => { this.showModal('editModal', true); })
  }

  confirmRemoveNode(selectedNode) {
    this.setState({
      selectedNode
    }, () => { this.showModal('removeModal', true); });
  }

  removeNode() {
    const { _id: nodeId } = this.state.selectedNode;

    Meteor.call('removeTimedNode', { nodeId }, err => {
      if (err) console.log(err);
      else this.showModal('removeModal', false);
    });
  }

  render() {
    if (this.props.loading) return <p>Loading...</p>;

    const { timedNodes } = this.props;
    const { modals: { addModal, editModal, removeModal }, selectedNode } = this.state;

    const self = this;
    const columns = [{
      heading: 'Item Name',
      display: 'itemName'
    }, {
      heading: 'Job',
      display({ job }) { return job === 'BTN' ? <Label bsStyle="success">BTN</Label> : <Label bsStyle="warning">MIN</Label> },
      sortBy: 'job',
    }, {
      heading: 'Level',
      display: 'level',
    }, {
      heading: 'Type',
      display: 'type',
    }, {
      heading: 'Time',
      display: 'time'
    }, {
      heading: 'Map',
      display: 'map',
    }, {
      heading: 'Position',
      display({ xCoord, yCoord }) { return `${xCoord}, ${yCoord}` },
      disableSort: true,
    }, {
      heading: 'Slot',
      display: 'slot',
      disableSort: true,
    }, {
      heading: 'Note',
      display(node) {
        if (!node.note) return '-';
        const pop = (
          <Popover id={node._id} title={node.itemName}>
            {node.note}
          </Popover>
        );
        return (
          <OverlayTrigger trigger={['hover', 'click']} rootClose placement="top" overlay={pop}>
            <Glyphicon glyph="comment" />
          </OverlayTrigger>
        );
      },
      disableSort: true,
    }, {
      heading: '',
      disableSort: true,
      noWrap: true,
      display(node) {
        return (
          <ButtonGroup bsSize="xs">
            <Button bsStyle="info" onClick={bindFunc(self, 'editNode', node)}>Edit</Button>
            <Button bsStyle="danger" onClick={bindFunc(self, 'confirmRemoveNode', node)}>Remove</Button>
          </ButtonGroup>
        );
      }
    }];

    return (
      <Row>
        <Col xs={12}><br /><p>Items that can only be gathered during specific windows Eorzea Time.</p></Col>
        <Col xs={12}>
          <SmahtTable columns={columns} rows={timedNodes} noResultsMessage="Nothing Here" customButton={<Button block bsStyle="primary" onClick={bindFunc(this,'showModal', 'addModal', true)}>Add New</Button>} />
        </Col>
        {(addModal || editModal) && <AddEditTimedNodeModal selectedNode={selectedNode} add={addModal} onHide={bindFunc(this, 'showModal', (addModal ? 'addModal' : 'editModal'), false)} />}
        <ConfirmModal show={removeModal} onCancel={bindFunc(this, 'showModal', 'removeModal', false)} onConfirm={this.removeNode} />
      </Row>
    );
  }
}

export default TimedNodesTabContainer = createContainer(() => {
  const subHandle = Meteor.subscribe('timedNodes');

  return {
    loading: !subHandle.ready(),
    timedNodes: TimedNodes.find().fetch()
  }
}, TimedNodesTab);
