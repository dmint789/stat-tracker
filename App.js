import React, {useState} from 'react';
import {Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import MyButton from './components/MyButton.js';

import Menu from './screens/Menu.js';
import Home from './screens/Home.js';
import AddEditEntry from './screens/AddEditEntry.js';
import About from './screens/About.js';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      {/* screenOptions is the same as options on the */}
      {/* Stack.Screen components, except they are global */}
      <Stack.Navigator
        initialRouteName="Menu"
        screenOptions={{
          headerStyle: {
            backgroundColor: 'red',
            paddingHorizontal: 50,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            color: 'white',
            fontWeight: 'bold',
            fontSize: 24,
          },
          headerTitleAlign: 'center',
        }}>
        <Stack.Screen
          name="Menu"
          component={Menu}
          options={{title: 'Stat Tracker'}}
        />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="AddEditEntry" component={AddEditEntry} />
        <Stack.Screen name="About" component={About} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
