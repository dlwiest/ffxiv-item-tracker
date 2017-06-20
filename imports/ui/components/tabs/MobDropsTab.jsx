import React, { PureComponent } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { MobDrops } from '/imports/api/collections';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Popover from 'react-bootstrap/lib/Popover';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { AddEditMobDropModal, ConfirmModal } from '../modals';
import bindFunc from 'memobind';
import SmahtTable from '../SmahtTable';

class MobDropsTab extends PureComponent {
  constructor(props) {
    super(props);

    this.removeMobDrop = this.removeMobDrop.bind(this);

    this.state = {
      selectedMobDrop: {},
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

  editMobDrop(selectedMobDrop) {
    this.setState({
      selectedMobDrop
    }, () => { this.showModal('editModal', true); })
  }

  confirmRemoveMobDrop(selectedMobDrop) {
    this.setState({
      selectedMobDrop
    }, () => { this.showModal('removeModal', true); });
  }

  removeMobDrop() {
    const { _id: mobDropId } = this.state.selectedMobDrop;

    Meteor.call('removeMobDrop', { mobDropId }, err => {
      if (err) console.log(err);
      else this.showModal('removeModal', false);
    });
  }

  render() {
    if (this.props.loading) return <p>Loading...</p>;

    const { mobDrops } = this.props;
    const { modals: { addModal, editModal, removeModal }, selectedMobDrop } = this.state;

    const self = this;
    const columns = [{
      heading: 'Item Name',
      display: 'itemName',
    }, {
      heading: 'Mob Name',
      display: 'mobName'
    }, {
      heading: 'Map',
      display: 'map'
    }, {
      heading: 'X',
      display: 'xCoord'
    }, {
      heading: 'Y',
      display: 'yCoord'
    }, {
      heading: 'Note',
      display(mobDrop) {
        if (!mobDrop.note) return '-';
        const pop = (
          <Popover id={mobDrop._id} title={mobDrop.itemName}>
            {mobDrop.note}
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
      display(mobDrop) {
        return (
          <ButtonGroup bsSize="xs">
            <Button bsStyle="info" onClick={bindFunc(self, 'editMobDrop', mobDrop)}>Edit</Button>
            <Button bsStyle="danger" onClick={bindFunc(self, 'confirmRemoveMobDrop', mobDrop)}>Remove</Button>
          </ButtonGroup>
        );
      }
    }];

    return (
      <Row>
        <Col xs={12}><br /><p>Items dropped from regular mobs in the overworld.</p></Col>
        <Col xs={12}>
          <SmahtTable columns={columns} rows={mobDrops} noResultsMessage="Nothing Here" customButton={<Button block bsStyle="primary" onClick={bindFunc(this,'showModal', 'addModal', true)}>Add New</Button>} />
        </Col>
        {(addModal || editModal) && <AddEditMobDropModal selectedMob={selectedMobDrop} add={addModal} onHide={bindFunc(this, 'showModal', (addModal ? 'addModal' : 'editModal'), false)} />}
        <ConfirmModal show={removeModal} onCancel={bindFunc(this, 'showModal', 'removeModal', false)} onConfirm={this.removeMobDrop} />
      </Row>
    );
  }
}

export default MobDropsTabContainer = createContainer(() => {
  const subHandle = Meteor.subscribe('mobDrops');

  return {
    loading: !subHandle.ready(),
    mobDrops: MobDrops.find().fetch()
  }
}, MobDropsTab);
