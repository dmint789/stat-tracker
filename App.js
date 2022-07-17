import React from 'react';
import {View, Keyboard} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Menu from './screens/Menu';
import Home from './screens/Home';
import AddEditEntry from './screens/AddEditEntry';
import ImportExport from './screens/ImportExport';
import About from './screens/About';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <View
      style={{flex: 1}}
      onStartShouldSetResponder={() => Keyboard.dismiss()}>
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
          <Stack.Screen name="Menu" component={Menu} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="AddEditEntry" component={AddEditEntry} />
          <Stack.Screen name="ImportExport" component={ImportExport} />
          <Stack.Screen name="About" component={About} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default App;
