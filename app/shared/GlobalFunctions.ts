import { IDate } from './DataStructure';

// Separator being unset means output the pretty date. In that case includeTime is ignored.
export const formatDate = (date: Date, separator = '', includeTime = false): string => {
  let output = '';
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

export const formatIDate = (date: IDate, separator = '.'): string => {
  let output = '';

  output += (date.day >= 10 ? '' : '0') + date.day + separator;
  output += (date.month >= 10 ? '' : '0') + date.month + separator;
  output += date.year;

  return output;
};

// Returns true if date1 is more recent or the same as date2
export const isNewerOrSameDate = (date1: IDate, date2: IDate): boolean => {
  if (date1.year > date2.year) return true;
  else if (date1.year === date2.year) {
    if (date1.month > date2.month) return true;
    else if (date1.month === date2.month) {
      return date1.day >= date2.day;
    } else return false;
  } else return false;
};
