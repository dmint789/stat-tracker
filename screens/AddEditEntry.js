import React, {useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import WorkingEntryList from '../components/WorkingEntryList.js';

const AddEditEntry = ({navigation}) => {
  const [stats, setStats] = useState([]);
  const [date, setDate] = useState(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const [statName, setStatName] = useState('');
  const [statValue, setStatValue] = useState('');
  const [comment, setComment] = useState('');

  const onChangeStatName = value => {
    setStatName(value);
  };

  const onChangeStatValue = value => {
    setStatValue(value);
  };

  const onChangeDate = value => {
    setDate(value);
  };

  const onChangeComment = value => {
    setComment(value);
  };

  const formatDate = () => {
    return (
      date.getDate() +
      '/' +
      (date.getMonth() + 1) +
      '/' +
      date.getFullYear()
    ).toString();
  };

  const isValidEntry = entry => {
    if (entry.stats.length === 0) return false;

    for (let stat of entry.stats) {
      if (stat.name.length === 0 || stat.value.length === 0) return false;
    }

    if (entry.date.length === 0) return false;

    return true;
  };

  const isValidStat = () => {
    if (statName.length === 0) {
      Alert.alert('Error', 'Please fill in the stat name', [{text: 'Ok'}]);
      return false;
    } else if (statValue.length === 0) {
      Alert.alert('Error', 'Please fill in the stat value', [{text: 'Ok'}]);
      return false;
    } else return true;
  };

  const addStat = () => {
    if (isValidStat()) {
      setStats(prevStats => {
        return [
          ...prevStats,
          {name: statName, value: statValue, id: Math.random()},
        ];
      });
      setStatName('');
      setStatValue('');
    }
  };

  const deleteStat = id => {
    setStats(prevStats => {
      return prevStats.filter(item => item.id != id);
    });
  };

  const addField = () => {
    console.log('Added field');
  };

  const addEntry = () => {
    // Save last entered stat
    if (statName.length > 0 || statValue.length > 0) {
      Alert.alert(
        'Confirmation',
        'Do you want to add your last stat or discard it?',
        [
          {
            text: 'Discard',
            onPress: () => addEntry(),
          },
          {
            text: 'Add',
            onPress: () => addStat(),
          },
        ],
      );
    } else {
      const newEntry = {
        stats: stats.map(item => ({name: item.name, value: item.value})),
        comment,
        date: formatDate(),
      };

      if (isValidEntry(newEntry)) {
        navigation.navigate('Home', newEntry);
      } else {
        Alert.alert('Error', 'Please fill in all required fields', [
          {text: 'Ok'},
        ]);
      }
    }
  };

  // <TouchableWithoutFeedback
  //   onPress={() => {
  //     Keyboard.dismiss();
  //   }}>
  // </TouchableWithoutFeedback>

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollableArea}>
        {stats.length > 0 && (
          <WorkingEntryList stats={stats} deleteStat={deleteStat} />
        )}
        <TextInput
          style={styles.input}
          placeholder="Name"
          onChangeText={onChangeStatName}
          value={statName}
        />
        <TextInput
          style={styles.input}
          placeholder="Value"
          onChangeText={onChangeStatValue}
          value={statValue}
        />
        <View style={styles.statButtons}>
          {/* <Button onPress={() => addField()} title="Add Field" color="blue" /> */}
          <Button onPress={() => addStat()} title="Add Stat" color="grey" />
        </View>

        {/* Comment */}
        <TextInput
          style={styles.input}
          placeholder="Comment"
          onChangeText={onChangeComment}
        />
        {/* Date */}
        <View style={styles.date}>
          <Text style={styles.dateText}>{formatDate()}</Text>
          <Button
            onPress={() => setDatePickerOpen(true)}
            title="Edit"
            color="grey"
          />
        </View>
        <DatePicker
          modal
          mode="date"
          open={datePickerOpen}
          date={date}
          onConfirm={date => {
            setDatePickerOpen(false);
            setDate(date);
          }}
          onCancel={() => {
            setDatePickerOpen(false);
          }}
        />
        {/* Make title conditional (Add Entry or Edit Entry) */}
        <View style={{marginBottom: 20}}>
          <Button onPress={() => addEntry()} title="Add Entry" color="red" />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollableArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  input: {
    fontSize: 18,
    marginBottom: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  statButtons: {
    //flexDirection: 'row',
    //justifyContent: 'center',
    //alignItems: 'center',
    marginBottom: 20,
  },
  date: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateText: {
    color: 'black',
    fontSize: 18,
  },
});

export default AddEditEntry;
