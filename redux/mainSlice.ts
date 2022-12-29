import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as SM from '../shared/StorageManager';
import {
  IMultiValueStat,
  IStatCategory,
  IEntry,
  IStatType,
  IStat,
  StatTypeVariant,
} from '../shared/DataStructures';
import { getIsNumericVariant } from '../shared/GlobalFunctions';

const updateStatTypePB = (statType: IStatType, entry: IEntry): boolean => {
  let pbsUpdated = false;
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

        pbsUpdated = true;
      } else if (
        (statType.variant === StatTypeVariant.HIGHER_IS_BETTER) ===
          stat.values[0] > statType.pbs.allTime.result &&
        stat.values[0] !== statType.pbs.allTime.result
      ) {
        statType.pbs.allTime.entryId = entry.id;
        statType.pbs.allTime.result = stat.values[0] as number;

        pbsUpdated = true;
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
            result: { ...stat.multiValueStats },
          },
        };

        pbsUpdated = true;
      } else {
        const pbs = statType.pbs.allTime.result as IMultiValueStat;
        Object.keys(pbs).forEach((key) => {
          if (
            pbs[key] === null ||
            ((statType.variant === StatTypeVariant.HIGHER_IS_BETTER) ===
              stat.multiValueStats[key] > pbs[key] &&
              stat.multiValueStats[key] !== pbs[key])
          ) {
            statType.pbs.allTime.entryId[key] = entry.id;
            statType.pbs.allTime.result[key] = stat.multiValueStats[key];

            pbsUpdated = true;
          }
        });
      }
    }
  }
  return pbsUpdated;
};

const updatePBs = (state: any, entry: IEntry, mode: 'add' | 'edit' | 'delete') => {
  let pbsUpdated = false;

  for (let statType of state.statTypes) {
    if (statType.trackPBs && getIsNumericVariant(statType.variant)) {
      if (mode !== 'delete') {
        pbsUpdated = updateStatTypePB(statType, entry) || pbsUpdated;
      }

      if (mode !== 'add') {
        let isPrevPB = false;

        if (!statType.multipleValues && statType.pbs.allTime.entryId === entry.id) {
          isPrevPB = true;
          statType.pbs = null;
        } else if (statType.multipleValues) {
          Object.keys(statType.pbs.allTime.entryId).forEach((key) => {
            if (statType.pbs.allTime.entryId[key] === entry.id) {
              isPrevPB = true;
              statType.pbs.allTime.result[key] = null;
              statType.pbs.allTime.entryId[key] = null;
            }
          });
        }

        if (isPrevPB) {
          for (let e of state.entries as IEntry[]) {
            pbsUpdated = updateStatTypePB(statType, e) || pbsUpdated;
          }

          // If a PB is left unset after the loop, that means there are no entries left with this stat type
          if (
            (!statType.multipleValues && statType.pbs === null) ||
            (statType.multipleValues && statType.pbs.allTime.entryId.best === null)
          ) {
            pbsUpdated = true;
            delete statType.pbs;
          }
        }
      }
    }
  }

  if (pbsUpdated) SM.setData(state.statCategory.id, 'statTypes', state.statTypes);
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
      state.entries.unshift(action.payload);
      SM.setData(state.statCategory.id, 'entries', state.entries);

      // Update PBs if needed
      updatePBs(state, action.payload, 'add');

      // Update stat category
      state.statCategory.lastEntryId++;
      state.statCategory.totalEntries++;
      state.statCategories = state.statCategories.map((el) =>
        el.id === state.statCategory.id ? state.statCategory : el,
      );
      SM.setStatCategories(state.statCategories);
    },
    editEntry: (state, action: PayloadAction<IEntry>) => {
      state.entries = state.entries.map((el) => (el.id === action.payload.id ? action.payload : el));
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
          } else if (!el.trackPBs && action.payload.trackPBs) {
            for (let entry of state.entries as IEntry[]) {
              updateStatTypePB(action.payload, entry);
            }
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
