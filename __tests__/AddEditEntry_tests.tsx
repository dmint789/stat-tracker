import React from 'react';
import { screen } from '@testing-library/react-native';
import '@testing-library/jest-native';
import { PreloadedState } from '@reduxjs/toolkit';
import { RootState } from '../app/redux/store';
import { renderWithProvider } from '../utils/test-utils';
import AddEditEntry from '../app/screens/AddEditEntry';
import mainSliceMock from '../__mocks__/state/mainSlice';

jest.mock('../app/shared/StorageManager');
// Silence the warning https://github.com/facebook/react-native/issues/11094#issuecomment-263240420
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

const preloadedState: PreloadedState<RootState> = {
  main: mainSliceMock,
};

const emptyProps = {
  navigation: {
    setOptions() {},
    goBack() {},
    navigate() {},
  },
  route: { params: {} },
};

const editEntryProps = {
  navigation: {
    setOptions() {},
    goBack() {},
    navigate() {},
  },
  route: {
    params: {
      entry: preloadedState.main.entries[1],
    },
  },
};

describe('AddEditEntry screen', () => {
  test('screen renders correctly and with the right data', () => {
    renderWithProvider(<AddEditEntry {...emptyProps} />, { preloadedState });

    // Expect "Add Entry" text on the main button at the bottom
    expect(screen.getByText(/Add Entry/)).toBeOnTheScreen();
    // Expect default country to be selected
    expect(screen.getByText(/Country: UK/)).toBeOnTheScreen();
    // Expect "Marathon" stat type to be automatically selected
    expect(screen.getByText(/Marathon/)).toBeOnTheScreen();
  });

  test('stats that include a deleted stat type are shown', () => {
    renderWithProvider(<AddEditEntry {...editEntryProps} />, { preloadedState });
    expect(screen.getByText(/Country: UK/)).toBeOnTheScreen();
    expect(screen.getByText(/Marathon: 2:19:58\.329/)).toBeOnTheScreen();
    expect(screen.getByText(/\(Deleted\)/)).toBeOnTheScreen();
  });
});
