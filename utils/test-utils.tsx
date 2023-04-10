import React, { PropsWithChildren } from 'react';
import { RenderOptions, render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import defaultStore, { AppStore } from '../app/redux/store';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  store?: AppStore;
}

export const renderWithProvider = (
  ui: React.ReactElement,
  { store = defaultStore, ...renderOptions }: ExtendedRenderOptions = {},
) => {
  const wrapper = ({ children }: PropsWithChildren<{}>): JSX.Element => {
    return <Provider store={store}>{children}</Provider>;
  };

  return {
    store,
    ...render(ui, { wrapper, ...renderOptions }),
  };
};
