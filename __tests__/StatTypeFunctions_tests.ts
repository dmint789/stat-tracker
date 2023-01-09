import { IStatType } from '../app/shared/DataStructure';
import { updateStatType, updateStatTypesOrder } from '../app/shared/StatTypeFunctions';

const state = {
  entries: [
    {
      id: 3,
      stats: [
        {
          id: 1,
          type: 1,
          values: [81],
        },
      ],
      comment: '',
      date: {
        day: 3,
        month: 2,
        year: 2023,
      },
    },
    {
      id: 2,
      stats: [
        {
          id: 1,
          type: 1,
          values: [80],
        },
      ],
      comment: '',
      date: {
        day: 11,
        month: 1,
        year: 2023,
      },
    },
    {
      id: 1,
      stats: [
        {
          id: 1,
          type: 1,
          values: [78],
        },
      ],
      comment: '',
      date: {
        day: 29,
        month: 12,
        year: 2022,
      },
    },
  ],
  statTypes: [
    {
      id: 1,
      name: 'Weight',
      order: 1,
      variant: 1,
      unit: 'kg',
      higherIsBetter: false,
      trackPBs: false,
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
      trackPBs: false,
      trackYearPBs: false,
      trackMonthPBs: false,
      multipleValues: true,
      showBest: true,
      showAvg: true,
      showSum: true,
    },
  ] as IStatType[],
};

test('edit stat type with just month PBs being turned on', () => {
  const statType = {
    id: 1,
    name: 'Weight',
    order: 1,
    variant: 1,
    unit: 'kg',
    higherIsBetter: false,
    trackPBs: false,
    trackYearPBs: false,
    trackMonthPBs: true, // update only this
    multipleValues: false,
  };

  state.statTypes = updateStatType(state, statType);
  expect(state.statTypes[0].pbs.allTime).toBe(undefined);
  expect(state.statTypes[0].pbs.year).toBe(undefined);
  expect(state.statTypes[0].pbs.month.entryId.bestWorst).toBe(3);
  expect(state.statTypes[0].pbs.month.result.bestWorst).toBe(81);
  expect(state.statTypes[0].pbs.month.entryId.avg).toBe(undefined);
});

test('edit stat type with month PBs turned off and the others turned on', () => {
  const statType = {
    id: 1,
    name: 'Weight',
    order: 1,
    variant: 1,
    unit: 'kg',
    higherIsBetter: false,
    trackPBs: true, // update this
    trackYearPBs: true, // update this
    trackMonthPBs: false, // update this
    multipleValues: false,
  };

  state.statTypes = updateStatType(state, statType);
  expect(state.statTypes[0].pbs.allTime.entryId.bestWorst).toBe(1);
  expect(state.statTypes[0].pbs.allTime.result.bestWorst).toBe(78);
  expect(state.statTypes[0].pbs.year.entryId.bestWorst).toBe(2);
  expect(state.statTypes[0].pbs.year.result.bestWorst).toBe(80);
  expect(state.statTypes[0].pbs.month).toBe(undefined);
});

test('edit stat type with all PB tracking turned off', () => {
  const statType = {
    id: 1,
    name: 'Weight',
    order: 1,
    variant: 1,
    unit: 'kg',
    higherIsBetter: false,
    trackPBs: false, // update this
    trackYearPBs: false, // update this
    trackMonthPBs: false,
    multipleValues: false,
  };

  state.statTypes = updateStatType(state, statType);
  expect(state.statTypes[0].pbs).toBe(undefined);
});

test('reorder stat types with 2 stat types in the list', () => {
  state.statTypes = updateStatTypesOrder(state.statTypes, state.statTypes[0], false);
  expect(state.statTypes[0].id).toBe(2);
});

test('reorder stat types with 4 stat types in the list', () => {
  state.statTypes.push({
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
  });

  state.statTypes.push({
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
  });

  state.statTypes = updateStatTypesOrder(state.statTypes, state.statTypes[3], true);
  expect(state.statTypes[0].id).toBe(2);
  expect(state.statTypes[1].id).toBe(1);
  expect(state.statTypes[2].id).toBe(4);
  expect(state.statTypes[3].id).toBe(3);
});
