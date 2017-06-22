import React, { Component } from 'react';
import { Table, Label } from 'react-bootstrap';

export default class TimedNodesTable extends Component {
  static addHours(startHour, add) {
    let newHour = startHour + add;
    if (newHour >= 12) newHour -= 12;
    return newHour;
  }

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  formatRow(row) {
    let { lastHour } = this.props;
    if (lastHour === 12) lastHour = 0;

    let nodeHour = Number(row.time.split(':')[0]);
    if (nodeHour === 12) nodeHour = 0;

    let timeClass = 'default';
    if (row.type === 'Ephemeral') {
      if (lastHour === nodeHour || lastHour === TimedNodesTable.addHours(nodeHour, 1)) timeClass = 'text-success text-bold';
      else if (lastHour === TimedNodesTable.addHours(nodeHour, 2)) timeClass = 'text-warning text-bold';
      else if (lastHour === TimedNodesTable.addHours(nodeHour, 3)) timeClass = 'text-danger text-bold';
    } else {
      if (lastHour === nodeHour) timeClass = 'text-warning text-bold';
      else if (lastHour === TimedNodesTable.addHours(nodeHour, 1)) timeClass = 'text-danger text-bold';
    }

    return (
      <tr key={row._id}>
        <td>{row.itemName}</td>
        <td>{row.job === 'BTN' ? <Label bsStyle="success">BTN</Label> : <Label bsStyle="warning">MIN</Label>}</td>
        <td>{row.level ? row.level : '–'}</td>
        <td><span className={timeClass}>{row.time}</span></td>
        <td>{row.type}</td>
        <td>{row.map}</td>
        <td>{row.zone ? row.zone : '–'}</td>
        <td>{row.slot ? row.slot : '–'}</td>
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
            <th className="col-sm-2">Item Name</th>
            <th className="col-sm-1">Job</th>
            <th className="col-sm-1">Level</th>
            <th className="col-sm-1">Time</th>
            <th className="col-sm-2">Type</th>
            <th className="col-sm-2">Region</th>
            <th className="col-sm-2">Zone</th>
            <th className="col-sm-1">Slot</th>
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
