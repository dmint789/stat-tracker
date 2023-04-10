import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
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

describe('AddEditEntry screen in add mode', () => {
  test('screen renders correctly and with the right data', () => {
    renderWithProvider(<AddEditEntry {...emptyProps} />, { preloadedState });

    // Expect "Add Entry" text on the main button at the bottom
    expect(screen.getByText('Add Entry')).toBeOnTheScreen();
    // Expect default country to be selected
    expect(screen.getByText('Country: UK')).toBeOnTheScreen();
    // Expect "Marathon" stat type to be automatically selected
    expect(screen.getByText('Marathon')).toBeOnTheScreen();
  });

  const enterTimeDigits = (keys: string) => {
    for (let key of keys) {
      fireEvent(screen.getByPlaceholderText('(time placeholder for automated tests)'), 'onKeyPress', {
        nativeEvent: { key },
      });
    }
  };

  test('time input works correctly', () => {
    renderWithProvider(<AddEditEntry {...emptyProps} />, { preloadedState });

    enterTimeDigits('23102997');
    expect(screen.getByDisplayValue('2:31:02.997')).toBeOnTheScreen();
    fireEvent.press(screen.getByText('Add Stat'));
    expect(screen.getByText('Marathon: 2:31:02.997')).toBeOnTheScreen();
  });
});

describe('AddEditEntry screen in edit mode', () => {
  test('stats that include a deleted stat type are shown', () => {
    renderWithProvider(<AddEditEntry {...editEntryProps} />, { preloadedState });
    expect(screen.getByText('Country: UK')).toBeOnTheScreen();
    expect(screen.getByText('Marathon: 2:19:58.329')).toBeOnTheScreen();
    expect(screen.getByText('(Deleted): test')).toBeOnTheScreen();
  });
});
