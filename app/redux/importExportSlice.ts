import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { IStatCategory } from '../shared/DataStructure';
import * as SM from '../shared/StorageManager';

const initialState = {
  exportSuccess: '',
  exportError: '',
  importSuccess: '',
  importError: '',
};

export const exportData = createAsyncThunk('importExport/exportData', () => {
  return SM.exportData();
});

export const importData = createAsyncThunk(
  'importExport/importData',
  ({ statCategories, lastCategoryId }: { statCategories: IStatCategory[]; lastCategoryId: number }) => {
    return SM.importData(statCategories, lastCategoryId);
  },
);

const importExportSlice = createSlice({
  name: 'importExport',
  initialState,
  reducers: {
    clearAllMessages: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Export
    builder.addCase(exportData.pending, () => {
      return initialState;
    });
    builder.addCase(exportData.fulfilled, (_, action: any) => {
      return {
        ...initialState,
        exportSuccess: action.payload.message,
        exportError: action.payload.error,
      };
    });
    builder.addCase(exportData.rejected, (_, action: any) => {
      return {
        ...initialState,
        exportSuccess: action.payload.message,
        exportError: action.payload.error,
      };
    });

    // Import
    builder.addCase(importData.pending, () => {
      return initialState;
    });
    builder.addCase(importData.fulfilled, (_, action: any) => {
      return {
        ...initialState,
        importSuccess: action.payload.message,
        importError: action.payload.error,
      };
    });
    builder.addCase(importData.rejected, (_, action: any) => {
      return {
        ...initialState,
        importSuccess: action.payload.message,
        importError: action.payload.error,
      };
    });
  },
});

export const { clearAllMessages } = importExportSlice.actions;
export default importExportSlice.reducer;
