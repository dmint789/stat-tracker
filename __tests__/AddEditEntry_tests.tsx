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

const props = {
  navigation: {
    setOptions() {},
    goBack() {},
    navigate() {},
  },
  route: {
    params: {},
  },
};

const preloadedState: PreloadedState<RootState> = {
  main: mainSliceMock,
};

test('AddEditEntry screen renders correctly', () => {
  renderWithProvider(<AddEditEntry {...props} />, { preloadedState });

  expect(screen.getByText(/Add Entry/)).toBeOnTheScreen();
  // Expect default country to be selected
  expect(screen.getByText(/Country: UK/)).toBeOnTheScreen();
});
