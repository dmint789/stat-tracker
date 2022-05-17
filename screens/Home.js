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
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {TempData} from '../TempData.js';
import Entry from '../components/Entry.js';
import MyButton from '../components/MyButton.js';

const Home = ({navigation, route}) => {
  const [entries, setEntries] = useState(TempData);
  const newEntry = route.params;

  useEffect(() => {
    if (isValidEntry(newEntry))
      setEntries(prevEntries => {
        return [{...newEntry, id: Math.random()}, ...prevEntries];
      });
  }, [newEntry]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <MyButton onPress={() => navigation.navigate('AddEditEntry')}>
          <Icon name="plus" size={24} color="red" />
        </MyButton>
      ),
    });
  }, [navigation]);

  const isValidEntry = entry => {
    if (Object.keys(newEntry).length === 0) return false;

    for (let stat of entry.stats) {
      if (stat.name.length == 0 || stat.value.length == 0) return false;
    }

    return true;
  };

  const deleteEntry = id => {
    setEntries(prevEntries => {
      return prevEntries.filter(entry => entry.id != id);
    });
  };

  const addEntry = entry => {
    if (isValidEntry(entry)) {
      setEntries(prevEntries => {
        return [{...entry, id: Math.random()}, ...prevEntries];
      });
    } else {
      Alert.alert('Error', 'Please fill in all fields', [
        {text: 'Ok', onPress: () => console.log('Alert closed')},
      ]);
    }
  };

  const onOpenAddEntry = () => {
    navigation.navigate('AddEditEntry');
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}>
      {/* Views in React Native are flexbox components by default. */}
      {/* The items inside are automatically flex items. */}
      <View style={styles.container}>
        {/*addEntryOpen && <AddEntry addEntry={addEntry} />*/}
        <View style={styles.list}>
          {/* FlatList is better for performance than ScrollView. It also */}
          {/* automatically assigns the key value to each item. */}
          <FlatList
            numColumns={1}
            keyExtractor={item => item.id}
            data={entries}
            renderItem={({item}) => (
              <Entry entry={item} deleteEntry={deleteEntry} />
            )}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    // This prevents things from going off the screen
    flex: 1,
    marginVertical: 20,
    paddingHorizontal: 20,
  },
});

export default Home;
