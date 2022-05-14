import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Home from './screens/Home.js';

const App = () => {
  return (
    <NavigationContainer>
      <Home />
    </NavigationContainer>
  );
};

export default App;
