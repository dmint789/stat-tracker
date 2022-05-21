import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Entry from '../components/Entry.js';
import MyButton from '../components/MyButton.js';

const Home = ({navigation, route}) => {
  const mockData = {
    statTypes: [
      {name: 'Weight', unit: 'kg'},
      {name: 'Pull-ups', unit: ''},
    ],
    entries: [
      {
        id: 1,
        stats: [
          {
            name: 'Weight',
            value: '85',
          },
          {
            name: 'Weight',
            value: '84',
          },
        ],
        date: '20/5/2022',
        comment: 'Hard',
      },
    ],
  };

  const [entries, setEntries] = useState([]);
  const [statTypes, setStatTypes] = useState([]);

  const returnData = route.params;

  useEffect(() => {
    getDataAsync();
  }, []);

  useEffect(() => {
    // Check that we received a valid entry from the AddEditEntry screen and add it
    if (Object.keys(returnData).length > 0) {
      setEntries(prevEntries => {
        const newEntries = sortEntries([
          {...returnData.newEntry, id: Math.random()},
          ...prevEntries,
        ]);

        setEntriesAsync(newEntries);
        return newEntries;
      });

      setStatTypes(returnData.statTypes);
    }
  }, [returnData]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <MyButton onPress={() => navigation.navigate('AddEditEntry')}>
          <Icon name="plus" size={24} color="red" />
        </MyButton>
      ),
    });
  }, [navigation]);

  const getDataAsync = async () => {
    try {
      //await AsyncStorage.removeItem('data');
      const data = await AsyncStorage.getItem('data');

      if (data.length > 0) {
        const parsedData = JSON.parse(data);
        setEntries(parsedData.entries);
        setStatTypes(parsedData.statTypes);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const setEntriesAsync = async entries => {
    try {
      const newData = {
        entries,
        statTypes,
        lastStatChoice: 0,
      };

      try {
        const data = await AsyncStorage.getItem('data');
        const parsedData = JSON.parse(data);

        newData.statTypes = parsedData.statTypes;
        newData.lastStatChoice = parsedData.lastStatChoice;
      } catch (err) {
        console.log(err);
      }

      await AsyncStorage.setItem('data', JSON.stringify(newData));
    } catch (err) {
      console.log(err);
    }
  };

  const deleteEntry = id => {
    setEntries(prevEntries => {
      const newEntries = prevEntries.filter(item => item.id != id);
      setEntriesAsync(newEntries);
      return newEntries;
    });
  };

  const sortEntries = entries => {
    return entries;
  };

  return (
    <View style={styles.container}>
      {/* Views in React Native are flexbox components by default. */}
      {/* The items inside are automatically flex items. */}

      {/* FlatList is better for performance than ScrollView. It also */}
      {/* automatically assigns the key value to each item. */}
      {entries.length > 0 ? (
        <FlatList
          numColumns={1}
          keyExtractor={item => item.id}
          data={entries}
          renderItem={({item}) => (
            <Entry
              entry={item}
              statTypes={statTypes}
              deleteEntry={deleteEntry}
            />
          )}
          ListFooterComponent={<View style={{height: 20}} />}
        />
      ) : (
        <Text style={styles.text}>Press + to add some stat entries</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    //marginHorizontal: 20,
    marginTop: 20,
    textAlign: 'center',
    fontSize: 18,
    color: 'black',
  },
});

export default Home;
