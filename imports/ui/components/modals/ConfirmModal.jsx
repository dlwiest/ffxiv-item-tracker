import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';

export default ConfirmModal = ({ show, onCancel, onConfirm }) => (
  <Modal show={show} onHide={onCancel}>
    <Modal.Header closeButton>
      <Modal.Title>Confirm?</Modal.Title>
    </Modal.Header>
    <Modal.Footer>
      <Button onClick={onCancel}>Cancel</Button>
      <Button bsStyle="primary" onClick={onConfirm}>Yes</Button>
    </Modal.Footer>
  </Modal>
);
