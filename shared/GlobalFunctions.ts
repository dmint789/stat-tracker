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

export const getStatValues = (stat: IStat, statTypes: IStatType[]): string => {
  return stat.values
    .map((val) => val + getStatUnit(stat.type, statTypes, true) + ', ')
    .join('')
    .slice(0, -2);
};

export const getStatUnit = (statTypeId: number, statTypes: IStatType[], noBraces = false): string => {
  const statType = statTypes.find((el) => el.id === statTypeId);

  if (statType?.unit) {
    if (noBraces) return ` ${statType.unit}`;
    else return ` (${statType.unit})`;
  } else return '';
};

export const getShowStats = (stat: IStat, statTypes: IStatType[]): boolean => {
  const statType = statTypes.find((el) => el.id === stat.type);
  return statType && stat.values.length > 1 && (statType?.showBest || statType?.showAvg || statType?.showSum);
};

export const getMultiValueStats = (stat: IStat, statTypes: IStatType[]): string => {
  const statType = statTypes.find((el) => el.id === stat.type);
  const values = stat.values as number[];
  const tempSum = values.reduce((acc, val) => acc + val, 0);

  const best = !statType.showBest
    ? ''
    : 'Best: ' +
      (statType.variant === StatTypeVariant.HIGHER_IS_BETTER ? Math.max(...values) : Math.min(...values));
  const avg = !statType.showAvg
    ? ''
    : (best !== '' ? ', Avg: ' : 'Avg: ') +
      Math.round((tempSum / values.length + Number.EPSILON) * 100) / 100;
  const sum = !statType.showSum ? '' : (best !== '' || avg !== '' ? ', Sum: ' : 'Sum: ') + tempSum;

  return best + avg + sum;
};

export const getIsNumericVariant = (variant: StatTypeVariant): boolean => {
  return [StatTypeVariant.HIGHER_IS_BETTER, StatTypeVariant.LOWER_IS_BETTER].includes(variant);
};
