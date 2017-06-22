import React, { PureComponent } from 'react';
import { Row, Col, Panel } from 'react-bootstrap';
import moment from 'moment';
import EorzeaTime from 'eorzea-time';

export default class EorzeaClock extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      eorzeaTime: '',
    };
  }

  setTime() {
    const eorzeaTime = new EorzeaTime();
    const eorzeaTimeMoment = moment(eorzeaTime.toString(), 'HH:mm:SS');

    let lastWindow = Number(eorzeaTimeMoment.format('h'));
    if (lastWindow % 2 !== 0) lastWindow -= 1;
    if (!lastWindow) lastWindow = 12;
    this.props.setLastNodeWindow(lastWindow);
    this.props.setLastHour(Number(eorzeaTimeMoment.format('h')));

    this.setState({ eorzeaTime: eorzeaTimeMoment.format('hh:mma') });
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

EorzeaClock.defaultProps = {
  setLastHour: () => {},
  setLastNodeWindow: () => {},
};
