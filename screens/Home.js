import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Entry from '../components/Entry.js';
import AddEntry from '../components/AddEntry.js';
import Header from '../components/Header.js';

const Home = () => {
  const [entries, setEntries] = useState([
    {
      id: '1',
      date: '09.05.2022',
      stats: [
        {name: 'Weight', value: '86.2'},
        {name: 'Pull-ups', value: '1'},
      ],
    },
    {id: '2', date: '08.05.2022', stats: [{name: 'Weight', value: '85.6'}]},
    {
      id: '3',
      date: '07.05.2022',
      stats: [
        {name: 'Weight', value: '85.3'},
        {name: 'Push-ups', value: '20'},
      ],
    },
  ]);
  const [addEntryOpen, setAddEntryOpen] = useState(false);

  const isValidEntry = entry => {
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
        return [{...entry, id: 7}, ...prevEntries];
      });

      setAddEntryOpen(false);
    } else {
      Alert.alert('Error', 'Please fill in all fields', [
        {text: 'Ok', onPress: () => console.log('Alert closed')},
      ]);
    }
  };

  const onOpenAddEntry = () => {
    setAddEntryOpen(prevAddEntryOpen => !prevAddEntryOpen);
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        console.log('Dismissed keyboard');
      }}>
      {/* Views in React Native are flexbox components by default. */}
      {/* The items inside are automatically flex items. */}
      <View style={styles.container}>
        <Header onOpenAddEntry={onOpenAddEntry} />
        {addEntryOpen && <AddEntry addEntry={addEntry} />}
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
