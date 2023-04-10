import { configureStore, combineReducers, PreloadedState } from '@reduxjs/toolkit';
import mainReducer from './mainSlice';
import importExportReducer from './importExportSlice';

const rootReducer = combineReducers({
  main: mainReducer,
  importExport: importExportReducer,
});

const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>; // used in utils/test-utils.tsx
export type AppDispatch = AppStore['dispatch'];
export default setupStore;
