import React from 'react';
import { View, Keyboard } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';

import store from './app/redux/store';
import Menu from './app/screens/Menu';
import Home from './app/screens/Home';
import AddEditEntry from './app/screens/AddEditEntry';
import AddEditStatType from './app/screens/AddEditStatType';
import ImportExport from './app/screens/ImportExport';
import About from './app/screens/About';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <View style={{ flex: 1 }} onStartShouldSetResponder={(): any => Keyboard.dismiss()}>
        <NavigationContainer>
          {/* screenOptions is the same as options on the Stack.Screen components, except they are global */}
          <Stack.Navigator
            initialRouteName="Menu"
            screenOptions={{
              headerStyle: {
                backgroundColor: 'red',
              },
              headerTintColor: 'white',
              headerTitleStyle: {
                color: 'white',
                fontWeight: 'bold',
                fontSize: 24,
              },
              headerTitleAlign: 'center',
            }}
          >
            <Stack.Screen name="Menu" component={Menu} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="AddEditEntry" component={AddEditEntry} />
            <Stack.Screen name="AddEditStatType" component={AddEditStatType} />
            <Stack.Screen name="ImportExport" component={ImportExport} />
            <Stack.Screen name="About" component={About} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </Provider>
  );
};

export default App;