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
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-date-picker';
import WorkingEntryList from '../components/WorkingEntryList.js';
import ChooseStatModal from '../components/ChooseStatModal.js';

const AddEditEntry = ({navigation, route}) => {
  const [stats, setStats] = useState([]);
  const [date, setDate] = useState(new Date());
  const [statModalOpen, setStatModalOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [statTypes, setStatTypes] = useState([]);

  const [statName, setStatName] = useState('Stat');
  const [statChoice, setStatChoice] = useState(0);
  const [statValue, setStatValue] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    getStatTypesAsync();
  }, []);

  const setStatTypesAsync = async (statTypes, lastStatChoice) => {
    try {
      let entries = [];

      try {
        const data = await AsyncStorage.getItem('data');
        entries = JSON.parse(data).entries;
      } catch (err) {
        console.log(err);
      }

      const newData = {
        statTypes,
        lastStatChoice,
        entries,
      };

      await AsyncStorage.setItem('data', JSON.stringify(newData));
    } catch (err) {
      console.log(err);
    }
  };

  const getStatTypesAsync = async () => {
    try {
      const data = await AsyncStorage.getItem('data');

      if (data.length > 0) {
        const parsedData = JSON.parse(data);
        setStatTypes(parsedData.statTypes);
        setStatChoice(parsedData.lastStatChoice);

        if (parsedData.statTypes.length > 0) {
          setStatName(parsedData.statTypes[parsedData.lastStatChoice].name);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteStatTypeAsync = async name => {
    try {
      let entries = [];

      try {
        const data = await AsyncStorage.getItem('data');
        entries = JSON.parse(data).entries;
      } catch (err) {
        console.log(err);
      }

      const newStatTypes = statTypes.filter(item => item.name != name);
      const newData = {
        entries,
        statTypes: newStatTypes,
      };

      await AsyncStorage.setItem('data', JSON.stringify(newData));
      setStatTypes(newStatTypes);

      if (newStatTypes.length === 0) setStatName('Stat');
    } catch (err) {
      console.log(err);
    }
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
    if (statTypes.length === 0) {
      Alert.alert('Error', 'Please create a stat type', [{text: 'Ok'}]);
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
          {
            name: statTypes[statChoice].name,
            value: statValue,
            id: Math.random(),
          },
        ];
      });
      setStatValue('');
    }
  };

  const deleteStat = id => {
    setStats(prevStats => {
      return prevStats.filter(item => item.id != id);
    });
  };

  const addEntry = () => {
    // Save last entered stat
    if (statValue.length > 0) {
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
        stats: stats.map(item => ({
          name: item.name,
          value: item.value,
        })),
        comment,
        date: formatDate(),
      };

      if (isValidEntry(newEntry)) {
        navigation.navigate('Home', {newEntry, statTypes});
      } else {
        Alert.alert('Error', 'Please fill in all required fields', [
          {text: 'Ok'},
        ]);
      }
    }
  };

  const setNewStat = (statChoice, newStatType = null) => {
    setStatChoice(statChoice);

    if (newStatType != null) {
      setStatTypes(prevStatTypes => {
        const newStatTypes = [...prevStatTypes, newStatType];
        setStatTypesAsync(newStatTypes, statChoice);
        return newStatTypes;
      });

      setStatName(newStatType.name);
    } else {
      setStatTypesAsync(statTypes, statChoice);

      setStatName(statTypes[statChoice].name);
    }
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
          setNewStat={setNewStat}
          deleteStatType={deleteStatTypeAsync}
        />
        <TextInput
          style={styles.input}
          placeholder="Value"
          placeholderTextColor="grey"
          onChangeText={value => setStatValue(value)}
          value={statValue}
        />
        <View style={styles.statButtons}>
          <Button onPress={() => addStat()} title="Add Stat" color="gray" />
        </View>

        {/* Comment */}
        <TextInput
          style={styles.input}
          placeholder="Comment"
          placeholderTextColor="grey"
          onChangeText={value => setComment(value)}
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
