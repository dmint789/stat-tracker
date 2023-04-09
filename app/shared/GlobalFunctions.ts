import { IStatType, IStat, IDate, StatTypeVariant } from './DataStructure';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Separator being unset means output the pretty date. In that case includeTime is ignored.
export const formatDate = (date: Date, separator = '', includeTime = false): string => {
  let output = '';

  if (!separator) {
    output += date.getDate() + ' ';
    output += months[date.getMonth()] + ' ';
    output += date.getFullYear();
  } else {
    output += date.getFullYear() + separator;
    // The Date class saves months with 0 indexing
    output += (date.getMonth() >= 9 ? '' : '0') + (date.getMonth() + 1) + separator;
    output += (date.getDate() >= 10 ? '' : '0') + date.getDate() + separator;
    if (includeTime) output += date.toTimeString().slice(0, 8).replace(/:/g, separator);
  }

  return output;
};

export const formatIDate = (date: IDate, separator = ''): string => {
  if (!date) return '(no date)';

  let output = '';

  if (!separator) {
    output += date.day + ' ';
    output += months[date.month - 1] + ' ';
    output += date.year;
  } else {
    output += (date.day < 10 && '0') + date.day + separator;
    output += (date.month < 10 && '0') + date.month + separator;
    output += date.year;
  }

  return output;
};

// Returns true if date1 is more recent or the same as date2
export const isNewerOrSameDate = (date1: IDate, date2: IDate): boolean => {
  if (!date1) return !date2;
  else if (!date2) return true;

  if (date1.year > date2.year) return true;
  else if (date1.year === date2.year) {
    if (date1.month > date2.month) return true;
    else if (date1.month === date2.month) {
      return date1.day >= date2.day;
    } else return false;
  } else return false;
};

// Returns true if date1 is older or the same as date2
export const isOlderOrSameDate = (date1: IDate, date2: IDate): boolean => {
  if (!date1) return true;
  else if (!date2) return false;

  if (date1.year < date2.year) return true;
  else if (date1.year === date2.year) {
    if (date1.month < date2.month) return true;
    else if (date1.month === date2.month) {
      return date1.day <= date2.day;
    } else return false;
  } else return false;
};

export const sortStats = (stats: IStat[], statTypes: IStatType[]): IStat[] => {
  return [...stats].sort((a, b) => {
    const statTypeA = statTypes.find((el) => el.id === a.type);
    const statTypeB = statTypes.find((el) => el.id === b.type);

    if (!statTypeA) return statTypeB ? 1 : -1;
    if (!statTypeB) return -1;

    return statTypeA.order - statTypeB.order;
  });
};

export const getTimeString = (time: number, decimals: number, formatted = false): string => {
  if (typeof decimals !== 'number') throw new Error('Decimals not provided to getTimeString()');

  let output = '';

  if (time > 0) {
    const multiplier = Math.pow(10, decimals);

    const hours = Math.floor(time / (3600 * multiplier));
    const minutes = Math.floor((time / (60 * multiplier)) % 60);
    const seconds = time % (60 * multiplier);

    if (hours > 0) {
      output += hours;
      if (formatted) output += ':';

      if (minutes === 0) {
        output += '00';
        if (formatted) output += ':';
      } else if (minutes < 10) {
        output += '0';
      }
    }

    if (minutes > 0) {
      output += minutes;
      if (formatted) output += ':';
    }

    if (hours > 0 || minutes > 0) {
      output += '0'.repeat(decimals + 2 - String(seconds).length);
    } else if (formatted && String(seconds).length < decimals + 1) {
      output += '0'.repeat(decimals + 1 - String(seconds).length);
    }
    output += seconds;

    // Insert the decimal point
    if (formatted) {
      output = output.slice(0, output.length - decimals) + '.' + output.slice(output.length - decimals);
    }
  } else if (formatted) {
    output = '0.' + '0'.repeat(decimals);
  }

  return output;
};

// Used for multi value stat types with NUMBER or TIME variant and with exclude best and worst set.
// Returns true when excluding best and worst and the value is a best or worst result.
export const getShowParentheses = (
  value: number | string,
  stat: IStat,
  statType: IStatType,
  valueFound: { high: boolean; low: boolean },
): boolean => {
  if (typeof value !== 'number') return false;

  let showParentheses: boolean = statType?.exclBestWorst && stat.values.length > 3;

  if (showParentheses) {
    if (value === stat.multiValueStats.high && !valueFound.high) {
      valueFound.high = true;
    } else if (value === stat.multiValueStats.low && !valueFound.low) {
      valueFound.low = true;
    } else {
      showParentheses = false;
    }
  }

  return showParentheses;
};

export const getIsNumericVariant = (variant: StatTypeVariant): boolean => {
  return [StatTypeVariant.NUMBER, StatTypeVariant.TIME].includes(variant);
};
