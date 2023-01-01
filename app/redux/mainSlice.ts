import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as SM from '../shared/StorageManager';
import { isNewerOrSameDate } from '../shared/GlobalFunctions';
import {
  IMultiValuePB,
  IStatCategory,
  IEntry,
  IStatType,
  IStat,
  StatTypeVariant,
} from '../shared/DataStructure';

const verbose = true;

const addEditEntry = (entries: IEntry[], entry: IEntry): IEntry[] => {
  if (verbose) {
    console.log('Adding or editing entry:');
    console.log(JSON.stringify(entry, null, 2));
  }

  const newEntries: IEntry[] = [];
  let inserted = false;

  if (entries.length > 0) {
    for (let e of entries) {
      if (!inserted && isNewerOrSameDate(entry.date, e.date)) {
        newEntries.push(entry);
        inserted = true;
      }
      if (e.id !== entry.id) {
        newEntries.push(e);
      }
    }

    if (!inserted) newEntries.push(entry);
  } else {
    newEntries.push(entry);
  }

  return newEntries;
};

const convertKey = (key, statType) => (key === 'best' ? (statType.higherIsBetter ? 'high' : 'low') : key);

// The return value is whether or not the PB got updated
const updateStatTypePB = (state: any, statType: IStatType, entry: IEntry): boolean => {
  if (verbose) console.log(`Checking if entry ${entry.id} has the PB for stat type ${statType.name}`);

  let pbUpdated = false;
  const stat = entry.stats.find((el: IStat) => el.type === statType.id);

  if (stat) {
    if (!statType.multipleValues) {
      // If adding PB for the first time
      if (!statType.pbs) {
        statType.pbs = {
          allTime: {
            entryId: entry.id,
            result: stat.values[0] as number,
          },
        };

        pbUpdated = true;
      } else if (
        (stat.values[0] > statType.pbs.allTime.result && statType.higherIsBetter) ||
        (stat.values[0] < statType.pbs.allTime.result && !statType.higherIsBetter) ||
        (stat.values[0] === statType.pbs.allTime.result &&
          !isNewerOrSameDate(
            entry.date,
            state.entries.find((el) => el.id === statType.pbs.allTime.entryId).date,
          ))
      ) {
        statType.pbs.allTime.entryId = entry.id;
        statType.pbs.allTime.result = stat.values[0] as number;

        pbUpdated = true;
      }
    } else {
      // If adding PB for the first time
      if (!statType.pbs) {
        statType.pbs = {
          allTime: {
            entryId: {
              best: entry.id,
              avg: entry.id,
              sum: entry.id,
            },
            result: {
              best: statType.higherIsBetter ? stat.multiValueStats.high : stat.multiValueStats.low,
              avg: stat.multiValueStats.avg,
              sum: stat.multiValueStats.sum,
            },
          },
        };

        pbUpdated = true;
      } else {
        const pbs = statType.pbs.allTime.result as IMultiValuePB;

        ['best', 'avg', 'sum'].forEach((key) => {
          if (
            pbs[key] === null ||
            (stat.multiValueStats[convertKey(key, statType)] > pbs[key] && statType.higherIsBetter) ||
            (stat.multiValueStats[convertKey(key, statType)] < pbs[key] && !statType.higherIsBetter) ||
            (stat.multiValueStats[convertKey(key, statType)] === pbs[key] &&
              !isNewerOrSameDate(
                entry.date,
                state.entries.find((el) => el.id === statType.pbs.allTime.entryId[key]).date,
              ))
          ) {
            statType.pbs.allTime.entryId[key] = entry.id;
            statType.pbs.allTime.result[key] = stat.multiValueStats[convertKey(key, statType)];

            pbUpdated = true;
          }
        });
      }
    }
  }

  return pbUpdated;
};

const checkPBFromScratch = (state: any, statType: IStatType) => {
  if (verbose) console.log(`Checking PB from scratch for stat type ${statType.name}`);

  for (let i = state.entries.length - 1; i >= 0; i--) {
    updateStatTypePB(state, statType, state.entries[i]);
  }
};

const updatePBs = (state: any, entry: IEntry, mode: 'add' | 'edit' | 'delete') => {
  let PBsUpdated = false;

  for (let statType of state.statTypes) {
    if (statType.trackPBs && statType.variant === StatTypeVariant.NUMBER) {
      if (verbose) console.log(`Updating PB for stat type ${statType.name}`);

      let pbUpdated = false;

      // Update PB if it could have gotten better or it's a tie, but happened earlier
      if (mode !== 'delete') {
        pbUpdated = updateStatTypePB(state, statType, entry) || pbUpdated;
      }

      // Update PB if it could have gotten worse
      // Skip checking PB if it was already updated and the stat type only has single values
      if (mode !== 'add' && (!pbUpdated || statType.multipleValues)) {
        if (statType.pbs) {
          let isPrevPB = false;
          const tempStatType: IStatType = {
            ...statType,
            pbs: {
              allTime: {
                entryId: { ...statType.pbs.allTime.entryId },
                result: { ...statType.pbs.allTime.result },
              },
            },
          };

          // Check that the entry held the PB for the stat type before and the value is different or deleted now
          if (
            !statType.multipleValues &&
            statType.pbs.allTime.entryId === entry.id &&
            statType.pbs.allTime.result !== entry.stats.find((el) => el.type === statType.id)?.values[0]
          ) {
            isPrevPB = true;
            tempStatType.pbs = null;
          } else if (statType.multipleValues) {
            ['best', 'avg', 'sum'].forEach((key) => {
              if (
                statType.pbs.allTime.entryId[key] === entry.id &&
                statType.pbs.allTime.result[key] !==
                  entry.stats.find((el) => el.type === statType.id)?.multiValueStats[
                    convertKey(key, statType)
                  ]
              ) {
                isPrevPB = true;
                tempStatType.pbs.allTime.entryId[key] = null;
                tempStatType.pbs.allTime.result[key] = null;
              }
            });
          }

          if (isPrevPB) {
            checkPBFromScratch(state, tempStatType);

            if (!tempStatType.multipleValues) {
              // If this is null, that means no entries are left with this stat type
              if (tempStatType.pbs === null) {
                pbUpdated = true;
                delete statType.pbs;
              } else if (
                tempStatType.pbs.allTime.result !== statType.pbs.allTime.result ||
                tempStatType.pbs.allTime.entryId !== statType.pbs.allTime.entryId
              ) {
                pbUpdated = true;
                statType.pbs = tempStatType.pbs;
              }
            } else {
              // If this is null, that means no entries are left with this stat type.
              // It doesn't have to be best, because avg and sum would also be null if best is null.
              if (tempStatType.pbs.allTime.entryId['best'] === null) {
                pbUpdated = true;
                delete statType.pbs;
              } else {
                if (
                  !!['best', 'avg', 'sum'].find(
                    (key) =>
                      tempStatType.pbs.allTime.entryId[key] !== statType.pbs.allTime.entryId[key] ||
                      tempStatType.pbs.allTime.result[key] !== statType.pbs.allTime.result[key],
                  )
                ) {
                  pbUpdated = true;
                  statType.pbs = tempStatType.pbs;
                }
              }
            }
          }
        } else {
          console.error('Stat type has no PB, which cannot be the case!');
        }
      }

      PBsUpdated = pbUpdated || PBsUpdated;

      if (verbose) {
        if (pbUpdated) {
          console.log('PB updated to: ', JSON.stringify(statType.pbs, null, 2));
        } else {
          console.log('PB not updated');
        }
      }
    }
  }

  if (PBsUpdated) SM.setData(state.statCategory.id, 'statTypes', state.statTypes);
};

const initialState = {
  statCategories: [] as IStatCategory[],
  statCategory: null as IStatCategory,
  lastCategoryId: 0,
  entries: [] as IEntry[],
  statTypes: [] as IStatType[],
};

const mainSlice = createSlice({
  name: 'main-slice',
  initialState,
  reducers: {
    /**
     * Stat Categories
     */
    initStatCategories: (state, action: PayloadAction<IStatCategory[]>) => {
      state.statCategories = action.payload;
    },
    initLastCategoryId: (state, action: PayloadAction<number>) => {
      state.lastCategoryId = action.payload;
    },
    addStatCategory: (state, action: PayloadAction<IStatCategory>) => {
      state.statCategories.unshift(action.payload);
      SM.setStatCategories(state.statCategories);

      state.lastCategoryId++;
      SM.setLastCategoryId(state.lastCategoryId);
    },
    editStatCategory: (state, action: PayloadAction<IStatCategory>) => {
      state.statCategories = state.statCategories.map((el) =>
        el.id === action.payload.id ? action.payload : el,
      );
      SM.setStatCategories(state.statCategories);
    },
    deleteStatCategory: (state, action: PayloadAction<IStatCategory>) => {
      state.statCategories = state.statCategories.filter((el) => el.id !== action.payload.id);
      SM.deleteStatCategory(action.payload, state.statCategories);
    },
    // This is for when a stat category is selected in the main menu
    setStatCategory: (
      state,
      action: PayloadAction<{ statCategory: IStatCategory; statTypes: IStatType[]; entries: IEntry[] }>,
    ) => {
      state.statCategory = action.payload.statCategory;
      state.statTypes = action.payload.statTypes;
      state.entries = action.payload.entries;

      // Reorder stat categories if necessary
      if (state.statCategory.id !== state.statCategories[0].id) {
        state.statCategories = [
          state.statCategory,
          ...state.statCategories.filter((el) => el.id !== state.statCategory.id),
        ];
        SM.setStatCategories(state.statCategories);
      }
    },

    /**
     * Entries
     */
    addEntry: (state, action: PayloadAction<IEntry>) => {
      state.entries = addEditEntry(state.entries, action.payload);
      SM.setData(state.statCategory.id, 'entries', state.entries);

      // Update PBs if needed
      updatePBs(state, action.payload, 'add');

      // Update stat category
      state.statCategory.lastEntryId++;
      state.statCategory.totalEntries = state.entries.length;
      state.statCategories = state.statCategories.map((el) =>
        el.id === state.statCategory.id ? state.statCategory : el,
      );
      SM.setStatCategories(state.statCategories);
    },
    // This is the same as the first part of addEntry
    editEntry: (state, action: PayloadAction<IEntry>) => {
      state.entries = addEditEntry(state.entries, action.payload);
      SM.setData(state.statCategory.id, 'entries', state.entries);

      // Update PBs if needed
      updatePBs(state, action.payload, 'edit');
    },
    deleteEntry: (state, action: PayloadAction<IEntry>) => {
      state.entries = state.entries.filter((el) => el.id !== action.payload.id);

      if (state.entries.length === 0) {
        SM.deleteData(state.statCategory.id, 'entries');
      } else {
        SM.setData(state.statCategory.id, 'entries', state.entries);
      }

      // Update PBs if needed
      updatePBs(state, action.payload, 'delete');

      // Update the number of entries
      state.statCategory.totalEntries = state.entries.length;
      state.statCategories = state.statCategories.map((el) =>
        el.id === state.statCategory.id ? state.statCategory : el,
      );
      SM.setStatCategories(state.statCategories);
    },

    /**
     * Stat Types
     */
    addStatType: (state, action: PayloadAction<IStatType>) => {
      state.statTypes.push(action.payload);
      SM.setData(state.statCategory.id, 'statTypes', state.statTypes);

      // Update stat category
      state.statCategory.lastStatTypeId++;
      state.statCategories = state.statCategories.map((el) =>
        el.id === state.statCategory.id ? state.statCategory : el,
      );
      SM.setStatCategories(state.statCategories);
    },
    editStatType: (state, action: PayloadAction<IStatType>) => {
      state.statTypes = state.statTypes.map((el) => {
        if (el.id === action.payload.id) {
          if (el.trackPBs && !action.payload.trackPBs) {
            delete action.payload.pbs;
          } else if (
            action.payload.trackPBs &&
            (!el.trackPBs || action.payload.higherIsBetter !== el.higherIsBetter)
          ) {
            checkPBFromScratch(state, action.payload);
          }

          SM.setData(state.statCategory.id, 'statTypes', state.statTypes);

          return action.payload;
        } else return el;
      });

      SM.setData(state.statCategory.id, 'statTypes', state.statTypes);
    },
    reorderStatTypes: (state, action: PayloadAction<{ statType: IStatType; up: boolean }>) => {
      const { statType, up } = action.payload;

      state.statTypes = state.statTypes
        .map((el) => {
          const upCondition = (up && el.id === statType.id) || (!up && el.order === statType.order + 1);
          const downCondition = (!up && el.id === statType.id) || (up && el.order === statType.order - 1);

          if (upCondition || downCondition) {
            return {
              ...el,
              order: el.order + (upCondition ? -1 : 1),
            };
          } else return el;
        })
        .sort((a, b) => a.order - b.order);

      SM.setData(state.statCategory.id, 'statTypes', state.statTypes);
    },
    deleteStatType: (state, action: PayloadAction<number>) => {
      state.statTypes = state.statTypes
        .filter((el) => el.id !== action.payload)
        .map((el, i) => ({ ...el, order: i + 1 }));

      if (state.statTypes.length === 0) {
        SM.deleteData(state.statCategory.id, 'statTypes');
      } else {
        SM.setData(state.statCategory.id, 'statTypes', state.statTypes);
      }
    },
  },
});

export const {
  initStatCategories,
  initLastCategoryId,
  addStatCategory,
  editStatCategory,
  deleteStatCategory,
  setStatCategory,
  addEntry,
  editEntry,
  deleteEntry,
  addStatType,
  editStatType,
  reorderStatTypes,
  deleteStatType,
} = mainSlice.actions;
export default mainSlice.reducer;
