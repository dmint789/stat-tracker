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
  if (!date1) {
    return !date2;
  } else if (!date2) return true;

  if (date1.year > date2.year) return true;
  else if (date1.year === date2.year) {
    if (date1.month > date2.month) return true;
    else if (date1.month === date2.month) {
      return date1.day >= date2.day;
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
