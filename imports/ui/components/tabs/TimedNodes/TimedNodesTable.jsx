import React, { Component } from 'react';
import { Table, Label } from 'react-bootstrap';

export default class TimedNodesTable extends Component {
  static formatRow(row) {
    return (
      <tr key={row._id}>
        <td>{row.itemName}</td>
        <td>{row.job === 'BTN' ? <Label bsStyle="success">BTN</Label> : <Label bsStyle="warning">MIN</Label>}</td>
        <td>{row.level}</td>
        <td>{row.type}</td>
        <td>{row.time}</td>
        <td>{row.map}</td>
        <td>{row.slot}</td>
      </tr>
    );
  }

  constructor(props) {
    super(props);

    this.state = {
    };
  }


  render() {
    const { rows } = this.props;
    if (!rows.length) return null;

    return (
      <Table striped hover>
        <thead>
          <tr>
            <th className="col-sm-3">Item Name</th>
            <th className="col-sm-1">Job</th>
            <th className="col-sm-1">Level</th>
            <th className="col-sm-2">Type</th>
            <th className="col-sm-1">Time</th>
            <th className="col-sm-3">Map</th>
            <th className="col-sm-1">Slot</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(( row ) => TimedNodesTable.formatRow(row))}
        </tbody>
      </Table>
    );
  }
}

TimedNodesTable.defaultProps = {
  rows: [],
};
