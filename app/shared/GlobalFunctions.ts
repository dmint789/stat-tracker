import { IStat, IStatType, StatTypeVariant } from './DataStructures';

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

export const getIsNumericVariant = (variant: StatTypeVariant): boolean => {
  return [StatTypeVariant.HIGHER_IS_BETTER, StatTypeVariant.LOWER_IS_BETTER].includes(variant);
};
