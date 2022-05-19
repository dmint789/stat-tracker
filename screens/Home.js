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
  const [entries, setEntries] = useState([]);
  const newEntry = route.params;

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    // Check that we received a valid entry from the AddEditEntry screen
    if (Object.keys(newEntry).length > 0) {
      setEntries(prevEntries => {
        const newEntries = [{...newEntry, id: Math.random()}, ...prevEntries];
        setData(newEntries);
        return newEntries;
      });
    }
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

  const getData = async () => {
    try {
      const data = await AsyncStorage.getItem('data');
      if (data.length > 0) setEntries(JSON.parse(data));
    } catch (err) {
      console.log(err);
    }
  };

  const setData = async data => {
    try {
      await AsyncStorage.setItem('data', JSON.stringify(data));
    } catch (err) {
      console.log(err);
    }
  };

  const deleteData = async () => {
    try {
      await AsyncStorage.removeItem('data');
    } catch (err) {
      console.log(err);
    }
  };

  const deleteEntry = id => {
    setEntries(prevEntries => {
      const newEntries = prevEntries.filter(item => item.id != id);
      setData(newEntries);
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
            <Entry entry={item} deleteEntry={deleteEntry} />
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
