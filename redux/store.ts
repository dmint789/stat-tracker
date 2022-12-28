import { configureStore } from '@reduxjs/toolkit';
import mainReducer from './mainSlice';

const store = configureStore({
  reducer: {
    main: mainReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
