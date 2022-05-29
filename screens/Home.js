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
import * as SM from '../shared/StorageManager.js';
import Entry from '../components/Entry.js';
import MyButton from '../components/MyButton.js';

const Home = ({navigation, route}) => {
  const [entries, setEntries] = useState([]);
  const [lastId, setLastId] = useState(0);
  const [statTypes, setStatTypes] = useState([]);

  // Passed data should be: {newEntry, statTypes, statCategory}
  // newEntry and statTypes are optional and statCategory is mandatory
  const passedData = route.params;

  useEffect(() => {
    getInitData();
    //SM.deleteData(passedData.statCategory, 'entries');
  }, []);

  useEffect(() => {
    // Check that we received valid data from AddEditEntry and if so - save it.
    if (Object.keys(passedData).length > 0) {
      if (passedData.newEntry) {
        // If the passed id is -1, that means we're adding an entry. If not - we're editing one.
        if (passedData.newEntry.id === -1) {
          addEntry(passedData.newEntry);

          // Set new last id
          setLastId(prevLastId => {
            SM.setData(passedData.statCategory, 'lastId', prevLastId + 1);
            return prevLastId + 1;
          });
        } else {
          editEntry(passedData.newEntry);
        }
      }

      if (passedData.statTypes) {
        // Save new stat types
        setStatTypes(passedData.statTypes);
      }

      // Set header title
      if (passedData.statCategory) {
        navigation.setOptions({title: passedData.statCategory});
      }
    }
  }, [passedData]);

  useEffect(() => {
    // Set the plus button in the header. Pass null to indicate that we're adding an entry.
    navigation.setOptions({
      headerRight: () => (
        <MyButton
          onPress={() =>
            navigation.navigate('AddEditEntry', {
              statCategory: passedData.statCategory,
            })
          }>
          <Icon name="plus" size={24} color="red" />
        </MyButton>
      ),
    });
  }, [navigation]);

  const getInitData = async () => {
    // Get entry data if there is any, and if so, also get last id
    const tempEntries = await SM.getData(passedData.statCategory, 'entries');
    if (tempEntries !== null) {
      setEntries(tempEntries);

      const tempLastId = await SM.getData(passedData.statCategory, 'lastId');
      if (tempLastId !== null) {
        setLastId(tempLastId);
      }
    }

    // Get stat types data (if any)
    const tempStatTypes = await SM.getData(
      passedData.statCategory,
      'statTypes',
    );
    if (tempStatTypes !== null) {
      setStatTypes(tempStatTypes);
    }
  };

  const onEditEntry = id => {
    const entry = entries.find(item => item.id === id);

    navigation.navigate('AddEditEntry', {
      statCategory: passedData.statCategory,
      entry,
    });
  };

  const addEntry = entry => {
    setEntries(prevEntries => {
      const newEntries = [
        {
          id: lastId,
          stats: entry.stats,
          comment: entry.comment,
          date: entry.date,
        },
        ...prevEntries,
      ];

      SM.setData(passedData.statCategory, 'entries', newEntries);

      return newEntries;
    });
  };

  const editEntry = entry => {
    setEntries(prevEntries => {
      let newEntries = prevEntries;

      // Get the index of the entry that has the same id as the one we're editing
      const index = prevEntries.findIndex(item => item.id === entry.id);
      newEntries[index] = entry;

      SM.setData(passedData.statCategory, 'entries', newEntries);

      return newEntries;
    });
  };

  const deleteEntry = id => {
    setEntries(prevEntries => {
      const newEntries = prevEntries.filter(item => item.id != id);

      if (newEntries.length === 0) {
        SM.deleteData(passedData.statCategory, 'entries');
      } else {
        SM.setData(passedData.statCategory, 'entries', newEntries);
      }

      return newEntries;
    });
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
              onEditEntry={onEditEntry}
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
    marginTop: 20,
    textAlign: 'center',
    fontSize: 18,
    color: 'black',
  },
});

export default Home;
