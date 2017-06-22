import React, { Component } from 'react';
import { Table, Label } from 'react-bootstrap';

export default class TimedNodesTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  formatRow(row) {
    const { lastHour } = this.props;

    let timeClass = 'default';
    if (lastHour === Number(row.time.split(':')[0])) timeClass = 'text-success text-bold';
    else if (lastHour === Number(row.time.split(':')[0]) + 1) timeClass = 'text-danger text-bold';

    return (
      <tr key={row._id}>
        <td>{row.itemName}</td>
        <td>{row.job === 'BTN' ? <Label bsStyle="success">BTN</Label> : <Label bsStyle="warning">MIN</Label>}</td>
        <td>{row.level}</td>
        <td><span className={timeClass}>{row.time}</span></td>
        <td>{row.map}</td>
        <td>{row.slot}</td>
        <td>{row.type}</td>
      </tr>
    );
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
            <th className="col-sm-1">Time</th>
            <th className="col-sm-3">Map</th>
            <th className="col-sm-1">Slot</th>
            <th className="col-sm-2">Type</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(( row ) => this.formatRow(row))}
        </tbody>
      </Table>
    );
  }
}

TimedNodesTable.defaultProps = {
  rows: [],
  lastHour: null,
};
