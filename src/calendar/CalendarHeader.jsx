import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import toFragment from 'rc-util/lib/Children/mapSelf';
import MonthPanel from '../month/MonthPanel';
import YearPanel from '../year/YearPanel';
import DecadePanel from '../decade/DecadePanel';

function goMonth(direction) {
  const next = this.props.value.clone();
  if (this.props.jalaali) {
    next.add(direction, 'jMonth');
  } else {
    next.add(direction, 'months');
  }
  this.props.onValueChange(next);
}

function goYear(direction) {
  const next = this.props.value.clone();
  next.add(direction, 'years');
  this.props.onValueChange(next);
}

function showIf(condition, el) {
  return condition ? el : null;
}

const CalendarHeader = createReactClass({
  propTypes: {
    jalaali: PropTypes.bool,
    rtl: PropTypes.bool,
    prefixCls: PropTypes.string,
    value: PropTypes.object,
    onValueChange: PropTypes.func,
    showTimePicker: PropTypes.bool,
    onPanelChange: PropTypes.func,
    locale: PropTypes.object,
    enablePrev: PropTypes.any,
    enableNext: PropTypes.any,
    disabledMonth: PropTypes.func,
  },

  getDefaultProps() {
    return {
      enableNext: 1,
      enablePrev: 1,
      onPanelChange() {},
      onValueChange() {},
    };
  },

  getInitialState() {
    this.nextMonth = goMonth.bind(this, 1);
    this.previousMonth = goMonth.bind(this, -1);
    this.nextYear = goYear.bind(this, 1);
    this.previousYear = goYear.bind(this, -1);
    return { yearPanelReferer: null };
  },

  onMonthSelect(value) {
    this.props.onPanelChange(value, 'date');
    if (this.props.onMonthSelect) {
      this.props.onMonthSelect(value);
    } else {
      this.props.onValueChange(value);
    }
  },

  onYearSelect(value) {
    const referer = this.state.yearPanelReferer;
    this.setState({ yearPanelReferer: null });
    this.props.onPanelChange(value, referer);
    this.props.onValueChange(value);
  },

  onDecadeSelect(value) {
    this.props.onPanelChange(value, 'year');
    this.props.onValueChange(value);
  },

  monthYearElement(showTimePicker) {
    const props = this.props;
    const prefixCls = props.prefixCls;
    const locale = props.locale;
    const value = props.value;
    const localeData = value.localeData();
    let monthName = props.jalaali ? localeData.jMonths(value) : localeData.monthsShort(value);
    if (props.jalaali) {
      monthName = locale.jMonthFormat
                  ? value.format(locale.jMonthFormat)
                  : localeData.jMonths(value);
    } else {
      monthName = locale.monthFormat
                  ? value.format(locale.monthFormat)
                  : localeData.monthsShort(value);
    }
    const monthBeforeYear = locale.monthBeforeYear;
    const selectClassName = `${prefixCls}-${monthBeforeYear ? 'my-select' : 'ym-select'}`;
    const year = (<a
      className={`${prefixCls}-year-select`}
      role="button"
      onClick={showTimePicker ? null : () => this.showYearPanel('date')}
      title={locale.yearSelect}
    >
      {value.format(props.jalaali ? locale.jYearFormat : locale.yearFormat)}
    </a>);
    const month = (<a
      className={`${prefixCls}-month-select`}
      role="button"
      onClick={showTimePicker ? null : this.showMonthPanel}
      title={locale.monthSelect}
    >
      {monthName}
    </a>);
    let day;
    if (showTimePicker) {
      day = (<a
        className={`${prefixCls}-day-select`}
        role="button"
      >
        {value.format(props.jalaali ? locale.jDayFormat : locale.dayFormat)}
      </a>);
    }
    let my = [];
    if (monthBeforeYear) {
      my = [month, day, year];
    } else {
      my = [year, month, day];
    }
    return (<span className={selectClassName}>
    {toFragment(my)}
    </span>);
  },

  showMonthPanel() {
    // null means that users' interaction doesn't change value
    this.props.onPanelChange(null, 'month');
  },

  showYearPanel(referer) {
    this.setState({ yearPanelReferer: referer });
    this.props.onPanelChange(null, 'year');
  },

  showDecadePanel() {
    this.props.onPanelChange(null, 'decade');
  },

  rtlClass(className) {
    const baseName = `${this.props.prefixCls}-${className}`;
    if (this.props.rtl) {
      return `${baseName}-rtl`;
    }
    return baseName;
  },
  render() {
    const { props } = this;
    const {
      prefixCls,
      locale,
      mode,
      value,
      showTimePicker,
      enableNext,
      enablePrev,
      disabledMonth,
      jalaali,
    } = props;

    let panel = null;
    if (mode === 'month') {
      panel = (
        <MonthPanel
          jalaali={jalaali}
          locale={locale}
          defaultValue={value}
          rootPrefixCls={prefixCls}
          onSelect={this.onMonthSelect}
          onYearPanelShow={() => this.showYearPanel('month')}
          disabledDate={disabledMonth}
          cellRender={props.monthCellRender}
          contentRender={props.monthCellContentRender}
        />
      );
    }
    if (mode === 'year') {
      panel = (
        <YearPanel
          jalaali={jalaali}
          locale={locale}
          defaultValue={value}
          rootPrefixCls={prefixCls}
          onSelect={this.onYearSelect}
          onDecadePanelShow={this.showDecadePanel}
        />
      );
    }
    if (mode === 'decade') {
      panel = (
        <DecadePanel
          jalaali={jalaali}
          locale={locale}
          defaultValue={value}
          rootPrefixCls={prefixCls}
          onSelect={this.onDecadeSelect}
        />
      );
    }
    const prevYearBtn = (
      <a
        className={this.rtlClass('prev-year-btn')}
        role="button"
        onClick={this.previousYear}
        title={locale.previousYear}
      />
    );
    const prevMonthBtn = (
      <a
        className={this.rtlClass('prev-month-btn')}
        role="button"
        onClick={this.previousMonth}
        title={locale.previousMonth}
      />
    );
    const nextYearBtn = (
      <a
        className={this.rtlClass('next-month-btn')}
        onClick={this.nextMonth}
        title={locale.nextMonth}
      />
    );
    const nextMonthBtn = (
      <a
        className={this.rtlClass('next-year-btn')}
        onClick={this.nextYear}
        title={locale.nextYear}
      />
    );
    return (<div className={`${prefixCls}-header`}>
      <div style={{ position: 'relative' }}>
        {showIf(enablePrev && !showTimePicker, prevYearBtn)}
        {showIf(enablePrev && !showTimePicker, prevMonthBtn)}
        {this.monthYearElement(showTimePicker)}
        {showIf(enableNext && !showTimePicker, nextYearBtn)}
        {showIf(enableNext && !showTimePicker, nextMonthBtn)}
      </div>
      {panel}
    </div>);
  },
});

export default CalendarHeader;
