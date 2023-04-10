import { getTimeString } from '../app/shared/GlobalFunctions';

describe('getTimeString function without formatting', () => {
  test('get time string for time 75456 with 2 decimals (12:34.56)', () => {
    expect(getTimeString(75456, 2)).toBe('123456');
  });

  test('get time string for time 13756 with 3 decimals (13.756)', () => {
    expect(getTimeString(13756, 3)).toBe('13756');
  });

  test('get time string for time 3600 with no decimals (1:00:00)', () => {
    expect(getTimeString(3600, 0)).toBe('10000');
  });

  test('get time string for time 445500678910 with 6 decimals (123:45:00.678910)', () => {
    expect(getTimeString(445500678910, 6)).toBe('1234500678910');
  });

  test('get time string for time 0', () => {
    expect(getTimeString(0, 0)).toBe('');
  });

  test('get time string for time 759673 with 1 decimal (21:06:07.3)', () => {
    expect(getTimeString(759673, 1)).toBe('2106073');
  });

  test('get time string for time 1 with 2 decimals (0.01)', () => {
    expect(getTimeString(1, 2)).toBe('1');
  });
});

describe('getTimeString function with formatting', () => {
  test('get formatted time string for time 1 with 2 decimals', () => {
    expect(getTimeString(1, 2, true)).toBe('0.01');
  });

  test('get formatted time string for time 12 with 2 decimals', () => {
    expect(getTimeString(12, 2, true)).toBe('0.12');
  });

  test('get formatted time string for time 1234 with 3 decimals', () => {
    expect(getTimeString(1234, 3, true)).toBe('1.234');
  });

  test('get formatted time string for time 12345 with 3 decimals', () => {
    expect(getTimeString(12345, 3, true)).toBe('12.345');
  });

  test('get formatted time string for time 8345 with 2 decimals', () => {
    expect(getTimeString(8345, 2, true)).toBe('1:23.45');
  });

  test('get formatted time string for time 6345 with 2 decimals', () => {
    expect(getTimeString(6345, 2, true)).toBe('1:03.45');
  });

  test('get formatted time string for time 4529678 with 2 decimals', () => {
    expect(getTimeString(4529678, 2, true)).toBe('12:34:56.78');
  });

  test('get formatted time string for time 4325678 with 2 decimals', () => {
    expect(getTimeString(4325678, 2, true)).toBe('12:00:56.78');
  });
});
