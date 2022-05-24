import React, {useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  View,
  ScrollView,
  Modal,
  Keyboard,
  Alert,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import * as SM from '../shared/StorageManager.js';
import WorkingEntryList from '../components/WorkingEntryList.js';
import ChooseStatModal from '../components/ChooseStatModal.js';

const AddEditEntry = ({navigation, route}) => {
  const [stats, setStats] = useState([]);
  const [statTypes, setStatTypes] = useState([]);
  const [statModalOpen, setStatModalOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [textDate, setTextDate] = useState('');
  const [statName, setStatName] = useState('Stat');
  const [statChoice, setStatChoice] = useState(0);
  const [statValue, setStatValue] = useState('');
  const [comment, setComment] = useState('');

  const passedData = route.params;

  useEffect(() => {
    getInitData();

    // If data was passed, that means we're editing an entry.
    // In that case, set all of the data from that entry.
    if (passedData) {
      // Destructure passed data. t stands for temporary.
      const {stats: tStats, comment: tComment, date: tDate} = passedData;

      setStats(tStats);
      setComment(tComment);
      // The month has to be given as an index
      setDate(new Date(tDate.year, tDate.month - 1, tDate.day));

      setDateText(tDate);
    } else {
      // If data wasn't passed, just set the current date in textDate
      setDateText(date);
    }
  }, []);

  const getInitData = async () => {
    // Get stat types if they've been saved, and if so, also get the last stat choice
    const tempStatTypes = await SM.getData('statTypes');
    if (tempStatTypes !== null) {
      setStatTypes(tempStatTypes);

      const tempLastStatChoice = await SM.getData('lastStatChoice');
      if (tempLastStatChoice !== null) {
        setStatChoice(tempLastStatChoice);
        setStatName(tempStatTypes[statChoice].name);
      }
    }
  };

  // Sets day, month, year and text date
  const setDateText = passedDate => {
    // If passedDate has a day property, that means we're editing an entry.
    // In that case simply use the passedDate object as is.
    // If the month is less than 10, add 0 in front of it.
    if (passedDate.day) {
      const prettyMonth =
        passedDate.month < 10 ? '0' + passedDate.month : passedDate.month;
      setTextDate(`${passedDate.day}/${prettyMonth}/${passedDate.year}`);
    }
    // Otherwise, use it as a Date() object
    else {
      // We add 1 to the month, because the Date class sets it with 0 indexing
      const prettyMonth =
        (passedDate.getMonth() + 1 < 10 ? '0' : '') +
        (passedDate.getMonth() + 1).toString();
      setTextDate(
        `${passedDate.getDate()}/${prettyMonth}/${passedDate.getFullYear()}`,
      );
    }
  };

  // Check the validity of the new entry before it's passed to the home screen
  const isValidEntry = entry => {
    if (entry.stats.length === 0) return false;

    for (let stat of entry.stats) {
      if (stat.name.length === 0 || stat.value.length === 0) return false;
    }

    if (entry.date.length === 0) return false;

    return true;
  };

  // Check the validity of the new stat
  const isValidStat = (showAlerts = true) => {
    if (statTypes.length === 0) {
      if (showAlerts)
        Alert.alert('Error', 'Please create a stat type', [{text: 'Ok'}]);
      return false;
    } else if (statValue.length === 0) {
      if (showAlerts)
        Alert.alert('Error', 'Please fill in the stat value', [{text: 'Ok'}]);
      return false;
    } else return true;
  };

  // Add new stat to the list of stats in the current entry
  const addStat = () => {
    if (isValidStat()) {
      setStats(prevStats => {
        return [
          ...prevStats,
          {
            name: statName,
            value: statValue,
          },
        ];
      });

      setStatValue('');
    }
  };

  // Delete a stat from the list
  const deleteStat = id => {
    setStats(prevStats => {
      return prevStats.filter(item => item.id != id);
    });
  };

  // Add new entry
  const onAddEditEntry = () => {
    if (statValue.length > 0) {
      // If no other stats have been entered, automatically add the one in the text input
      if (stats.length === 0) {
        if (isValidStat) {
          addEditEntry(true);
        }
      } else {
        // Ask about saving the last entered stat if other ones have been entered
        Alert.alert(
          'Confirmation',
          'Do you want to add your last stat or discard it?',
          [
            {
              text: 'Discard',
              onPress: () => addEditEntry(),
            },
            {
              text: 'Add',
              onPress: () => {
                if (isValidStat) {
                  addEditEntry(true);
                }
              },
            },
          ],
        );
      }
    } else {
      // If the text input is empty, just add the stats that have been entered
      addEditEntry();
    }
  };

  const addEditEntry = (addLastStat = false) => {
    let tempStats = stats.map(item => ({
      name: item.name,
      value: item.value,
    }));

    // Add the last entered stat if requested. Its validity must already be checked.
    if (addLastStat) {
      tempStats.push({
        name: statName,
        value: statValue,
      });
    }

    // If we're adding a new entry, we pass the id as -1 and let the Home screen set the id.
    // If we're editing an entry, we set the same id that was passed.
    const newEntry = {
      id: passedData ? passedData.id : -1,
      stats: tempStats,
      comment,
      date: {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        text: textDate,
      },
    };

    if (isValidEntry(newEntry)) {
      navigation.navigate('Home', {newEntry, statTypes});
    } else {
      Alert.alert('Error', 'Please fill in all required fields', [
        {text: 'Ok'},
      ]);
    }
  };

  // Set new stat type or change stat choice
  const setNewStatType = (statChoice, newStatType = null) => {
    setStatChoice(statChoice);
    SM.setData('lastStatChoice', statChoice);

    if (newStatType != null) {
      setStatTypes(prevStatTypes => {
        const newStatTypes = [...prevStatTypes, newStatType];
        SM.setData('statTypes', newStatTypes);
        return newStatTypes;
      });

      setStatName(newStatType.name);
    } else {
      setStatName(statTypes[statChoice].name);
    }
  };

  // Delete stat type
  const deleteStatType = name => {
    setStatTypes(prevStatTypes => {
      const newStatTypes = statTypes.filter(item => item.name != name);

      if (newStatTypes.length === 0) {
        setStatName('Stat');
        SM.deleteData('statTypes');
        SM.deleteData('lastStatchoice');
      } else {
        SM.setData('statTypes', newStatTypes);
      }

      return newStatTypes;
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollableArea}>
        {stats.length > 0 && (
          <WorkingEntryList
            stats={stats}
            statTypes={statTypes}
            deleteStat={deleteStat}
          />
        )}
        <View style={styles.name}>
          <Text style={styles.nameText}>{statName}</Text>
          <Button
            onPress={() => setStatModalOpen(true)}
            title={statTypes.length > 0 ? 'Change Stat' : 'Create Stat'}
            color={statTypes.length > 0 ? 'blue' : 'green'}
          />
        </View>
        <ChooseStatModal
          statModalOpen={statModalOpen}
          setStatModalOpen={setStatModalOpen}
          statTypes={statTypes}
          setNewStatType={setNewStatType}
          deleteStatType={deleteStatType}
        />
        <TextInput
          style={styles.input}
          placeholder="Value"
          placeholderTextColor="grey"
          onChangeText={value => setStatValue(value)}
          value={statValue}
        />
        <Button
          onPress={() => addStat()}
          title="Add Stat"
          color={isValidStat(false) ? 'green' : 'grey'}
        />

        {/* Comment */}
        <TextInput
          style={styles.input}
          placeholder="Comment"
          placeholderTextColor="grey"
          onChangeText={value => setComment(value)}
          value={comment}
        />
        {/* Date */}
        <View style={styles.date}>
          <Text style={styles.dateText}>{textDate}</Text>
          <Button
            onPress={() => setDatePickerOpen(true)}
            title="Edit"
            color="blue"
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
            setDateText(date);
          }}
          onCancel={() => {
            setDatePickerOpen(false);
          }}
        />
        {/* Make title conditional (Add Entry or Edit Entry) */}
        <View style={{marginBottom: 20}}>
          <Button
            onPress={() => onAddEditEntry()}
            title={passedData ? 'Edit Entry' : 'Add Entry'}
            color="red"
          />
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
  name: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 14,
    padding: 6,
    borderWidth: 1,
    borderColor: 'grey',
  },
  nameText: {
    color: 'black',
    fontSize: 20,
    marginBottom: 6,
  },
  input: {
    color: 'black',
    fontSize: 20,
    marginBottom: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
