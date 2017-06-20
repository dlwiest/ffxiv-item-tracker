import React, { Component } from 'react';
import diff from 'deep-diff';
import bindFunc from 'memobind';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Table from 'react-bootstrap/lib/Table';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Image from 'react-bootstrap/lib/Image';
import Pagination from 'react-bootstrap/lib/Pagination';

export default class SmahtTable extends Component {
  static getObjPropByString(o, s) {
    // convert indexes to properties and strip any leading dots
    const a = s.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '').split('.');
    for (let i = 0, n = a.length; i < n; ++i) {
      const k = a[i];
      if (k in o) {
        o = o[k];
      } else {
        return null;
      }
    }
    return o;
  }

  static formatRows(rows, columns) {
    return rows.map((row, i) => {
      const obj = _.clone(row);
      _.each(columns, ({ heading, display, sortBy, disableSort }) => {
        obj[heading] = {};
        if (typeof display === 'string') {
          obj[heading].display = SmahtTable.getObjPropByString(row, display);
        } else {
          obj[heading].display = display(row);
        }
        if (sortBy) {
          obj[heading].sortBy = (typeof sortBy === 'string') ? SmahtTable.getObjPropByString(row, sortBy) : sortBy(row);
        } else if (_.isObject(obj[heading].display)) {
          if (!disableSort) console.log('SmahtTable: if column.display is a react node, specify column.sortBy or set column.disableSort to true');
          obj[heading].sortBy = '';
        } else {
          obj[heading].sortBy = obj[heading].display;
        }
      });
      obj._key = i;
      return obj;
    });
  }

  static filterRows(rows, filter) {
    return _.filter(rows, row => {
      const arr = _.values(row);
      for (let i = 0; i < arr.length; i++) {
        let val = (arr[i] && arr[i].display) || '';
        if (_.isObject(val)) val = (arr[i] && arr[i].sortBy) || '';
        if (val.toString().toLowerCase().indexOf(filter.toLowerCase()) >= 0) return true;
      }

      return false;
    });
  }

  static sortRows(rows, columnHeading, sortAscending) {
    const sortedRows = _.sortBy(rows, row => row[columnHeading].sortBy);

    if (!sortAscending) sortedRows.reverse();

    return sortedRows;
  }

  constructor(props) {
    super(props);

    this.setPage = this.setPage.bind(this);
    this.setPageSize = this.setPageSize.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.getSettingsRow = this.getSettingsRow.bind(this);
    this.getTableBody = this.getTableBody.bind(this);
    this.getTableHeader = this.getTableHeader.bind(this);
    this.clearFilter = this.clearFilter.bind(this);

    const { initialPageSize, initialSortColumn, initialSortAscending, initialPage, setQueryParams, disableInitialSort } = props;
    const settings = {
      currentPage: initialPage,
      pageSize: initialPageSize,
      sortColumn: initialSortColumn,
      sortAscending: initialSortAscending,
      filter: ''
    };

    this.state = {
      formattedRows: SmahtTable.formatRows(props.rows, props.columns),
      columns: props.columns,
      maxPage: 0,
      ...settings
    };
  }

  componentWillMount() {
    this.debounceSetFilter = _.debounce(({ target: { value } }) => {
      const filter = value;
      const { formattedRows, columns, sortColumn, sortAscending, pageSize } = this.state;
      const sortedRows = (sortColumn >= 0) ? SmahtTable.sortRows(formattedRows, columns[sortColumn].heading, sortAscending) : formattedRow;

      if (filter === '') {
        this.setState({
          currentPage: 1,
          maxPage: Math.ceil(sortedRows.length > pageSize ? sortedRows.length / pageSize : 1),
          filteredRows: sortedRows,
          displayRows: sortedRows.slice(0, pageSize),
          filter
        });
        return;
      }

      const filteredRows = SmahtTable.filterRows(sortedRows, filter);

      this.setState({
        currentPage: 1,
        filteredRows,
        filter,
        maxPage: Math.ceil(filteredRows.length > pageSize ? filteredRows.length / pageSize : 1),
        displayRows: filteredRows.slice(0, pageSize)
      });
    }, 300);

    const { pageSize, currentPage, formattedRows, columns, sortColumn, sortAscending, filter } = this.state;
    const index = pageSize * (currentPage - 1);
    const sortedRows = (sortColumn >= 0) ? SmahtTable.sortRows(formattedRows, columns[sortColumn].heading, sortAscending) : formattedRows;
    const filteredRows = filter ? SmahtTable.filterRows(sortedRows, filter) : sortedRows;

    this.setState({
      filteredRows,
      displayRows: filteredRows.slice(index, index + pageSize),
      maxPage: Math.ceil(filteredRows.length / pageSize)
    });
  }

  componentWillReceiveProps(nextProps) {
    const { rows, columns } = this.props;

    let reformat = false;
    if (rows.length !== nextProps.rows.length) {
      reformat = true;
    } else if (columns.length !== nextProps.columns.length) {
      reformat = true;
    } else if (!this.props.setQueryParams) {
      const whatsDiff = diff({ rows, columns }, { rows: nextProps.rows, columns: nextProps.columns }, path => {
        if (path.length > 4) return true;
      });
      if (whatsDiff) reformat = true;
    }

    if (reformat) {
      const { filter, currentPage, pageSize, sortColumn, sortAscending } = this.state;

      const index = pageSize * (currentPage - 1);
      const formattedRows = SmahtTable.formatRows(nextProps.rows, nextProps.columns);
      const sortedRows = (sortColumn >= 0) ? SmahtTable.sortRows(formattedRows, nextProps.columns[sortColumn].heading, sortAscending) : formattedRows;
      const filteredRows = filter ? SmahtTable.filterRows(sortedRows, filter) : sortedRows;

      this.setState({
        formattedRows,
        filteredRows,
        displayRows: filteredRows.slice(index, index + pageSize),
        columns: nextProps.columns,
        maxPage: Math.ceil(filteredRows.length / pageSize),
        currentPage: (currentPage <= Math.round(filteredRows.length / pageSize)) ? currentPage : 1
      });
    }
  }

  onFilterChange(event) {
    this.setState({ filter: event.target.value });
    event.persist();
    this.debounceSetFilter(event);
  }

  setPage(page) {
    const { pageSize, filteredRows } = this.state;
    const index = (page - 1) * pageSize;

    this.setState({
      currentPage: page,
      displayRows: filteredRows.slice(index, index + pageSize)
    });
  }

  setPageSize(e) {
    const { filteredRows } = this.state;
    const pageSize = parseInt(e.target.value, 10);

    this.setState({
      currentPage: 1,
      pageSize,
      maxPage: Math.ceil(filteredRows.length > pageSize ? filteredRows.length / pageSize : 1),
      displayRows: filteredRows.slice(0, pageSize)
    });
  }

  clearFilter() {
    const { formattedRows, columns, sortColumn, sortAscending, pageSize } = this.state;
    const sortedRows = (sortColumn >= 0) ? SmahtTable.sortRows(formattedRows, columns[sortColumn].heading, sortAscending) : formattedRows;

    this.setState({
      currentPage: 1,
      maxPage: Math.ceil(sortedRows.length > pageSize ? sortedRows.length / pageSize : 1),
      filteredRows: sortedRows,
      displayRows: sortedRows.slice(0, pageSize),
      filter: ''
    });
  }

  changeSort(newSortColumn) {
    const { sortAscending, sortColumn, pageSize, filteredRows, columns } = this.state;
    const newSortAscending = (newSortColumn === sortColumn) ? !sortAscending : sortAscending;
    const sortedRows = (sortColumn >= 0) ? SmahtTable.sortRows(filteredRows, columns[newSortColumn].heading, newSortAscending) : filteredRows;

    this.setState({
      currentPage: 1,
      sortColumn: newSortColumn,
      sortAscending: newSortAscending,
      filteredRows: sortedRows,
      displayRows: sortedRows.slice(0, pageSize)
    });
  }

  getSettingsRow() {
    const { initialPageSize } = this.props;
    const { filter, pageSize } = this.state;

    return (
      <Row style={{ paddingTop: 5, paddingBottom: 5 }}>
        <div>
          <Col sm={4}>
            <InputGroup>
              <FormControl
                type="text"
                placeholder="Filter Results"
                onChange={this.onFilterChange}
                value={filter}
              />
              <InputGroup.Button><Button disabled={filter.length === 0} onClick={this.clearFilter}>x</Button></InputGroup.Button>
            </InputGroup>
          </Col>
          <Col smHidden mdHidden lgHidden><br /></Col>
          <Col sm={2} smOffset={3} md={1} mdOffset={5}>
            <FormControl componentClass="select" placeholder="Page Size" value={pageSize} onChange={this.setPageSize} style={{ width: 'auto', padding: '0 0 0 0.5em' }}>
              {!_.contains([15, 25, 50, 100], initialPageSize) ? <option value={initialPageSize}>{initialPageSize}</option> : null}
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </FormControl>
          </Col>
          <Col xs={9} sm={3} md={2}>
            {this.props.customButton}
          </Col>
        </div>
        <Col smHidden mdHidden lgHidden><br /><br /></Col>
      </Row>
    );
  }

  getTableHeader() {
    const { columns, sortAscending, sortColumn } = this.state;
    const visibleColumns = _.filter(columns, ({ printOnly }) => !printOnly);
    return (
      <thead>
        <tr style={{ whiteSpace: 'nowrap' }}>
          {visibleColumns.map(({ heading, tooltip, disableSort, id }, i) => {
            const colHeader = tooltip ? <OverlayTrigger placement="top" overlay={<Tooltip id={i}>{tooltip}</Tooltip>}><span>{heading}</span></OverlayTrigger> : heading;
            return (
              <th
                id={id}
                key={heading}
                onClick={disableSort ? null : this.changeSort.bind(this, i)}
                style={{ cursor: disableSort ? 'auto' : 'pointer' }}
              >
                {colHeader} {disableSort || <small>{i === sortColumn ? <Glyphicon glyph={sortAscending ? 'triangle-top' : 'triangle-bottom'} /> : <Image style={{ width: 11, opacity: 0.25 }} src="/img/sort-icon.png" />}</small>}
              </th>
            );
          })}
        </tr>
      </thead>
    );
  }

  getTableBody() {
    if (!this.state.formattedRows.length) return null;

    const { displayRows, columns } = this.state;
    const visibleColumns = _.filter(columns, ({ printOnly }) => !printOnly);

    return (
      <tbody>
        {displayRows.map(row => (
          <tr key={row._key}>
            {visibleColumns.map(({ heading, noWrap }) => <td key={`${row._key}-${heading}`} style={{ whiteSpace: noWrap && 'nowrap' }}>{row[heading].display}</td>)}
          </tr>
        ))}
      </tbody>
    );
  }

  getPagination() {
    const { maxPage, currentPage } = this.state;
    const { smallPagination } = this.props;
    if (maxPage <= 1) return null;

    return (
      <div className="text-center">
        <Pagination
          boundaryLinks
          activePage={currentPage}
          maxButtons={5}
          next={currentPage < maxPage}
          prev={currentPage > 1}
          onSelect={this.setPage}
          items={maxPage}
          bsSize={smallPagination ? 'small' : 'medium'}
          style={{ marginTop: 15, marginBottom: 10 }}
        />
      </div>
    );
  }

  render() {

    const { fill,
            bordered,
            condensed,
            hide } = this.props;

    if (hide) return null;

    return (
      <div style={{ width: '100%', ...this.props.style }}>
        {this.getSettingsRow()}

        <Table
          style={{ marginBottom: 0 }}
          responsive striped hover
          bordered={bordered}
          fill={fill}
          condensed={condensed}
        >
          {this.getTableHeader()}
          {this.getTableBody()}
        </Table>
        {this.getPagination()}
      </div>
    );
  }
}

SmahtTable.defaultProps = {
  rows: [],
  columns: [],
  initialSortColumn: 0,
  initialSortAscending: true,
  initialPage: 1,
  initialPageSize: 15,
  onRowClick: null,
  fill: false,
  bordered: false,
  condensed: false,
  smallPagination: false,
  noResultsMessage: '',
  disableInitialSort: false,
  style: {}
};
