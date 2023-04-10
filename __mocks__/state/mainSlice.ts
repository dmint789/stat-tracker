import { IStatCategory, IEntry, IStatType } from '../../app/shared/DataStructure';

export default {
  statCategories: [
    {
      id: 1,
      name: 'Test',
      note: '',
      lastEntryId: 10,
      lastStatTypeId: 7,
      totalEntries: 5,
    },
  ] as IStatCategory[],
  statCategory: {
    id: 1,
    name: 'Test',
    note: '',
    lastEntryId: 10,
    lastStatTypeId: 7,
    totalEntries: 5,
  } as IStatCategory,
  lastCategoryId: 1,
  entries: [
    {
      id: 2,
      stats: [
        {
          id: 1,
          type: 1, // Country
          values: [3], // USA
        },
        {
          id: 2,
          type: 2, // Marathon
          values: [8315754], // 2 hours, 18 minutes, 35.754 seconds
        },
      ],
      comment: '',
      date: {
        day: 30,
        month: 1,
        year: 2023,
      },
    },
    {
      id: 1,
      stats: [
        {
          id: 1,
          type: 1, // Country
          values: [2], // UK
        },
        {
          id: 2,
          type: 2, // Marathon
          values: [8398329], // 2 hours, 19 minutes, 58.329 seconds
        },
      ],
      comment: '',
      date: {
        day: 16,
        month: 1,
        year: 2023,
      },
    },
  ] as IEntry[],
  // TEMPORARY REGEX "([^"*]*)":  to  $1:
  statTypes: [
    {
      id: 1,
      name: 'Country',
      order: 1,
      variant: 2,
      choices: [
        {
          id: 1,
          label: 'Russia',
        },
        {
          id: 2,
          label: 'UK',
        },
        {
          id: 3,
          label: 'USA',
        },
        {
          id: 4,
          label: 'Japan',
        },
      ],
      defaultValue: 2,
    },
    {
      id: 2,
      name: 'Marathon',
      order: 2,
      variant: 3,
      higherIsBetter: false,
      trackPBs: true,
      trackYearPBs: true,
      trackMonthPBs: true,
      decimals: 3,
      multipleValues: false,
    },
  ] as IStatType[],
};
