import React, { PureComponent } from 'react';
import { Row, Col, Panel } from 'react-bootstrap';
import moment from 'moment';
import EorzeaTime from 'eorzea-time';

class EorzeaClock extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      eorzeaTime: 'hurble',
    };
  }

  setTime() {
    const eorzeaTime = new EorzeaTime();
    this.setState({ eorzeaTime: moment(eorzeaTime.toString(), 'HH:mm:SS').format('hh:mma') });
  }

  componentWillMount() {
    this.setTime();
  }

  componentDidMount() {
    window.setInterval(() => this.setTime(), 1000);
  }

  render() {
    const { eorzeaTime } = this.state;
    return (
      <div id="eorzea-clock">
        <Panel>
          <span className="lead">Eorzea Time: {eorzeaTime}</span>
        </Panel>
      </div>
    );
  }
}

export default EorzeaClock;
