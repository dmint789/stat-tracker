import React, { PropsWithChildren } from 'react';
import { RenderOptions, render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { PreloadedState } from '@reduxjs/toolkit';
import setupStore, { AppStore, RootState } from '../app/redux/store';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
}

export const renderWithProvider = (
  ui: React.ReactElement,
  { preloadedState = {}, store = setupStore(preloadedState), ...renderOptions }: ExtendedRenderOptions = {},
) => {
  const wrapper = ({ children }: PropsWithChildren<{}>): JSX.Element => {
    return <Provider store={store}>{children}</Provider>;
  };

  return {
    store,
    ...render(ui, { wrapper, ...renderOptions }),
  };
};
