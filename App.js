import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, Alert} from 'react-native';
//import Header from './components/Header.js';

const App = () => {
  const [entries, setEntries] = useState([
    {id: '1', date: '09.05.2022', value: '86.2'},
    {id: '2', date: '08.05.2022', value: '85.6'},
    {id: '3', date: '07.05.2022', value: '85.3'},
    {id: '4', date: '06.05.2022', value: '85.5'},
    {id: '5', date: '05.05.2022', value: '85.9'},
    {id: '6', date: '04.05.2022', value: '86.5'},
  ]);

  return (
    <View style={styles.container}>
      {/* FlatList is better for performance than ScrollView.
         It also automatically assigns the key value to each item. */}
      <FlatList
        numColumns={1}
        keyExtractor={item => item.id}
        data={entries}
        renderItem={({item}) => (
          <View style={styles.item}>
            <Text style={styles.text}>{item.value}</Text>
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  item: {
    backgroundColor: 'pink',
    marginTop: 24,
    marginHorizontal: 10,
    padding: 30,
  },
  text: {
    color: 'black',
    fontSize: 24,
  },
  dateText: {
    color: 'grey',
    fontSize: 16,
  },
});

export default App;
