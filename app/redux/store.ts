import { configureStore } from '@reduxjs/toolkit';
import mainReducer from './mainSlice';
import importExportReducer from './importExportSlice';

const store = configureStore({
  reducer: {
    main: mainReducer,
    importExport: importExportReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
