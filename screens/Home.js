import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {GlobalStyles} from '../shared/GlobalStyles.js';
import * as SM from '../shared/StorageManager.js';
import Entry from '../components/Entry.js';
import MyButton from '../components/MyButton.js';

const Home = ({navigation, route}) => {
  // Use this variable for debugging
  const debug = false;

  const [statCategory, setStatCategory] = useState();
  const [entries, setEntries] = useState([]);
  const [lastId, setLastId] = useState(0);
  const [statTypes, setStatTypes] = useState([]);

  // Passed data should be: {newEntry, statTypes, statCategory}
  const passedData = route.params;

  useEffect(() => {
    getInitData();
  }, []);

  useEffect(() => {
    // Check that we received valid data and if so - save it.
    if (Object.keys(passedData).length > 0) {
      if (passedData.statTypes) {
        // Save new stat types
        setStatTypes(passedData.statTypes);
      }

      // Set header title
      if (passedData.statCategory) {
        setStatCategory(passedData.statCategory);
        navigation.setOptions({title: passedData.statCategory});
      }

      // Save new or edited entry
      if (passedData.newEntry) {
        // If the passed id is -1, that means we're adding an entry. If not - we're editing one.
        if (passedData.newEntry.id === -1) {
          addEntry(passedData.newEntry);

          // Set new last id
          setLastId(prevLastId => {
            SM.setData(statCategory, 'lastId', prevLastId + 1, debug);
            return prevLastId + 1;
          });
        } else {
          editEntry(passedData.newEntry);
        }
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
    const tempEntries = await SM.getData(
      passedData.statCategory,
      'entries',
      debug,
    );
    if (tempEntries !== null) {
      setEntries(tempEntries);

      const tempLastId = await SM.getData(
        passedData.statCategory,
        'lastId',
        debug,
      );
      if (tempLastId !== null) {
        setLastId(tempLastId);
      }
    }

    // Get stat types data (if any)
    const tempStatTypes = await SM.getData(
      passedData.statCategory,
      'statTypes',
      debug,
    );
    if (tempStatTypes !== null) {
      setStatTypes(tempStatTypes);
    }
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

      SM.setData(statCategory, 'entries', newEntries, debug);

      return newEntries;
    });
  };

  const onEditEntry = id => {
    const entry = entries.find(item => item.id === id);

    navigation.navigate('AddEditEntry', {
      statCategory: statCategory,
      entry,
    });
  };

  const editEntry = entry => {
    setEntries(prevEntries => {
      let newEntries = prevEntries;

      // Get the index of the entry that has the same id as the one we're editing
      const index = prevEntries.findIndex(item => item.id === entry.id);
      newEntries[index] = entry;

      SM.setData(statCategory, 'entries', newEntries, debug);

      return newEntries;
    });
  };

  const onDeleteEntry = id => {
    Alert.alert('Confirmation', 'Are you sure you want to delete the entry?', [
      {text: 'Cancel'},
      {
        text: 'Ok',
        onPress: () => deleteEntry(id),
      },
    ]);
  };

  const deleteEntry = id => {
    setEntries(prevEntries => {
      const newEntries = prevEntries.filter(item => item.id !== id);

      if (newEntries.length === 0) {
        SM.deleteData(statCategory, 'entries', debug);
      } else {
        SM.setData(statCategory, 'entries', newEntries, debug);
      }

      return newEntries;
    });
  };

  return (
    <View style={GlobalStyles.container}>
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
              onDelete={onDeleteEntry}
              onEditEntry={onEditEntry}
            />
          )}
          ListFooterComponent={<View style={{height: 20}} />}
        />
      ) : (
        <Text style={GlobalStyles.infoText}>
          Press + to add some stat entries
        </Text>
      )}
    </View>
  );
};

export default Home;
