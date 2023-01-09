import { addEditEntry, updatePBs } from '../app/shared/EntryFunctions';
import { IEntry, IStatType } from '../app/shared/DataStructure';

/**
 * Mocks
 */

let entries: IEntry[] = [
  {
    id: 3,
    stats: [],
    comment: '',
    date: {
      day: 7,
      month: 1,
      year: 2023,
    },
  },
  {
    id: 2,
    stats: [],
    comment: '',
    date: {
      day: 3,
      month: 1,
      year: 2023,
    },
  },
  {
    id: 1,
    stats: [],
    comment: '',
    date: {
      day: 1,
      month: 1,
      year: 2023,
    },
  },
];

const state = {
  entries,
  statTypes: [
    {
      id: 1,
      name: 'Weight',
      order: 1,
      variant: 1,
      unit: 'kg',
      higherIsBetter: false,
      trackPBs: true,
      trackYearPBs: false,
      trackMonthPBs: false,
      multipleValues: false,
    },
    {
      id: 2,
      name: 'Push-ups',
      order: 2,
      variant: 1,
      higherIsBetter: true,
      trackPBs: true,
      trackYearPBs: false,
      trackMonthPBs: false,
      multipleValues: true,
      showBest: true,
      showAvg: true,
      showSum: true,
    },
    {
      id: 3,
      name: 'Squats',
      order: 3,
      variant: 1,
      higherIsBetter: true,
      trackMonthPBs: true,
      trackYearPBs: true,
      multipleValues: true,
      showBest: true,
      showAvg: false,
      showSum: true,
    },
    {
      id: 4,
      name: 'Pull-ups',
      order: 4,
      variant: 1,
      higherIsBetter: true,
      trackPBs: true,
      trackMonthPBs: true,
      trackYearPBs: true,
      multipleValues: true,
      showBest: true,
      showAvg: true,
      showSum: true,
    },
  ] as IStatType[],
};

/**
 * addEditEntry
 */

test('add entry at the top of the list', () => {
  const entry: IEntry = {
    id: 4,
    stats: [],
    comment: '',
    date: {
      day: 10,
      month: 1,
      year: 2023,
    },
  };

  entries = addEditEntry(entries, entry, true);

  expect(entries[0].id).toBe(4);
});

test('add entry in the middle of the list', () => {
  const entry: IEntry = {
    id: 5,
    stats: [],
    comment: '',
    date: {
      day: 1,
      month: 1,
      year: 2023,
    },
  };

  entries = addEditEntry(entries, entry, true);

  expect(entries[3].id).toBe(5);
});

test('add entry at the bottom of the list', () => {
  const entry: IEntry = {
    id: 6,
    stats: [],
    comment: '',
    date: {
      day: 30,
      month: 12,
      year: 2022,
    },
  };

  entries = addEditEntry(entries, entry, true);

  expect(entries[5].id).toBe(6);
});

test('add two entries without dates', () => {
  const entry7: IEntry = {
    id: 7,
    stats: [],
    comment: '',
  };
  const entry8: IEntry = {
    id: 8,
    stats: [],
    comment: '',
  };

  entries = addEditEntry(entries, entry7, true);
  expect(entries[6].id).toBe(7);

  entries = addEditEntry(entries, entry8, true);
  expect(entries[6].id).toBe(8);
});

/**
 * updatePBs
 */

test('add first entry with PBs', () => {
  const entry: IEntry = {
    id: 9,
    stats: [
      {
        id: 1,
        type: 1,
        values: [80],
      },
      {
        id: 2,
        type: 2,
        values: [30, 22, 34],
        multiValueStats: {
          sum: 86,
          low: 22,
          high: 34,
          avg: 28.67,
        },
      },
    ],
    comment: '',
    date: {
      day: 11,
      month: 1,
      year: 2023,
    },
  };

  state.entries = addEditEntry(state.entries, entry, true);
  expect(updatePBs(state, entry, 'add')).toBe(true);

  // Weight PB
  expect(state.statTypes[0].pbs.allTime.entryId.bestWorst).toBe(9);
  expect(state.statTypes[0].pbs.allTime.result.bestWorst).toBe(80);
  // Push-ups PB
  expect(state.statTypes[1].pbs.allTime.result.avg).toBe(28.67);
  expect(state.statTypes[1].pbs.allTime.result.sum).toBe(86);
});

test('add entry with one new PB', () => {
  const entry: IEntry = {
    id: 10,
    stats: [
      {
        id: 1,
        type: 1,
        values: [79],
      },
      {
        id: 2,
        type: 2,
        values: [23, 10, 15, 25],
        multiValueStats: {
          sum: 73,
          low: 10,
          high: 15,
          avg: 18.25,
        },
      },
    ],
    comment: '',
    date: {
      day: 14,
      month: 1,
      year: 2023,
    },
  };

  state.entries = addEditEntry(state.entries, entry, true);
  expect(updatePBs(state, entry, 'add')).toBe(true);

  // Expect weight PB to be updated
  expect(state.statTypes[0].pbs.allTime.entryId.bestWorst).toBe(10);
  expect(state.statTypes[0].pbs.allTime.result.bestWorst).toBe(79);
  // Expect push-ups PB to be the same as before
  expect(state.statTypes[1].pbs.allTime.entryId.bestWorst).toBe(9);
  expect(state.statTypes[1].pbs.allTime.result.bestWorst).toBe(34);
});

test('add entry with PBs and another before it with no PBs in the middle of the list', () => {
  const entry11: IEntry = {
    id: 11,
    stats: [
      {
        id: 1,
        type: 1,
        values: [78],
      },
      {
        id: 2,
        type: 2,
        values: [40, 31, 20, 20],
        multiValueStats: {
          sum: 111,
          low: 20,
          high: 40,
          avg: 27.75,
        },
      },
    ],
    comment: '',
    date: {
      day: 13,
      month: 1,
      year: 2023,
    },
  };

  const entry12: IEntry = {
    id: 12,
    stats: [
      {
        id: 1,
        type: 1,
        values: [81],
      },
      {
        id: 2,
        type: 2,
        values: [10, 15, 20],
        multiValueStats: {
          sum: 45,
          low: 10,
          high: 20,
          avg: 15,
        },
      },
    ],
    comment: '',
    date: {
      day: 12,
      month: 1,
      year: 2023,
    },
  };

  state.entries = addEditEntry(state.entries, entry11, true);
  expect(updatePBs(state, entry11, 'add')).toBe(true);

  state.entries = addEditEntry(state.entries, entry12, true);
  expect(updatePBs(state, entry12, 'add')).toBe(false);

  // Expect weight PB to be updated
  expect(state.statTypes[0].pbs.allTime.entryId.bestWorst).toBe(11);
  expect(state.statTypes[0].pbs.allTime.result.bestWorst).toBe(78);
  // Expect push-ups PB best and sum to be updated
  expect(state.statTypes[1].pbs.allTime.entryId.bestWorst).toBe(11);
  expect(state.statTypes[1].pbs.allTime.result.bestWorst).toBe(40);
  expect(state.statTypes[1].pbs.allTime.entryId.avg).toBe(9);
  expect(state.statTypes[1].pbs.allTime.result.avg).toBe(28.67);
  expect(state.statTypes[1].pbs.allTime.entryId.sum).toBe(11);
  expect(state.statTypes[1].pbs.allTime.result.sum).toBe(111);
});

test('edit entry with no PBs', () => {
  const entry = state.entries.find((el) => el.id === 12);

  entry.stats[0].values[0] = 82;
  state.entries = addEditEntry(state.entries, entry);
  expect(updatePBs(state, entry, 'edit')).toBe(false);

  entry.stats[0].values[0] = 77;
  state.entries = addEditEntry(state.entries, entry);
  expect(updatePBs(state, entry, 'edit')).toBe(true);

  // Expect weight PB to be updated
  expect(state.statTypes[0].pbs.allTime.entryId.bestWorst).toBe(12);
  expect(state.statTypes[0].pbs.allTime.result.bestWorst).toBe(77);
});

test('delete entry that had PBs', () => {
  let entry;

  state.entries = state.entries.filter((el) => {
    if (el.id !== 11) return true;
    else {
      entry = el;
      return false;
    }
  });

  expect(updatePBs(state, entry, 'delete')).toBe(true);

  // Expect weight PB to be the same
  expect(state.statTypes[0].pbs.allTime.entryId.bestWorst).toBe(12);
  expect(state.statTypes[0].pbs.allTime.result.bestWorst).toBe(77);
  // Expect push-ups PB best and sum to be updated
  expect(state.statTypes[1].pbs.allTime.entryId.bestWorst).toBe(9);
  expect(state.statTypes[1].pbs.allTime.result.bestWorst).toBe(34);
  expect(state.statTypes[1].pbs.allTime.entryId.sum).toBe(9);
  expect(state.statTypes[1].pbs.allTime.result.sum).toBe(86);
});

test('add entry that ties PB with past entry', () => {
  const entry: IEntry = {
    id: 13,
    stats: [
      {
        id: 2,
        type: 2,
        values: [20, 21, 34],
        multiValueStats: {
          sum: 75,
          low: 20,
          high: 34,
          avg: 25,
        },
      },
    ],
    comment: '',
    date: {
      day: 15,
      month: 1,
      year: 2023,
    },
  };

  state.entries = addEditEntry(state.entries, entry, true);
  expect(updatePBs(state, entry, 'add')).toBe(false);
});

test('edit the date of an entry that had a PB tie to the same date as the PB entry', () => {
  const newEntry = {
    ...state.entries.find((el) => el.id === 13),
    date: {
      day: 11,
      month: 1,
      year: 2023,
    },
  };

  state.entries = addEditEntry(state.entries, newEntry);
  expect(updatePBs(state, newEntry, 'edit')).toBe(false);
});

test('edit the date of an entry that had a PB tie to before the PB entry', () => {
  const newEntry = {
    ...state.entries.find((el) => el.id === 13),
    date: {
      day: 9,
      month: 1,
      year: 2023,
    },
  };

  state.entries = addEditEntry(state.entries, newEntry);
  expect(updatePBs(state, newEntry, 'edit')).toBe(true);

  // Expect Push-ups best PB to be updated, but not sum or avg
  expect(state.statTypes[1].pbs.allTime.entryId.bestWorst).toBe(13);
  expect(state.statTypes[1].pbs.allTime.result.bestWorst).toBe(34);
  expect(state.statTypes[1].pbs.allTime.entryId.avg).toBe(9);
  expect(state.statTypes[1].pbs.allTime.result.avg).toBe(28.67);
  expect(state.statTypes[1].pbs.allTime.entryId.sum).toBe(9);
  expect(state.statTypes[1].pbs.allTime.result.sum).toBe(86);
});

test('delete last entry with a stat for a stat type that tracked PBs', () => {
  let entry;

  state.entries = state.entries.filter((el) => {
    if (el.id !== 9) return true;
    else {
      entry = el;
      return false;
    }
  });

  // Not checking, because Push-ups PB will actually get updated here
  updatePBs(state, entry, 'delete');

  state.entries = state.entries.filter((el) => {
    if (el.id !== 10) return true;
    else {
      entry = el;
      return false;
    }
  });

  expect(updatePBs(state, entry, 'delete')).toBe(false);

  state.entries = state.entries.filter((el) => {
    if (el.id !== 12) return true;
    else {
      entry = el;
      return false;
    }
  });

  expect(updatePBs(state, entry, 'delete')).toBe(true);

  // Expect Weight PB to be unset
  expect(state.statTypes[0].pbs).toBe(undefined);
});

test('add entry with PB for stat type that tracks month and year PBs', () => {
  const entry: IEntry = {
    id: 14,
    stats: [
      {
        id: 3,
        type: 3,
        values: [20, 24, 28],
        multiValueStats: {
          sum: 72,
          low: 20,
          high: 28,
          avg: 24,
        },
      },
    ],
    comment: '',
    date: {
      day: 20,
      month: 1,
      year: 2023,
    },
  };

  state.entries = addEditEntry(state.entries, entry, true);
  expect(updatePBs(state, entry, 'add')).toBe(true);

  // Expect squats all time PB to still not be set and the month and year PBs to be updated
  expect(state.statTypes[2].pbs.allTime).toBe(undefined);
  expect(state.statTypes[2].pbs.year.entryId.bestWorst).toBe(14);
  expect(state.statTypes[2].pbs.year.result.bestWorst).toBe(28);
  expect(state.statTypes[2].pbs.year.result.avg).toBe(24);
  expect(state.statTypes[2].pbs.year.result.sum).toBe(72);
  expect(state.statTypes[2].pbs.month.entryId.bestWorst).toBe(14);
});

test('add entry that breaks month and year PBs', () => {
  const entry: IEntry = {
    id: 15,
    stats: [
      {
        id: 3,
        type: 3,
        values: [25, 29, 33],
        multiValueStats: {
          sum: 87,
          low: 25,
          high: 33,
          avg: 29,
        },
      },
    ],
    comment: '',
    date: {
      day: 22,
      month: 1,
      year: 2023,
    },
  };

  state.entries = addEditEntry(state.entries, entry, true);
  expect(updatePBs(state, entry, 'add')).toBe(true);

  // Expect squats month and year PBs to be updated
  expect(state.statTypes[2].pbs.year.entryId.bestWorst).toBe(15);
  expect(state.statTypes[2].pbs.month.entryId.bestWorst).toBe(15);
});

test('add entry that breaks month and year PB in the middle of the list', () => {
  const entry: IEntry = {
    id: 16,
    stats: [
      {
        id: 3,
        type: 3,
        values: [30, 30, 30],
        multiValueStats: {
          sum: 90,
          low: 30,
          high: 30,
          avg: 30,
        },
      },
    ],
    comment: '',
    date: {
      day: 21,
      month: 1,
      year: 2023,
    },
  };

  state.entries = addEditEntry(state.entries, entry, true);
  expect(updatePBs(state, entry, 'add')).toBe(true);

  // Expect squats month and year PBs to be updated
  expect(state.statTypes[2].pbs.year.entryId.bestWorst).toBe(15);
  expect(state.statTypes[2].pbs.year.entryId.avg).toBe(16);
  expect(state.statTypes[2].pbs.year.entryId.sum).toBe(16);
  expect(state.statTypes[2].pbs.month.entryId.bestWorst).toBe(15);
  expect(state.statTypes[2].pbs.month.entryId.avg).toBe(16);
  expect(state.statTypes[2].pbs.month.entryId.sum).toBe(16);
});

test('edit entry and turn it into a month PB with one multi value stat year PB', () => {
  const entry17: IEntry = {
    id: 17,
    stats: [
      {
        id: 3,
        type: 3,
        values: [20, 22, 24],
        multiValueStats: {
          sum: 66,
          low: 20,
          high: 24,
          avg: 22,
        },
      },
    ],
    comment: '',
    date: {
      day: 3,
      month: 2,
      year: 2023,
    },
  };

  state.entries = addEditEntry(state.entries, entry17, true);
  expect(updatePBs(state, entry17, 'add')).toBe(true);

  expect(state.statTypes[2].pbs.year.entryId.bestWorst).toBe(15);
  expect(state.statTypes[2].pbs.year.entryId.avg).toBe(16);
  expect(state.statTypes[2].pbs.year.entryId.sum).toBe(16);
  expect(state.statTypes[2].pbs.month.entryId.bestWorst).toBe(17);
  expect(state.statTypes[2].pbs.month.entryId.avg).toBe(17);
  expect(state.statTypes[2].pbs.month.entryId.sum).toBe(17);

  const entry18: IEntry = {
    id: 18,
    stats: [
      {
        id: 3,
        type: 3,
        values: [23, 25, 27],
        multiValueStats: {
          sum: 75,
          low: 23,
          high: 27,
          avg: 25,
        },
      },
    ],
    comment: '',
    date: {
      day: 5,
      month: 2,
      year: 2023,
    },
  };

  state.entries = addEditEntry(state.entries, entry18, true);
  expect(updatePBs(state, entry18, 'add')).toBe(true);

  expect(state.statTypes[2].pbs.month.entryId.bestWorst).toBe(18);
  expect(state.statTypes[2].pbs.month.entryId.avg).toBe(18);
  expect(state.statTypes[2].pbs.month.entryId.sum).toBe(18);

  entry17.stats[0].values = [24, 34, 23];
  entry17.stats[0].multiValueStats = {
    sum: 81,
    low: 23,
    high: 34,
    avg: 27,
  };

  expect(updatePBs(state, entry17, 'add')).toBe(true);

  expect(state.statTypes[2].pbs.year.entryId.bestWorst).toBe(17);
  expect(state.statTypes[2].pbs.year.entryId.avg).toBe(16);
  expect(state.statTypes[2].pbs.year.entryId.sum).toBe(16);
  expect(state.statTypes[2].pbs.month.entryId.bestWorst).toBe(17);
  expect(state.statTypes[2].pbs.month.entryId.avg).toBe(17);
  expect(state.statTypes[2].pbs.month.entryId.sum).toBe(17);
});

test('edit entry that used to have a month PB and make it hold the year PB too', () => {
  const entry = state.entries.find((el) => el.id === 17);
  entry.stats[0].values = [31, 32];
  entry.stats[0].multiValueStats = {
    sum: 63,
    low: 31,
    high: 32,
    avg: 31.5,
  };

  expect(updatePBs(state, entry, 'add')).toBe(true);

  expect(state.statTypes[2].pbs.year.result.bestWorst).toBe(34);
  expect(state.statTypes[2].pbs.year.entryId.avg).toBe(17);
  expect(state.statTypes[2].pbs.year.result.avg).toBe(31.5);
  expect(state.statTypes[2].pbs.year.entryId.sum).toBe(16);
  expect(state.statTypes[2].pbs.month.result.bestWorst).toBe(34);
  expect(state.statTypes[2].pbs.month.result.avg).toBe(31.5);
  expect(state.statTypes[2].pbs.month.result.sum).toBe(81);
});

test('delete entry that held year PB', () => {
  let entry;
  state.entries = state.entries.filter((el) => {
    if (el.id !== 17) return true;
    else {
      entry = el;
      return false;
    }
  });

  expect(updatePBs(state, entry, 'delete')).toBe(true);

  expect(state.statTypes[2].pbs.year.entryId.bestWorst).toBe(15);
  expect(state.statTypes[2].pbs.year.entryId.avg).toBe(16);
  expect(state.statTypes[2].pbs.year.entryId.sum).toBe(16);
  expect(state.statTypes[2].pbs.month.entryId.bestWorst).toBe(18);
  expect(state.statTypes[2].pbs.month.entryId.avg).toBe(18);
  expect(state.statTypes[2].pbs.month.entryId.sum).toBe(18);
});

test('delete all entries for month and expect month PB to switch to previous month', () => {
  let entry;
  state.entries = state.entries.filter((el) => {
    if (el.id !== 18) return true;
    else {
      entry = el;
      return false;
    }
  });

  expect(updatePBs(state, entry, 'delete')).toBe(true);

  expect(state.statTypes[2].pbs.year.entryId.bestWorst).toBe(15);
  expect(state.statTypes[2].pbs.year.entryId.avg).toBe(16);
  expect(state.statTypes[2].pbs.year.entryId.sum).toBe(16);
  expect(state.statTypes[2].pbs.month.entryId.bestWorst).toBe(15);
  expect(state.statTypes[2].pbs.month.entryId.avg).toBe(16);
  expect(state.statTypes[2].pbs.month.entryId.sum).toBe(16);
});

test('add entry for new month that updates month PB only due to being for a newer month', () => {
  const entry: IEntry = {
    id: 19,
    stats: [
      {
        id: 3,
        type: 3,
        values: [18, 20, 22],
        multiValueStats: {
          sum: 60,
          low: 18,
          high: 22,
          avg: 20,
        },
      },
    ],
    comment: '',
    date: {
      day: 1,
      month: 3,
      year: 2023,
    },
  };

  state.entries = addEditEntry(state.entries, entry, true);
  expect(updatePBs(state, entry, 'add')).toBe(true);

  expect(state.statTypes[2].pbs.month.entryId.bestWorst).toBe(19);
  expect(state.statTypes[2].pbs.month.entryId.avg).toBe(19);
  expect(state.statTypes[2].pbs.month.entryId.sum).toBe(19);
});

test('add entry for new year and expect month and year PBs to be updated', () => {
  const entry: IEntry = {
    id: 20,
    stats: [
      {
        id: 3,
        type: 3,
        values: [21, 22, 23],
        multiValueStats: {
          sum: 66,
          low: 21,
          high: 23,
          avg: 22,
        },
      },
    ],
    comment: '',
    date: {
      day: 10,
      month: 2,
      year: 2024,
    },
  };

  state.entries = addEditEntry(state.entries, entry, true);
  expect(updatePBs(state, entry, 'add')).toBe(true);

  expect(state.statTypes[2].pbs.year.entryId.bestWorst).toBe(20);
  expect(state.statTypes[2].pbs.year.entryId.avg).toBe(20);
  expect(state.statTypes[2].pbs.year.entryId.sum).toBe(20);
  expect(state.statTypes[2].pbs.month.entryId.bestWorst).toBe(20);
  expect(state.statTypes[2].pbs.month.entryId.avg).toBe(20);
  expect(state.statTypes[2].pbs.month.entryId.sum).toBe(20);
});
