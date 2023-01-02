import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, TextInput, Button, View, ScrollView, Alert } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { addEntry, editEntry } from '../redux/mainSlice';
import GS, { xxsGap, mdGap } from '../shared/GlobalStyles';
import { formatDate } from '../shared/GlobalFunctions';
import {
  IEntry,
  IStatType,
  IStat,
  StatTypeVariant,
  IMultiValueStat,
  ISelectOption,
} from '../shared/DataStructure';

import Gap from '../components/Gap';
import MultiValueInput from '../components/MultiValueInput';
import Select from '../components/Select';
import StatTypeModal from '../components/StatTypeModal';
import WorkingEntryList from '../components/WorkingEntryList';

const AddEditEntry = ({ navigation, route }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { statCategory, statTypes } = useSelector((state: RootState) => state.main);

  // Used when editing an entry (note: ids start from 1, so this can only be falsy when set to null)
  const [prevEntryId, setPrevEntryId] = useState<number>(null);
  const [stats, setStats] = useState<IStat[]>([]);
  const [filteredStatTypes, setFilteredStatTypes] = useState<IStatType[]>([]);
  // Stat choice from the list of filtered stat types
  const [selectedStatType, setSelectedStatType] = useState<IStatType>(statTypes[0] || null);
  const [statValues, setStatValues] = useState<string[]>(['']);
  // Multiple choice stat type only
  const [comment, setComment] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [statModalOpen, setStatModalOpen] = useState(false);

  const passedData: {
    entry?: IEntry; // if null we're adding a new entry, if set we're editing an entry
    statType?: IStatType; // if set, we're adding or editing a stat type
  } = route.params;

  useEffect(() => {
    if (passedData?.entry || prevEntryId) {
      navigation.setOptions({ title: 'Edit Entry' });
    } else {
      navigation.setOptions({ title: 'Add Entry' });

      // Set stats with default values if coming from home screen
      if (!passedData?.statType) {
        statTypes.forEach((statType) => {
          if (statType.defaultValue) {
            addStatWithDefault(statType);
          }
        });
      }
    }

    if (passedData?.entry) {
      const { entry } = passedData;

      setPrevEntryId(entry.id);
      setStats(entry.stats);
      setComment(entry.comment);
      // The month has to be given with 0 indexing
      if (entry.date) {
        setDate(new Date(entry.date.year, entry.date.month - 1, entry.date.day));
      } else {
        setDate(null);
      }
    } else if (passedData?.statType) {
      if (passedData.statType.defaultValue && !statValues.find((el) => el !== '')) {
        addStatWithDefault(passedData.statType);
      } else {
        setSelectedStatType(passedData.statType);
      }
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
    } else if (
      !selectedStatType.multipleValues &&
      (statValues as string[]).filter((el) => el !== '').length > 1
    ) {
      if (showAlerts)
        Alert.alert(
          'Error',
          'This stat type does not allow multiple values. Please select a different stat type or enter just one value.',
          [{ text: 'Ok' }],
        );
      return false;
    } else if (!(statValues as string[]).find((el) => el !== '')) {
      if (showAlerts) Alert.alert('Error', 'Please enter a stat value', [{ text: 'Ok' }]);
      return false;
    } else if (
      selectedStatType.variant === StatTypeVariant.NUMBER &&
      !!statValues.find((el) => isNaN(Number(el)))
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

  // Assumes the stat type has a default value
  const addStatWithDefault = (statType: IStatType) => {
    // Similar to a part of getNewStats
    const newStat: IStat = {
      id: statType.id,
      type: statType.id,
      values: [statType.defaultValue] as string[] | number[],
    };

    setStats((prevStats) => [...prevStats, newStat]);
  };

  // Assumes the new stat is valid
  const getNewStats = (prevStats = stats): IStat[] => {
    let values = statValues.filter((val) => val !== '') as string[] | number[];
    const mvs = {} as IMultiValueStat;

    if (selectedStatType.variant === StatTypeVariant.NUMBER) {
      values = values.map((val) => Number(val));

      if (selectedStatType.multipleValues) {
        mvs.sum = values.reduce((acc, val) => acc + val, 0);
        mvs.low = Math.min(...values);
        mvs.high = Math.max(...values);
        mvs.avg = Math.round((mvs.sum / values.length + Number.EPSILON) * 100) / 100;
      }
    }

    const newStat: IStat = {
      id: selectedStatType.id,
      type: selectedStatType.id,
      values,
    };
    if (Object.keys(mvs).length > 0) newStat.multiValueStats = mvs;

    return [...prevStats, newStat];
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
    if (edit && !!statValues.find((el) => el !== '')) {
      Alert.alert('Error', 'Please enter your current stat or clear it', [{ text: 'Ok' }]);
    } else {
      setStats((prevStats: IStat[]) => prevStats.filter((el) => el.id !== stat.id));

      if (edit) {
        const statType = statTypes.find((el) => el.id === stat.type);

        if (statType?.variant !== StatTypeVariant.MULTIPLE_CHOICE) {
          const newValues = statType?.multipleValues ? [...stat.values, ''] : stat.values;
          setStatValues(newValues.map((el) => String(el)));
        } else {
          setStatValues(['']);
        }

        setSelectedStatType(statTypes.find((el) => el.id === stat.type) || null);
      }
    }
  };

  const addEditEntry = () => {
    const unenteredStatExists = statValues.find((el) => el !== '');

    if (!unenteredStatExists || isValidStat()) {
      const entry: IEntry = {
        id: prevEntryId ? prevEntryId : statCategory.lastEntryId + 1,
        stats: unenteredStatExists ? getNewStats() : stats, // add last entered stat if needed
        comment,
      };

      if (date) {
        entry.date = {
          day: date.getDate(),
          month: date.getMonth() + 1,
          year: date.getFullYear(),
        };
      }

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
    const statType = statTypes.find((el) => el.id === id);

    if (statType.variant !== StatTypeVariant.MULTIPLE_CHOICE) {
      const nonEmptyValues = statValues.filter((el) => el !== '');

      if (selectedStatType.multipleValues && !statType.multipleValues) {
        if (nonEmptyValues.length > 1) {
          Alert.alert(
            'Error',
            'You cannot select this stat type, because you have multiple values entered and this stat type does not allow that',
            [{ text: 'Ok' }],
          );
        } else {
          setStatValues(nonEmptyValues);
          setSelectedStatType(statType);
        }
      } else {
        // If there are no empty values and we're switching to a stat type that allows that, add ''
        if (statType.multipleValues && statValues.length === nonEmptyValues.length)
          setStatValues((prevStatValues) => [...prevStatValues, '']);

        setSelectedStatType(statType);
      }
    } else if (!statValues.find((el) => el !== '')) {
      setStatValues(['']);
      setSelectedStatType(statType);
    } else {
      Alert.alert(
        'Error',
        `This is a multiple choice stat type. If you proceed, the ${
          selectedStatType.multipleValues ? 'values' : 'value'
        } you have entered will be lost. Proceed?`,
        [
          { text: 'Cancel' },
          {
            text: 'Ok',
            onPress: () => {
              setStatValues(['']);
              setSelectedStatType(statType);
            },
          },
        ],
      );
    }
  };

  const selectChoice = (value: number) => {
    setStats((prevStats) => [
      ...prevStats,
      {
        id: selectedStatType.id,
        type: selectedStatType.id,
        values: [value],
      },
    ]);
  };

  const getChoicesOptions = (): ISelectOption[] => {
    return selectedStatType.choices.map((el) => ({
      label: el.label,
      value: el.id,
    }));
  };

  const onAddStatType = () => {
    setStatModalOpen(false);
    setStatValues(['']);
    navigation.navigate('AddEditStatType');
  };

  const onEditStatType = (statType: IStatType) => {
    setStatModalOpen(false);
    setStatValues(['']);
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
    <View style={GS.scrollContainer}>
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
            <Text style={{ ...GS.text, flex: 1, marginVertical: 6 }}>
              {selectedStatType.name}
              {selectedStatType.unit ? ` (${selectedStatType.unit})` : ''}
            </Text>
          ) : (
            <Text style={{ ...GS.text, flex: 1, marginVertical: 6 }}>Stat</Text>
          )}
          {/* Don't show any button when entering stat values */}
          {filteredStatTypes.length === 0 ? (
            <Button onPress={onAddStatType} title="Create Stat" color="green" />
          ) : (
            <Button onPress={() => setStatModalOpen(true)} title="Change Stat" color="blue" />
          )}
        </View>
        {selectedStatType?.variant !== StatTypeVariant.MULTIPLE_CHOICE ? (
          <>
            <MultiValueInput
              values={statValues}
              setValues={setStatValues}
              placeholder="Value"
              numeric={selectedStatType?.variant === StatTypeVariant.NUMBER}
              allowMultiple={selectedStatType?.multipleValues}
            />
            <Button color={isValidStat(false) ? 'green' : 'grey'} title="Add Stat" onPress={addStat} />
          </>
        ) : (
          <Select
            options={getChoicesOptions()}
            selected={(selectedStatType.defaultValue as number) || 0}
            onSelect={selectChoice}
          />
        )}
        <Gap />

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
          <Text style={GS.text}>{date ? formatDate(date) : 'No date'}</Text>
          {date ? (
            <>
              <View style={{ flexDirection: 'row' }}>
                <Button onPress={() => setDatePickerOpen(true)} title="Edit" color="blue" />
                <Gap />
                <Button onPress={() => setDate(null)} title="Delete" color="red" />
              </View>
              <DatePicker
                modal
                mode="date"
                open={datePickerOpen}
                date={date}
                onConfirm={(date) => {
                  setDatePickerOpen(false);
                  setDate(date);
                }}
                onCancel={() => setDatePickerOpen(false)}
              />
            </>
          ) : (
            <Button onPress={() => setDate(new Date())} title="Add Date" color="green" />
          )}
        </View>
        <Button
          onPress={addEditEntry}
          title={prevEntryId ? 'Edit Entry' : 'Add Entry'}
          color={prevEntryId ? 'blue' : 'red'}
        />
        <Gap size="lg" />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  nameView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: mdGap,
    padding: xxsGap,
    borderWidth: 1,
    borderColor: 'grey',
  },
  date: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: mdGap,
  },
});

export default AddEditEntry;
