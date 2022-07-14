import React, {useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  TextInput,
  Button,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {GlobalStyles} from '../shared/GlobalStyles.js';
import * as SM from '../shared/StorageManager.js';
import WorkingEntryList from '../components/WorkingEntryList.js';
import ChooseStatModal from '../components/ChooseStatModal.js';

const AddEditEntry = ({navigation, route}) => {
  // Use this variable for debugging
  const debug = false;

  const [stats, setStats] = useState([]);
  const [statTypes, setStatTypes] = useState([]);
  const [filteredStatTypes, setFilteredStatTypes] = useState([]);
  const [statModalOpen, setStatModalOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [textDate, setTextDate] = useState('');
  const [statName, setStatName] = useState('Stat');
  // Stat choice from the list of filtered stats
  const [statChoice, setStatChoice] = useState(0);
  const [statValue, setStatValue] = useState('');
  const [comment, setComment] = useState('');

  // Passed data should be: {statCategory, entry}
  // statCategory is mandatory. If entry is null, we're adding an entry.
  const passedData = route.params;

  useEffect(() => {
    getInitData();

    // If data was passed, that means we're editing an entry.
    // In that case, set the header title set all of the data from that entry.
    if (passedData.entry) {
      navigation.setOptions({title: 'Edit Entry'});

      // Destructure passed data. t stands for temporary.
      const {stats: tStats, comment: tComment, date: tDate} = passedData.entry;

      setStats(tStats);
      setComment(tComment);
      // The month has to be given with 0 indexing
      setDate(new Date(tDate.year, tDate.month - 1, tDate.day));
      setDateText(tDate);
    } else {
      // If data wasn't passed, just set the header title and the current date in textDate
      navigation.setOptions({title: 'Add Entry'});
      setDateText(date);
    }
  }, []);

  const getInitData = async () => {
    // Get stat types if they've been saved, and if so, also get the last stat choice
    const tempStatTypes = await SM.getData(
      passedData.statCategory,
      'statTypes',
    );

    if (tempStatTypes !== null) {
      setStatTypes(tempStatTypes);

      // Set filteredStatTypes, statName and statChoice. If editing an entry, pass its stats.
      filterStatTypes(
        tempStatTypes,
        passedData.entry ? passedData.entry.stats : [],
      );
    }
  };

  const setDateText = passedDate => {
    // If passedDate has a text property, just use that (means we're editing an entry)
    if (passedDate.text) {
      setTextDate(passedDate.text);
    }
    // Otherwise, use it as a Date() object
    else {
      // We add 1 to the month, because the Date class sets it with 0 indexing
      const prettyMonth =
        (passedDate.getMonth() + 1 < 10 ? '0' : '') +
        (passedDate.getMonth() + 1).toString();
      const prettyDay =
        (passedDate.getDate() < 10 ? '0' : '') +
        passedDate.getDate().toString();

      setTextDate(`${prettyDay}/${prettyMonth}/${passedDate.getFullYear()}`);
    }
  };

  // Check the validity of the new entry before it's passed to the home screen
  const isValidEntry = entry => {
    if (entry.stats.length === 0 && entry.comment.length === 0) {
      Alert.alert('Error', 'Please create a stat or write a comment', [
        {text: 'Ok'},
      ]);
      return false;
    }

    for (let stat of entry.stats) {
      if (stat.name.length === 0 || stat.value.length === 0) {
        Alert.alert(
          'Error',
          'Please make sure all stats have a stat type and a value',
          [{text: 'Ok'}],
        );
        return false;
      }
    }

    return true;
  };

  // Check the validity of the new stat
  const isValidStat = (showAlerts = true) => {
    if (statName === 'Stat') {
      if (showAlerts)
        Alert.alert('Error', 'Please choose a stat type', [{text: 'Ok'}]);
      return false;
    } else if (statValue.length === 0) {
      if (showAlerts)
        Alert.alert('Error', 'Please fill in the stat value', [{text: 'Ok'}]);
      return false;
    } else if (stats.find(item => item.name === statName)) {
      if (showAlerts)
        Alert.alert('Error', 'You cannot have two stats with the same name', [
          {text: 'Ok'},
        ]);
      return false;
    } else return true;
  };

  const statSortingCondition = (a, b) => {
    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
    return 0;
  };

  // Add new stat to the list of stats in the current entry
  const addStat = () => {
    if (isValidStat()) {
      setStats(prevStats => {
        const newStats = [
          ...prevStats,
          {
            name: statName,
            value: statValue,
          },
        ].sort(statSortingCondition);

        // Set filteredStatTypes, statChoice and statName
        filterStatTypes(statTypes, newStats);

        return newStats;
      });

      setStatValue('');
    }
  };

  // Delete a stat from the list or edit it (delete from the list, but put values in the inputs)
  const deleteEditStat = (stat, edit = false) => {
    setStats(prevStats => {
      const newStats = prevStats.filter(item => item.name != stat.name);

      if (edit) {
        setStatValue(stat.value);
        filterStatTypes(statTypes, newStats, stat.name);
      } else {
        filterStatTypes(statTypes, newStats);
      }

      return newStats;
    });
  };

  const addEditEntry = () => {
    if (statValue.length === 0 || isValidStat()) {
      let tempStats = stats;

      // Add the last entered stat if not empty and sort the new list of stats
      if (statValue.length > 0) {
        tempStats.push({
          name: statName,
          value: statValue,
        });
        tempStats.sort(statSortingCondition);
      }

      // When adding a new entry (passedData.entry = null), pass the id as -1 and let the
      // Home screen set the id. When editing an entry, set the same id that was passed.
      const newEntry = {
        id: passedData.entry ? passedData.entry.id : -1,
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
      }
    }
  };

  // Add new stat type or change stat choice. Takes an object.
  const addChangeStatType = statType => {
    // If more than one property was passed in the statType object, that means we're adding a new stat type
    if (Object.keys(statType).length > 1) {
      setStatTypes(prevStatTypes => {
        const newStatTypes = [...prevStatTypes, statType].sort(
          statSortingCondition,
        );

        SM.setData(passedData.statCategory, 'statTypes', newStatTypes);

        // Set filteredStatTypes, statChoice and statName
        filterStatTypes(newStatTypes, stats, statType.name);

        return newStatTypes;
      });
    } else {
      setStatName(statType.name);
      setStatChoice(
        filteredStatTypes.findIndex(item => item.name === statType.name),
      );
    }
  };

  // Delete stat type
  const deleteStatType = name => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete the stat type?',
      [
        {text: 'Cancel'},
        {
          text: 'Ok',
          onPress: () => {
            setStatTypes(() => {
              const newStatTypes = statTypes.filter(item => item.name != name);

              if (newStatTypes.length === 0) {
                SM.deleteData(passedData.statCategory, 'statTypes');
              } else {
                SM.setData(passedData.statCategory, 'statTypes', newStatTypes);
              }

              // This will update filteredStatTypes and statName, and, if statChoice goes
              // beyond the number of filtered stat types, it will decrement stat choice
              filterStatTypes(newStatTypes);

              return newStatTypes;
            });
          },
        },
      ],
    );
  };

  // Filter out stat types that have already been entered and update statChoice and statName
  const filterStatTypes = (
    newStatTypes,
    newStats = stats,
    newStatTypeName = null,
  ) => {
    const newFilteredStatTypes = newStatTypes.filter(
      type => !newStats.find(stat => stat.name === type.name),
    );

    if (newFilteredStatTypes.length > 0) {
      // If stat choice is beyond the number of filtered stat types, decrement it.
      // This can only happen after a deletion.
      if (newFilteredStatTypes.length === statChoice) {
        setStatChoice(prevStatChoice => {
          setStatName(newFilteredStatTypes[prevStatChoice - 1].name);
          return prevStatChoice - 1;
        });
      } else {
        // If newStatType is set, that means we're changing the stat type selection
        if (newStatTypeName) {
          setStatChoice(
            newFilteredStatTypes.findIndex(
              item => item.name === newStatTypeName,
            ),
          );
          setStatName(newStatTypeName);
        } else {
          // Otherwise, just set the new stat name to whatever the stat choice already
          // was using the new filtered list of stat types
          setStatName(newFilteredStatTypes[statChoice].name);
        }
      }
    } else {
      // This can only happen after a deletion, so we can just reset stat name and choice
      setStatName('Stat');
      setStatChoice(0);
    }

    setFilteredStatTypes(newFilteredStatTypes);
  };

  return (
    <View style={GlobalStyles.container}>
      <ScrollView
        keyboardShouldPersistTaps="always"
        style={styles.scrollableArea}>
        {stats.length > 0 && (
          <WorkingEntryList
            stats={stats}
            statTypes={statTypes}
            deleteEditStat={deleteEditStat}
          />
        )}
        <View style={styles.nameView}>
          <Text style={{...GlobalStyles.text, flex: 1}}>{statName}</Text>
          <Button
            onPress={() => setStatModalOpen(true)}
            title={filteredStatTypes.length > 0 ? 'Change Stat' : 'Create Stat'}
            color={filteredStatTypes.length > 0 ? 'blue' : 'green'}
          />
        </View>
        <ChooseStatModal
          modalOpen={statModalOpen}
          setModalOpen={setStatModalOpen}
          statTypes={statTypes}
          filteredStatTypes={filteredStatTypes}
          addChangeStatType={addChangeStatType}
          deleteStatType={deleteStatType}
        />
        <TextInput
          style={GlobalStyles.input}
          placeholder="Value"
          placeholderTextColor="grey"
          value={statValue}
          onChangeText={value => setStatValue(value)}
        />
        <View style={{marginBottom: 10}}>
          <Button
            color={isValidStat(false) ? 'green' : 'grey'}
            title="Add Stat"
            onPress={() => addStat()}
          />
        </View>

        {/* Comment */}
        <TextInput
          style={GlobalStyles.input}
          placeholder="Comment"
          placeholderTextColor="grey"
          value={comment}
          onChangeText={value => setComment(value)}
          multiline
        />
        {/* Date */}
        <View style={styles.date}>
          <Text style={GlobalStyles.text}>{textDate}</Text>
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
          onCancel={() => setDatePickerOpen(false)}
        />
        <View style={{marginBottom: 20}}>
          <Button
            onPress={() => addEditEntry()}
            title={passedData.entry ? 'Edit Entry' : 'Add Entry'}
            color="red"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollableArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  nameView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    padding: 6,
    borderWidth: 1,
    borderColor: 'grey',
  },
  date: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default AddEditEntry;
