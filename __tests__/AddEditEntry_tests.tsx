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

const getEditEntryProps = (entryId: number) => {
  return {
    navigation: {
      setOptions() {},
      goBack() {},
      navigate() {},
    },
    route: {
      params: {
        entry: preloadedState.main.entries.find((entry) => entry.id === entryId),
      },
    },
  };
};

const enterTimeDigits = (keys: string) => {
  for (let key of keys) {
    fireEvent(screen.getByPlaceholderText('(time placeholder for automated tests)'), 'onKeyPress', {
      nativeEvent: { key },
    });
  }
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

  test('time input works correctly', () => {
    renderWithProvider(<AddEditEntry {...emptyProps} />, { preloadedState });
    enterTimeDigits('23102997');
    expect(screen.getByDisplayValue('2:31:02.997')).toBeOnTheScreen();
    fireEvent.press(screen.getByText('Add Stat'));
    expect(screen.getByText('Marathon: 2:31:02.997')).toBeOnTheScreen();
  });

  describe('enter stat, switching to the next stat type', () => {
    test('enter multiple choice stat, switching to time stat', () => {
      renderWithProvider(<AddEditEntry {...emptyProps} />, { preloadedState });
      // Edit the multiple choice stat that has already been entered by default
      fireEvent.press(screen.getByText('Country: UK'));
      fireEvent.press(screen.getByText('USA')); // select country
      expect(screen.getByDisplayValue('0:00:00.000')).toBeOnTheScreen(); // expect switch to time stat type
    });
  });
});

describe('AddEditEntry screen in edit mode', () => {
  test('stats that include a deleted stat type are shown', () => {
    renderWithProvider(<AddEditEntry {...getEditEntryProps(1)} />, { preloadedState });
    expect(screen.getByText('Country: UK')).toBeOnTheScreen();
    expect(screen.getByText('Marathon: 2:19:58.329')).toBeOnTheScreen();
    expect(screen.getByText('(Deleted): test')).toBeOnTheScreen();
  });

  describe('enter stat, switching to the next stat type', () => {
    test('enter multiple choice stat, switching to text stat with default value', () => {
      renderWithProvider(<AddEditEntry {...getEditEntryProps(3)} />, { preloadedState });
      // Expect already entered time to be on screen
      expect(screen.getByText('Marathon: 2:18:41.371')).toBeOnTheScreen();
      fireEvent.press(screen.getByText('UK')); // select country
      // Expect next stat type to be on screen with its default value
      expect(screen.getByText('Race name')).toBeOnTheScreen();
      expect(screen.getByDisplayValue('Default name')).toBeOnTheScreen();
    });

    test('enter multiple choice stat, switching to number stat with 0 default value', () => {
      renderWithProvider(<AddEditEntry {...getEditEntryProps(4)} />, { preloadedState });
      // Expect already entered time and race name to be on screen
      expect(screen.getByText('Marathon: 2:19:05.942')).toBeOnTheScreen();
      expect(screen.getByText('Race name: Marathon Open 2023')).toBeOnTheScreen();
      fireEvent.press(screen.getByText('Japan')); // select country
      // Expect next stat type to be on screen with its default value
      expect(screen.getByText('Number of competitors')).toBeOnTheScreen();
      expect(screen.getByDisplayValue('0')).toBeOnTheScreen();
    });
  });
});
