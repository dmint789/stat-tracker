import React from 'react';
import { screen } from '@testing-library/react-native';
import '@testing-library/jest-native';
import AddEditEntry from '../app/screens/AddEditEntry';
import { renderWithProvider } from '../utils/test-utils';

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

test('renders correctly', () => {
  renderWithProvider(<AddEditEntry {...props} />);
  expect(screen.getByText(/Add Entry/)).toBeOnTheScreen();
});
