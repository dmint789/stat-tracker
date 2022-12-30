import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, TextInput, Button, View, ScrollView, Alert } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { addEntry, editEntry } from '../redux/mainSlice';
import GS from '../shared/GlobalStyles';
import { formatDate } from '../shared/GlobalFunctions';
import { IEntry, IStatType, IStat, StatTypeVariant, IMultiValueStat } from '../shared/DataStructure';

import WorkingEntryList from '../components/WorkingEntryList';
import StatTypeModal from '../components/StatTypeModal';

const AddEditEntry = ({ navigation, route }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { statCategory, statTypes } = useSelector((state: RootState) => state.main);

  // Used when editing an entry (note: ids start from 1, so this can only be falsy when set to null)
  const [prevEntryId, setPrevEntryId] = useState<number>(null);
  const [stats, setStats] = useState<IStat[]>([]);
  const [filteredStatTypes, setFilteredStatTypes] = useState<IStatType[]>([]);
  // Stat choice from the list of filtered stat types
  const [selectedStatType, setSelectedStatType] = useState<IStatType>(statTypes[0] || null);
  // The type here is different from the type of values in IStat
  const [statValues, setStatValues] = useState<Array<string | number>>(['']);
  const [comment, setComment] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const [textDate, setTextDate] = useState<string>('');
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [statModalOpen, setStatModalOpen] = useState(false);

  const passedData: {
    entry?: IEntry; // if null, we're adding a new entry
    statType?: IStatType; // if set, we're adding or editing a stat type
  } = route.params;

  useEffect(() => {
    // If an entry was passed, that means we're editing an entry.
    // In that case, set the header title and set all of the data from that entry.
    if (passedData?.entry) {
      navigation.setOptions({ title: 'Edit Entry' });

      const { entry } = passedData;

      setPrevEntryId(entry.id);
      setStats(entry.stats);
      setComment(entry.comment);
      // The month has to be given with 0 indexing
      setDate(new Date(entry.date.year, entry.date.month - 1, entry.date.day));
      setTextDate(entry.date.text);
    } else {
      navigation.setOptions({ title: 'Add Entry' });
      setTextDate(formatDate(date));
    }

    if (passedData?.statType) {
      setSelectedStatType(passedData.statType);
    }
  }, [passedData]);

  useEffect(() => {
    filterStatTypes();
  }, [statTypes, stats]);

  // Check the validity of the new entry before it's passed to the home screen
  const isValidEntry = (entry: IEntry): boolean => {
    if (entry.stats.length === 0 && entry.comment.length === 0) {
      Alert.alert('Error', 'Please create a stat or write a comment', [{ text: 'Ok' }]);
      return false;
    }
    for (let stat of entry.stats) {
      if (!statTypes.find((el) => el.id === stat.type)) {
        Alert.alert('Error', 'Please make sure all stats have a stat type', [{ text: 'Ok' }]);
        return false;
      }
    }
    return true;
  };

  // Check the validity of the new stat
  const isValidStat = (showAlerts = true): boolean => {
    if (!selectedStatType) {
      if (showAlerts) Alert.alert('Error', 'Please choose a stat type', [{ text: 'Ok' }]);
      return false;
    } else if (!statValues.find((el) => el !== '')) {
      if (showAlerts) Alert.alert('Error', 'Please enter a stat value', [{ text: 'Ok' }]);
      return false;
    } else if (
      selectedStatType.variant === StatTypeVariant.NUMBER &&
      statValues.find((el: string | number) => isNaN(Number(el))) !== undefined
    ) {
      if (showAlerts) {
        const error = selectedStatType.multipleValues
          ? 'All values must be numeric for this stat type'
          : 'The value must be numeric for this stat type';
        Alert.alert('Error', error, [{ text: 'Ok' }]);
      }
      return false;
    } else return true;
  };

  const updateStatValues = (index: number, value: string) => {
    setStatValues((prevStatValues) => {
      const newStatValues = prevStatValues.map((prevValue: string | number, i) =>
        i === index ? value : prevValue,
      );

      // Add extra value input, if no empty ones are left and the stat type allows multiple values
      if (selectedStatType?.multipleValues && newStatValues.findIndex((val) => val === '') === -1) {
        newStatValues.push('');
      }

      return newStatValues;
    });
  };

  // Assumes the new stat is valid
  const getNewStats = (prevStats = stats): IStat[] => {
    let formatted;
    const mvs = {} as IMultiValueStat;

    if (selectedStatType.variant === StatTypeVariant.NUMBER) {
      formatted = statValues.filter((val) => val !== '').map((val) => Number(val)) as number[];

      if (selectedStatType.multipleValues) {
        mvs.sum = formatted.reduce((acc, val) => acc + val, 0);
        mvs.best = selectedStatType.higherIsBetter ? Math.max(...formatted) : Math.min(...formatted);
        mvs.avg = Math.round((mvs.sum / formatted.length + Number.EPSILON) * 100) / 100;
      }
    } else {
      formatted = statValues.filter((val) => val !== '').map((val) => String(val)) as string[];
    }

    const newStat: IStat = {
      id: selectedStatType.id,
      type: selectedStatType.id,
      values: formatted,
    };
    if (Object.keys(mvs).length > 0) newStat.multiValueStats = mvs;

    return [...prevStats, newStat].sort(
      (a, b) =>
        statTypes.find((el) => el.id === a.type).order - statTypes.find((el) => el.id === b.type).order,
    );
  };

  // Add new stat to the list of stats in the current entry
  const addStat = () => {
    if (isValidStat()) {
      setStats((prevStats: IStat[]) => getNewStats(prevStats));
      setStatValues(['']);
    }
  };

  // Delete a stat from the list or edit it (delete from the list, but put values in the inputs)
  const deleteEditStat = (stat: IStat, edit = false) => {
    setStats((prevStats: IStat[]) => prevStats.filter((el) => el.id !== stat.id));

    if (edit) {
      const newValues = statTypes.find((el) => el.id === stat.type)?.multipleValues
        ? [...stat.values, '']
        : stat.values;
      setStatValues(newValues);
      selectStatType(stat.type);
    }
  };

  const addEditEntry = () => {
    const unenteredStatExists = statValues.find((el) => el !== '');

    if (!unenteredStatExists || isValidStat()) {
      const entry: IEntry = {
        id: prevEntryId ? prevEntryId : statCategory.lastEntryId + 1,
        stats: unenteredStatExists ? getNewStats() : stats, // add last entered stat if needed
        comment,
        date: {
          day: date.getDate(),
          month: date.getMonth() + 1,
          year: date.getFullYear(),
          text: textDate,
        },
      };

      if (isValidEntry(entry)) {
        if (prevEntryId) {
          dispatch(editEntry(entry));
        } else {
          dispatch(addEntry(entry));
        }

        navigation.goBack();
      }
    }
  };

  const selectStatType = (id: number) => {
    setSelectedStatType(statTypes.find((el) => el.id === id) || null);
  };

  const onAddStatType = () => {
    setStatModalOpen(false);
    navigation.navigate('AddEditStatType');
  };

  const onEditStatType = (statType: IStatType) => {
    setStatModalOpen(false);
    navigation.navigate('AddEditStatType', { statType });
  };

  // Filter out stat types that have already been entered and update statChoice if needed
  const filterStatTypes = () => {
    const newFilteredStatTypes = statTypes.filter((type) => !stats.find((stat) => stat.type === type.id));

    if (newFilteredStatTypes.length === 0) {
      setSelectedStatType(null);
    }
    // If the selected stat type is not in the filtered list - update it
    else if (selectedStatType && !newFilteredStatTypes.find((el) => el.id === selectedStatType.id)) {
      let newSelection = null;

      for (let i of statTypes) {
        if (i.order >= selectedStatType.order && newFilteredStatTypes.find((el) => el.id === i.id)) {
          newSelection = i;
          break;
        }
      }
      if (newSelection === null) {
        newSelection = newFilteredStatTypes[0];
      }
      setSelectedStatType(newSelection);
    }

    setFilteredStatTypes(newFilteredStatTypes);
  };

  return (
    <View style={GS.container}>
      <ScrollView keyboardShouldPersistTaps="always" style={GS.scrollableArea}>
        {stats.length > 0 && <WorkingEntryList stats={stats} deleteEditStat={deleteEditStat} />}
        <StatTypeModal
          modalOpen={statModalOpen}
          setStatModalOpen={setStatModalOpen}
          filteredStatTypes={filteredStatTypes}
          selectStatType={selectStatType}
          onAddStatType={onAddStatType}
          onEditStatType={onEditStatType}
        />

        {/* Stat */}
        <View style={styles.nameView}>
          {selectedStatType ? (
            <Text style={{ ...GS.text, flex: 1 }}>
              {selectedStatType.name}
              {selectedStatType.unit ? ` (${selectedStatType.unit})` : ''}
            </Text>
          ) : (
            <Text style={{ ...GS.text, flex: 1 }}>Stat</Text>
          )}
          {filteredStatTypes.length === 0 ? (
            <Button onPress={onAddStatType} title="Create Stat" color="green" />
          ) : (
            <Button onPress={() => setStatModalOpen(true)} title="Change Stat" color="blue" />
          )}
        </View>
        {statValues.map((value: string | number, index: number) => (
          <TextInput
            key={String(index)}
            style={GS.input}
            placeholder="Value"
            placeholderTextColor="grey"
            multiline
            keyboardType={selectedStatType?.variant === StatTypeVariant.NUMBER ? 'numeric' : 'default'}
            value={String(value)}
            onChangeText={(val: string) => updateStatValues(index, val)}
          />
        ))}
        <View style={{ marginBottom: 10 }}>
          <Button color={isValidStat(false) ? 'green' : 'grey'} title="Add Stat" onPress={addStat} />
        </View>

        {/* Comment */}
        <TextInput
          style={GS.input}
          placeholder="Comment"
          placeholderTextColor="grey"
          multiline
          value={comment}
          onChangeText={(value) => setComment(value)}
        />
        {/* Date */}
        <View style={styles.date}>
          <Text style={GS.text}>{textDate}</Text>
          <Button onPress={() => setDatePickerOpen(true)} title="Edit" color="blue" />
        </View>
        <DatePicker
          modal
          mode="date"
          open={datePickerOpen}
          date={date}
          onConfirm={(date) => {
            setDatePickerOpen(false);
            setDate(date);
            setTextDate(formatDate(date));
          }}
          onCancel={() => setDatePickerOpen(false)}
        />
        <View style={{ marginBottom: 20 }}>
          <Button
            onPress={addEditEntry}
            title={prevEntryId ? 'Edit Entry' : 'Add Entry'}
            color={prevEntryId ? 'blue' : 'red'}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  nameView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 14,
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
