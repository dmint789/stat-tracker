import { IDate } from './DataStructure';

// This outputs a text version of a given date. pretty = false means don't use the pretty
// formatting and include the time too. Used for backup file names.
export const formatDate = (date: Date, pretty = true): string => {
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

  if (pretty) {
    output += date.getDate() + ' ';
    output += months[date.getMonth()] + ' ';
    output += date.getFullYear();
  } else {
    output += date.getFullYear() + '_';
    // The Date class saves months with 0 indexing
    output += (date.getMonth() >= 9 ? '' : '0') + (date.getMonth() + 1) + '_';
    output += (date.getDate() >= 10 ? '' : '0') + date.getDate() + '_';
    output += date.toTimeString().slice(0, 8).replace(/:/g, '_');
  }

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
