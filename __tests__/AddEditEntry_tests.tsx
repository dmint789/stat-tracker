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

const enterTimeDigits = (keys: string, inputIndex = 0) => {
  for (let key of keys) {
    fireEvent(
      screen.getAllByPlaceholderText('(time placeholder for automated tests)')[inputIndex],
      'onKeyPress',
      {
        nativeEvent: { key },
      },
    );
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

    test('enter number stat, switching to multi-number stat', () => {
      renderWithProvider(<AddEditEntry {...emptyProps} />, { preloadedState });
      expect(screen.getByText('Marathon')).toBeOnTheScreen();
      // Delete all stats entered by default (the character in quotes is the Fontawesome X icon)
      fireEvent.press(screen.getAllByText('')[0]);
      fireEvent.press(screen.getAllByText('')[0]);
      fireEvent.press(screen.getAllByText('')[0]);
      expect(screen.getByText('Marathon')).toBeOnTheScreen();

      fireEvent.press(screen.getByText('Change Stat'));
      fireEvent.press(screen.getByText('Number of competitors'));
      fireEvent.press(screen.getByText('Add Stat'));
      expect(screen.getByText('Scores (pts)')).toBeOnTheScreen();
    });

    test('enter multi-time stat, switching to multi-text stat', () => {
      renderWithProvider(<AddEditEntry {...emptyProps} />, { preloadedState });
      expect(screen.getByText('Marathon')).toBeOnTheScreen();
      fireEvent.press(screen.getByText('Change Stat'));
      fireEvent.press(screen.getByText('Time splits'));

      enterTimeDigits('1224391', 0);
      expect(screen.getByDisplayValue('1:22:43.91')).toBeOnTheScreen();
      expect(screen.getAllByPlaceholderText('(time placeholder for automated tests)').length).toBe(2);
      enterTimeDigits('321944', 1);
      expect(screen.getByDisplayValue('0:32:19.44')).toBeOnTheScreen();
      expect(screen.getAllByPlaceholderText('(time placeholder for automated tests)').length).toBe(3);
      fireEvent.press(screen.getByText('Add Stat'));

      expect(screen.getByText('Checkpoints')).toBeOnTheScreen();
      expect(screen.getAllByPlaceholderText('Value').length).toBe(1);
    });
  });

  describe('change stat type while value inputs are not empty', () => {
    // Okay, sure, multiple choice doesn't have value inputs, but it's still going in this group
    test('from multiple choice to time', () => {
      renderWithProvider(<AddEditEntry {...emptyProps} />, { preloadedState });
      // Edit Country stat
      fireEvent.press(screen.getByText('Country: UK'));
      expect(screen.getByText('Country')).toBeOnTheScreen();
      // Change stat to Marathon
      fireEvent.press(screen.getByText('Change Stat'));
      fireEvent.press(screen.getByText('Marathon'));
      expect(screen.getByText('Marathon')).toBeOnTheScreen();
      expect(screen.getByDisplayValue('0:00:00.000')).toBeOnTheScreen();
    });

    test('from multiple choice to multi-time', () => {
      renderWithProvider(<AddEditEntry {...emptyProps} />, { preloadedState });
      // Edit Country stat
      fireEvent.press(screen.getByText('Country: UK'));
      fireEvent.press(screen.getByText('Change Stat'));
      fireEvent.press(screen.getByText('Time splits'));
      expect(screen.getByText('Time splits')).toBeOnTheScreen();
      expect(screen.getByDisplayValue('0:00:00.00')).toBeOnTheScreen();
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

    test('enter number stat, switching to multiple choice stat', () => {
      renderWithProvider(<AddEditEntry {...getEditEntryProps(6)} />, { preloadedState });
      expect(screen.getByText('Country')).toBeOnTheScreen();
      fireEvent.press(screen.getByText('Change Stat'));
      fireEvent.press(screen.getByText('Number of competitors'));
      expect(screen.getByDisplayValue('0')).toBeOnTheScreen(); // expect default value
      fireEvent.press(screen.getByText('Add Stat'));
      // Expect multiple choice stat type
      expect(screen.getByText('Country')).toBeOnTheScreen();
      expect(screen.getByText('Russia')).toBeOnTheScreen();
    });

    test('enter number stat, switching to text stat', () => {
      renderWithProvider(<AddEditEntry {...getEditEntryProps(5)} />, { preloadedState });
      expect(screen.getByText('Race name')).toBeOnTheScreen();
      // Empty value before changing stat type
      fireEvent.changeText(screen.getByPlaceholderText('Value'), '');
      fireEvent.press(screen.getByText('Change Stat'));
      fireEvent.press(screen.getByText('Number of competitors'));
      expect(screen.getByDisplayValue('0')).toBeOnTheScreen(); // expect default value
      fireEvent.changeText(screen.getByPlaceholderText('Value'), '38'); // enter other value
      fireEvent.press(screen.getByText('Add Stat'));
      // Expect multiple choice stat type
      expect(screen.getByText('Race name')).toBeOnTheScreen();
      expect(screen.getByDisplayValue('Default name')).toBeOnTheScreen();
    });

    test('enter multi-time stat, switching to number stat', () => {
      renderWithProvider(<AddEditEntry {...getEditEntryProps(7)} />, { preloadedState });
      // Make sure multi-number stat is displayed correctly (unrelated to the aim of this test)
      expect(screen.getByText('Scores: 10 pts, 10 pts, 10 pts')).toBeOnTheScreen();

      expect(screen.getByText('Stat')).toBeOnTheScreen();
      fireEvent.press(screen.getAllByText('')[5]); // delete Time splits stat
      fireEvent.press(screen.getAllByText('')[3]); // delete Number of competitors stat
      expect(screen.getByText('Time splits')).toBeOnTheScreen();
      expect(screen.getAllByPlaceholderText('(time placeholder for automated tests)').length).toBe(1);
      enterTimeDigits('2203178');
      expect(screen.getByDisplayValue('2:20:31.78')).toBeOnTheScreen();
      expect(screen.getAllByPlaceholderText('(time placeholder for automated tests)').length).toBe(2);
      fireEvent.press(screen.getByText('Add Stat'));

      expect(screen.getByText('Number of competitors')).toBeOnTheScreen();
      expect(screen.getAllByPlaceholderText('Value').length).toBe(1);
    });

    test('enter multi-time stat, switching to multiple choice stat', () => {
      renderWithProvider(<AddEditEntry {...getEditEntryProps(7)} />, { preloadedState });

      fireEvent.press(screen.getAllByText('')[5]); // delete Time splits stat
      fireEvent.press(screen.getAllByText('')[0]); // delete Country stat
      expect(screen.getByText('Time splits')).toBeOnTheScreen();
      expect(screen.getAllByPlaceholderText('(time placeholder for automated tests)').length).toBe(1);
      enterTimeDigits('2203178');
      expect(screen.getByDisplayValue('2:20:31.78')).toBeOnTheScreen();
      fireEvent.press(screen.getByText('Add Stat'));
      expect(screen.getByText('Time splits: 2:20:31.78')).toBeOnTheScreen();

      expect(screen.getByText('Country')).toBeOnTheScreen();
      expect(screen.getByText('USA')).toBeOnTheScreen();
      // Expect default country to be highlighted
      expect(screen.getByText('UK').parent.parent.props.style.backgroundColor).toBe('red');
    });

    test('enter last stat, not switching to another one', () => {
      renderWithProvider(<AddEditEntry {...getEditEntryProps(7)} />, { preloadedState });

      fireEvent.press(screen.getAllByText('')[5]); // delete Time splits stat
      enterTimeDigits('2203178');
      fireEvent.press(screen.getByText('Add Stat'));
      expect(screen.getByText('Stat')).toBeOnTheScreen();
    });
  });
});
