import moment from 'moment';
import momentJalaali from 'moment-jalaali';

const defaultDisabledTime = {
  disabledHours() {
    return [];
  },
  disabledMinutes() {
    return [];
  },
  disabledSeconds() {
    return [];
  },
};

export function getTodayTime(value, jalaali) {
  const today = jalaali ? momentJalaali() : moment();
  today.locale(value.locale()).utcOffset(value.utcOffset());
  return today;
}

export function getTitleString(value) {
  return value.format('LL');
}

export function getTodayTimeStr(value, jalaali) {
  const today = getTodayTime(value, jalaali);
  return getTitleString(today);
}

export function setYearAndMonth(value, year, jalaali) {
  const newValue = value.clone();
  if (jalaali) {
    newValue.jYear(year);
    newValue.jMonth(value.jMonth());
  } else {
    newValue.year(year);
    newValue.month(value.month());
  }

  return newValue;
}

export function getCurrentYear(value, jalaali) {
  return jalaali ? value.jYear() : value.year();
}

export function getMonthName(month, jalaali) {
  const locale = month.locale();
  const localeData = month.localeData();
  if (jalaali) {
    return localeData.jMonths(month);
  }
  return localeData[locale === 'zh-cn' ? 'months' : 'monthsShort'](month);
}

export function syncTime(from, to) {
  if (!moment.isMoment(from) || !moment.isMoment(to)) return;
  to.hour(from.hour());
  to.minute(from.minute());
  to.second(from.second());
}

export function getTimeConfig(value, disabledTime) {
  let disabledTimeConfig = disabledTime ? disabledTime(value) : {};
  disabledTimeConfig = {
    ...defaultDisabledTime,
    ...disabledTimeConfig,
  };
  return disabledTimeConfig;
}

export function isTimeValidByConfig(value, disabledTimeConfig) {
  let invalidTime = false;
  if (value) {
    const hour = value.hour();
    const minutes = value.minute();
    const seconds = value.second();
    const disabledHours = disabledTimeConfig.disabledHours();
    if (disabledHours.indexOf(hour) === -1) {
      const disabledMinutes = disabledTimeConfig.disabledMinutes(hour);
      if (disabledMinutes.indexOf(minutes) === -1) {
        const disabledSeconds = disabledTimeConfig.disabledSeconds(hour, minutes);
        invalidTime = disabledSeconds.indexOf(seconds) !== -1;
      } else {
        invalidTime = true;
      }
    } else {
      invalidTime = true;
    }
  }
  return !invalidTime;
}

export function isTimeValid(value, disabledTime) {
  const disabledTimeConfig = getTimeConfig(value, disabledTime);
  return isTimeValidByConfig(value, disabledTimeConfig);
}

export function isAllowedDate(value, disabledDate, disabledTime) {
  if (disabledDate) {
    if (disabledDate(value)) {
      return false;
    }
  }
  if (disabledTime) {
    if (!isTimeValid(value, disabledTime)) {
      return false;
    }
  }
  return true;
}
