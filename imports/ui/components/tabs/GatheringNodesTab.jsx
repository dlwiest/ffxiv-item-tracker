import React, { PureComponent } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { GatheringNodes } from '/imports/api/collections';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Popover from 'react-bootstrap/lib/Popover';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { AddEditGatheringNodeModal, ConfirmModal } from '../modals';
import bindFunc from 'memobind';
import SmahtTable from '../SmahtTable';

class GatheringNodesTab extends PureComponent {
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

    Meteor.call('removeGatheringNode', { nodeId }, err => {
      if (err) console.log(err);
      else this.showModal('removeModal', false);
    });
  }

  render() {
    if (this.props.loading) return <p>Loading...</p>;

    const { gatheringNodes } = this.props;
    const { modals: { addModal, editModal, removeModal }, selectedNode } = this.state;

    const self = this;
    const columns = [{
      heading: 'Item Name',
      display: 'itemName'
    }, {
      heading: 'Map',
      display: 'map'
    }, {
      heading: 'X Coord',
      display: 'xCoord'
    }, {
      heading: 'Y Coord',
      display: 'yCoord'
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
      sortBy: 'note'
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
        <Col xs={12}><br /><p>Items available to be gathered at any time.</p></Col>
        <Col xs={12}>
          <SmahtTable columns={columns} rows={gatheringNodes} noResultsMessage="Nothing Here" customButton={<Button block bsStyle="primary" onClick={bindFunc(this,'showModal', 'addModal', true)}>Add New</Button>} />
        </Col>
        {(addModal || editModal) && <AddEditGatheringNodeModal selectedNode={selectedNode} add={addModal} onHide={bindFunc(this, 'showModal', (addModal ? 'addModal' : 'editModal'), false)} />}
        <ConfirmModal show={removeModal} onCancel={bindFunc(this, 'showModal', 'removeModal', false)} onConfirm={this.removeNode} />
      </Row>
    );
  }
}

export default GatheringNodesTabContainer = createContainer(() => {
  const subHandle = Meteor.subscribe('gatheringNodes');

  return {
    loading: !subHandle.ready(),
    gatheringNodes: GatheringNodes.find().fetch()
  }
}, GatheringNodesTab);
