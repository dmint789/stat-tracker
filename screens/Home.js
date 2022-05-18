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
  const [entries, setEntries] = useState([]);
  const newEntry = route.params;

  useEffect(() => {
    if (Object.keys(newEntry).length > 0) {
      setEntries(prevEntries => {
        return [{...newEntry, id: Math.random()}, ...prevEntries];
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

  const deleteEntry = id => {
    setEntries(prevEntries => {
      return prevEntries.filter(item => item.id != id);
    });
  };

  const addEntry = entry => {
    setEntries(prevEntries => {
      return [{...entry, id: Math.random()}, ...prevEntries];
    });
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}>
      {/* Views in React Native are flexbox components by default. */}
      {/* The items inside are automatically flex items. */}
      <View style={styles.container}>
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
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    color: 'black',
  },
});

export default Home;
