import React, {useState} from 'react';
import {Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import MyButton from './components/MyButton.js';

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
        initialRouteName="Home"
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
          name="Home"
          component={Home}
          initialParams={{statCategory: 'Health'}}
        />
        <Stack.Screen name="AddEditEntry" component={AddEditEntry} />
        <Stack.Screen
          name="About"
          component={About}
          options={({route, navigation}) => ({
            title: 'About',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
