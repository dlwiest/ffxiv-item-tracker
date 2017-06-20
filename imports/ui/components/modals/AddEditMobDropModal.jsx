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

export default class AddEditMobModal extends PureComponent {
  constructor(props) {
    super(props);

    this.add = this.add.bind(this);
    this.edit = this.edit.bind(this);

    const { itemName = '', mobName = '', map = '', xCoord = 0, yCoord = 0, note = '' } = props.selectedMob;

    this.state = {
      submitting: false,
      form: {
        itemName,
        mobName,
        map,
        xCoord,
        yCoord,
        note
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

    this.setState({ submitting: true });
    Meteor.call('addNewMobDrop', { ...this.state.form }, err => {
      if (err) console.log(err);
      else this.props.onHide();
    });
  }

  edit(e) {
    e.preventDefault();

    this.setState({ submitting: true });
    const { _id: mobDropId } = this.props.selectedMob;

    Meteor.call('editMobDrop', { mobDropId, ...this.state.form }, err => {
      if (err) console.log(err);
      else this.props.onHide();
    });
  }

  isSubmitDisabled() {
    if (this.state.submitting) return true;

    const { form: { itemName, mobName, map, xCoord, yCoord } } = this.state;
    return !(itemName && mobName && map && xCoord && yCoord);
  }

  render() {
    const { add } = this.props;
    let { form: { itemName, mobName, map, xCoord, yCoord, note } } = this.state;

    return (
      <Modal show onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{add ? 'Add New' : 'Edit'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={add ? this.add : this.edit}>
          <Modal.Body>
            <Row>
              <Col sm={12}>
                <FormGroup>
                  <ControlLabel>Item Name</ControlLabel>
                  <FormControl type="text" value={itemName} onChange={bindFunc(this, 'setFormInput', 'itemName')} />
                </FormGroup>
              </Col>
              <Col sm={6}>
                <FormGroup>
                  <ControlLabel>Mob Name</ControlLabel>
                  <FormControl type="text" value={mobName} onChange={bindFunc(this, 'setFormInput', 'mobName')} />
                </FormGroup>
              </Col>
              <Col sm={6}>
                <FormGroup>
                  <ControlLabel>Map</ControlLabel>
                  <FormControl type="text" value={map} onChange={bindFunc(this, 'setFormInput', 'map')} />
                </FormGroup>
              </Col>
              <Col sm={6}>
                <FormGroup>
                  <ControlLabel>X Coordinate</ControlLabel>
                  <FormControl type="number" value={xCoord} onChange={bindFunc(this, 'setFormInput', 'xCoord')} />
                </FormGroup>
              </Col>
              <Col sm={6}>
                <FormGroup>
                  <ControlLabel>Y Coordinate</ControlLabel>
                  <FormControl type="number" value={yCoord} onChange={bindFunc(this, 'setFormInput', 'yCoord')} />
                </FormGroup>
              </Col>
              <Col xs={12}>
                <FormGroup>
                  <ControlLabel>Note</ControlLabel>
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
