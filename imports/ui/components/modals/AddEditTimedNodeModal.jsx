import React, { PureComponent } from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import bindFunc from 'memobind';

export default class AddEditTimedNodeModal extends PureComponent {
  static formatTime(time) {
    let hours = time.split(':')[0];
    if (hours === '00') hours = 12;
    else if (hours > 12) {
      hours -= 12;
      if (hours.toString().length < 2) hours = '0' + hours;
    }
    return hours + ':00';
  }

  constructor(props) {
    super(props);

    this.add = this.add.bind(this);
    this.edit = this.edit.bind(this);

    const { itemName = '', job = '', level = 60, type = '', time = '00:00', map = '', xCoord = 0, yCoord = 0, slot = 0, note = '' } = this.props.selectedNode;

    this.state = {
      submitting: false,
      form: {
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
      }
    };
  }

  setFormInput(fieldName, e) {
    let { form } = this.state;
    form = { ...form, [fieldName]: e.target.value };
    this.setState({ form });
  }

  add(e) {
    e.preventDefault();

    const { form } = this.state;
    form.time = AddEditTimedNodeModal.formatTime(form.time);

    this.setState({ submitting: true });
    Meteor.call('addNewTimedNode', { ...form }, err => {
      if (err) console.log(err);
      else this.props.onHide();
    });
  }

  edit(e) {
    e.preventDefault();

    const { form } = this.state;
    form.time = AddEditTimedNodeModal.formatTime(form.time);

    this.setState({ submitting: true });
    const { _id: nodeId } = this.props.selectedNode;

    Meteor.call('editTimedNode', { nodeId, ...form }, err => {
      if (err) console.log(err);
      else this.props.onHide();
    });
  }

  isSubmitDisabled() {
    if (this.state.submitting) return true;

    const { form: { itemName, job, level, type, time, map, xCoord, yCoord, slot } } = this.state;
    return !(itemName && job && level && type && time && map && slot);
  }

  render() {
    const { add } = this.props;
    const { form: { itemName, job, level, type, time, map, xCoord, yCoord, slot, note } } = this.state;

    return (
      <Modal show onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{add ? 'Add New' : 'Edit'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={add ? this.add : this.edit}>
          <Modal.Body>
            <Row>
              <Col sm={12}>
                <FormGroup controlId="item-name">
                  <ControlLabel><span className="text-danger">* </span>Item Name</ControlLabel>
                  <FormControl type="text" value={itemName} onChange={bindFunc(this, 'setFormInput', 'itemName')} />
                </FormGroup>
              </Col>
              <Col sm={6}>
                <FormGroup controlId="job">
                  <ControlLabel><span className="text-danger">*< /span>Job</ControlLabel>
                  <FormControl componentClass="select" value={job} onChange={bindFunc(this, 'setFormInput', 'job')}>
                    <option value="">Select a Job</option>
                    <option value="BTN">Botanist</option>
                    <option value="MIN">Miner</option>
                  </FormControl>
                </FormGroup>
              </Col>
              <Col sm={6}>
                <FormGroup controlId="level">
                  <ControlLabel><span className="text-danger">* </span>Level</ControlLabel>
                  <FormControl type="number" value={level} onChange={bindFunc(this, 'setFormInput', 'level')} />
                </FormGroup>
              </Col>
              <Col sm={6}>
                <FormGroup controlId="type">
                  <ControlLabel><span className="text-danger">* </span>Type</ControlLabel>
                  <FormControl componentClass="select" value={type} onChange={bindFunc(this, 'setFormInput', 'type')}>
                    <option value="">Select a Node Type</option>
                    <option value="Unspoiled">Unspoiled</option>
                    <option value="Ephemeral">Ephemeral</option>
                    <option value="Folklore">Folklore</option>
                  </FormControl>
                </FormGroup>
              </Col>
              <Col sm={6}>
                <FormGroup controlId="time">
                  <ControlLabel><span className="text-danger">* </span>Time</ControlLabel>
                  <FormControl type="time" step="3600" value={time} onChange={bindFunc(this, 'setFormInput', 'time')} />
                </FormGroup>
              </Col>
              <Col sm={12}>
                <FormGroup>
                  <ControlLabel controlId="map"><span className="text-danger">* </span>Map</ControlLabel>
                  <FormControl type="text" value={map} onChange={bindFunc(this, 'setFormInput', 'map')} />
                </FormGroup>
              </Col>
              <Col sm={4}>
                <FormGroup>
                  <ControlLabel controlId="x-coord">X Coordinate</ControlLabel>
                  <FormControl type="number" value={xCoord} onChange={bindFunc(this, 'setFormInput', 'xCoord')} />
                </FormGroup>
              </Col>
              <Col sm={4}>
                <FormGroup>
                  <ControlLabel controlId="y-coord">Y Coordinate</ControlLabel>
                  <FormControl type="number" value={yCoord} onChange={bindFunc(this, 'setFormInput', 'yCoord')} />
                </FormGroup>
              </Col>
              <Col sm={4}>
                <FormGroup>
                  <ControlLabel controlId="slot"><span className="text-danger">* </span>Slot</ControlLabel>
                  <FormControl type="number" value={slot} max="8" onChange={bindFunc(this, 'setFormInput', 'slot')} />
                </FormGroup>
              </Col>
              <Col xs={12}>
                <FormGroup>
                  <ControlLabel controlId="note">Note</ControlLabel>
                  <FormControl componentClass="textarea" value={note} onChange={bindFunc(this, 'setFormInput', 'note')} />
                </FormGroup>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" bsStyle="primary" disabled={this.isSubmitDisabled()}>Save</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}
