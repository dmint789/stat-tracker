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
  const [statTypes, setStatTypes] = useState([]);

  const passedData = route.params;

  useEffect(() => {
    getInitData();
  }, []);

  useEffect(() => {
    // Check that we received valid data from AddEditEntry and if so - save it
    if (Object.keys(passedData).length > 0) {
      setEntries(prevEntries => {
        const newEntries = sortEntries([
          {...passedData.newEntry, id: Math.random()},
          ...prevEntries,
        ]);

        SM.setData('entries', newEntries);
        return newEntries;
      });

      setStatTypes(passedData.statTypes);
    }
  }, [passedData]);

  useEffect(() => {
    // Set the plus button in the header
    navigation.setOptions({
      headerRight: () => (
        <MyButton onPress={() => navigation.navigate('AddEditEntry')}>
          <Icon name="plus" size={24} color="red" />
        </MyButton>
      ),
    });
  }, [navigation]);

  const getInitData = async () => {
    // Get entry data (if any)
    const tempEntries = await SM.getData('entries');
    if (tempEntries !== null) {
      setEntries(tempEntries);
    }

    // Get stat types data (if any)
    const tempStatTypes = await SM.getData('statTypes');
    if (tempStatTypes !== null) {
      setStatTypes(tempStatTypes);
    }
  };

  const deleteEntry = id => {
    setEntries(prevEntries => {
      const newEntries = prevEntries.filter(item => item.id != id);

      if (newEntries.length === 0) {
        SM.deleteData('entries');
      } else {
        SM.setData('entries', newEntries);
      }

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
    marginTop: 20,
    textAlign: 'center',
    fontSize: 18,
    color: 'black',
  },
});

export default Home;
