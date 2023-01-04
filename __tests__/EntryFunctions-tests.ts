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
      multipleValues: false,
    },
    {
      id: 2,
      name: 'Push-ups',
      order: 2,
      variant: 1,
      higherIsBetter: true,
      trackPBs: true,
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
  expect(state.statTypes[0].pbs.allTime.entryId.best).toBe(9);
  expect(state.statTypes[0].pbs.allTime.result.best).toBe(80);
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
  expect(state.statTypes[0].pbs.allTime.entryId.best).toBe(10);
  expect(state.statTypes[0].pbs.allTime.result.best).toBe(79);
  // Expect push-ups PB to be the same as before
  expect(state.statTypes[1].pbs.allTime.entryId.best).toBe(9);
  expect(state.statTypes[1].pbs.allTime.result.best).toBe(34);
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
  expect(state.statTypes[0].pbs.allTime.entryId.best).toBe(11);
  expect(state.statTypes[0].pbs.allTime.result.best).toBe(78);
  // Expect push-ups PB best and sum to be updated
  expect(state.statTypes[1].pbs.allTime.entryId.best).toBe(11);
  expect(state.statTypes[1].pbs.allTime.result.best).toBe(40);
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
  expect(state.statTypes[0].pbs.allTime.entryId.best).toBe(12);
  expect(state.statTypes[0].pbs.allTime.result.best).toBe(77);
});

test('delete entry that had PBs', () => {
  let entry;

  state.entries = state.entries.filter((el) => {
    if (el.id !== 11) {
      return true;
    } else {
      entry = el;
      return false;
    }
  });

  expect(updatePBs(state, entry, 'delete')).toBe(true);

  // Expect weight PB to be the same
  expect(state.statTypes[0].pbs.allTime.entryId.best).toBe(12);
  expect(state.statTypes[0].pbs.allTime.result.best).toBe(77);
  // Expect push-ups PB best and sum to be updated
  expect(state.statTypes[1].pbs.allTime.entryId.best).toBe(9);
  expect(state.statTypes[1].pbs.allTime.result.best).toBe(34);
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

test('edit the date of an entry that had a PB tie to the same date as PB entry, and then to before it', () => {
  const entry = state.entries.find((el) => el.id === 13);

  entry.date = {
    day: 11,
    month: 1,
    year: 2023,
  };

  state.entries = addEditEntry(state.entries, entry);
  expect(updatePBs(state, entry, 'edit')).toBe(false);

  entry.date = {
    day: 9,
    month: 1,
    year: 2023,
  };

  state.entries = addEditEntry(state.entries, entry);
  expect(updatePBs(state, entry, 'edit')).toBe(true);

  // Expect Push-ups best PB to be updated, but not sum or avg
  expect(state.statTypes[1].pbs.allTime.entryId.best).toBe(13);
  expect(state.statTypes[1].pbs.allTime.result.best).toBe(34);
  expect(state.statTypes[1].pbs.allTime.entryId.avg).toBe(9);
  expect(state.statTypes[1].pbs.allTime.result.avg).toBe(28.67);
  expect(state.statTypes[1].pbs.allTime.entryId.sum).toBe(9);
  expect(state.statTypes[1].pbs.allTime.result.sum).toBe(86);
});
