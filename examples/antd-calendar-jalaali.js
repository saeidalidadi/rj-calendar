/* eslint react/no-multi-comp:0, no-console:0 */

import 'rj-calendar/assets/index.less';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Calendar from 'rj-calendar';
import DatePicker from 'rj-calendar/src/Picker';
import faIR from 'rj-calendar/src/locale/fa_IR';
import 'rc-time-picker/assets/index.css';
import TimePickerPanel from 'rc-time-picker/lib/Panel';
import momentJalaali from 'moment-jalaali';

document
  .getElementsByTagName('html')[0]
  .setAttribute('dir', 'rtl');

document
  .getElementsByClassName('highlight')[0]
  .setAttribute('dir', 'ltr');

momentJalaali.loadPersian({ usePersianDigits: true, dialect: 'persian-modern' });


const format = 'jYYYY/jMM/jDD HH:mm:ss';

const now = momentJalaali();

function getFormat(time) {
  return time ? format : 'jYYYY/jMM/jDD';
}


const defaultCalendarValue = now.clone();
defaultCalendarValue.add(-1, 'jMonth');


const timePickerElement = <TimePickerPanel defaultValue={momentJalaali('00:00:00', 'HH:mm:ss')} />;

function disabledTime(date) {
  console.log('disabledTime', date);
  if (date && (date.date() === 15)) {
    return {
      disabledHours() {
        return [3, 4];
      },
    };
  }
  return {
    disabledHours() {
      return [1, 2];
    },
  };
}


function disabledDate(current) {
  if (!current) {
    // allow empty select
    return false;
  }
  const date = momentJalaali();
  date.hour(0);
  date.minute(0);
  date.second(0);
  return current.valueOf() < date.valueOf();  // can not select days before today
}

class Demo extends React.Component {
  static propTypes = {
    defaultValue: PropTypes.object,
    defaultCalendarValue: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      showTime: true,
      showDateInput: true,
      disabled: false,
      value: props.defaultValue,
    };
  }

  onChange = (value) => {
    console.log('DatePicker change: ', (value && value.format(format)));
    this.setState({
      value,
    });
  }

  onShowTimeChange = (e) => {
    this.setState({
      showTime: e.target.checked,
    });
  }

  onShowDateInputChange = (e) => {
    this.setState({
      showDateInput: e.target.checked,
    });
  }

  toggleDisabled = () => {
    this.setState({
      disabled: !this.state.disabled,
    });
  }

  render() {
    const state = this.state;
    const calendar = (
      <Calendar
        jalaali
        rtl
        locale={faIR}
        style={{ zIndex: 1000 }}
        dateInputPlaceholder="please input"
        formatter={getFormat(state.showTime)}
        disabledTime={state.showTime ? disabledTime : null}
        timePicker={state.showTime ? timePickerElement : null}
        defaultValue={this.props.defaultCalendarValue}
        showDateInput={state.showDateInput}
        disabledDate={disabledDate}
      />
    );
    return (
      <div style={{ width: 400, margin: 20 }}>
        <div style={{ marginBottom: 10 }}>
          <label>
            <input
              type="checkbox"
              checked={state.showTime}
              onChange={this.onShowTimeChange}
            />
            showTime
          </label>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <label>
            <input
              type="checkbox"
              checked={state.showDateInput}
              onChange={this.onShowDateInputChange}
            />
            showDateInput
          </label>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <label>
            <input
              checked={state.disabled}
              onChange={this.toggleDisabled}
              type="checkbox"
            />
            disabled
          </label>
        </div>
        <div
          style={{
            boxSizing: 'border-box',
            position: 'relative',
            display: 'block',
            lineHeight: 1.5,
            marginBottom: 22,
          }}
          dir="rtl"
        >
          <DatePicker
            animation="slide-up"
            disabled={state.disabled}
            calendar={calendar}
            value={state.value}
            onChange={this.onChange}
          >
            {
              ({ value }) => {
                return (
                  <span tabIndex="0">
                  <input
                    placeholder="please select"
                    style={{ width: 250 }}
                    disabled={state.disabled}
                    readOnly
                    tabIndex="-1"
                    className="ant-calendar-picker-input ant-input"
                    value={value && value.format(getFormat(state.showTime)) || ''}
                  />
                  </span>
                );
              }
            }
          </DatePicker>
        </div>
      </div>
    );
  }
}

function onStandaloneSelect(value) {
  console.log('onStandaloneSelect');
  console.log(value && value.format(format));
}

function onStandaloneChange(value) {
  console.log('onStandaloneChange');
  console.log(value && value.format(format));
}


ReactDOM.render((
  <div
    dir="rtl"
    style={{
      zIndex: 1000,
      position: 'relative',
      width: 900,
      margin: '20px auto',
    }}
  >
    <div>
      <div style={{ margin: 10 }}>
        <Calendar
          jalaali
          rtl
          showWeekNumber={false}
          locale={faIR}
          defaultValue={now}
          disabledTime={disabledTime}
          showToday
          formatter={getFormat(true)}
          showOk={false}
          timePicker={timePickerElement}
          onChange={onStandaloneChange}
          disabledDate={disabledDate}
          onSelect={onStandaloneSelect}
        />
      </div>
      <div style={{ float: 'left', width: 300 }}>
        <Demo defaultValue={now}/>
      </div>
      <div style={{ float: 'right', width: 300 }}>
        <Demo defaultCalendarValue={defaultCalendarValue} />
      </div>
      <div style={{ clear: 'both' }}></div>
    </div>
  </div>),
document.getElementById('__react-content'));
