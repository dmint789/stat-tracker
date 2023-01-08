import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as SM from '../shared/StorageManager';
import { addEditEntry, updatePBs, checkPBFromScratch } from '../shared/EntryFunctions';
import { IStatCategory, IEntry, IStatType } from '../shared/DataStructure';

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
      state.statCategories = [action.payload, ...state.statCategories];
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
      state.entries = addEditEntry(state.entries, action.payload, true);
      SM.setData(state.statCategory.id, 'entries', state.entries);

      // Update PBs if needed
      if (updatePBs(state, action.payload, 'add'))
        SM.setData(state.statCategory.id, 'statTypes', state.statTypes);

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
      if (updatePBs(state, action.payload, 'edit'))
        SM.setData(state.statCategory.id, 'statTypes', state.statTypes);
    },
    deleteEntry: (state, action: PayloadAction<IEntry>) => {
      state.entries = state.entries.filter((el) => el.id !== action.payload.id);

      if (state.entries.length === 0) {
        SM.deleteData(state.statCategory.id, 'entries');
      } else {
        SM.setData(state.statCategory.id, 'entries', state.entries);
      }

      // Update PBs if needed
      if (updatePBs(state, action.payload, 'delete'))
        SM.setData(state.statCategory.id, 'statTypes', state.statTypes);

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
          let checkFromScratch = false;

          if (el.trackPBs && !action.payload.trackPBs && action.payload.pbs)
            delete action.payload.pbs.allTime;
          else if (
            action.payload.trackPBs &&
            (!el.trackPBs || action.payload.higherIsBetter !== el.higherIsBetter)
          )
            checkFromScratch = true;

          if (el.trackYearPBs && !action.payload.trackYearPBs && action.payload.pbs)
            delete action.payload.pbs.year;
          else if (
            action.payload.trackYearPBs &&
            (!el.trackYearPBs || action.payload.higherIsBetter !== el.higherIsBetter)
          )
            checkFromScratch = true;

          if (el.trackMonthPBs && !action.payload.trackMonthPBs && action.payload.pbs)
            delete action.payload.pbs.month;
          else if (
            action.payload.trackMonthPBs &&
            (!el.trackMonthPBs || action.payload.higherIsBetter !== el.higherIsBetter)
          )
            checkFromScratch = true;

          if (action.payload.pbs && Object.keys(action.payload.pbs).length === 0) delete action.payload.pbs;
          if (checkFromScratch) checkPBFromScratch(state, action.payload);

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
