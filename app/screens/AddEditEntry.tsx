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

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
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
    newStatType?: boolean;
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
        selectStatType(passedData.statType, passedData.newStatType ? 'added' : 'edited');
      }
    }
  }, [passedData]);

  useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {
      // If we don't have unsaved changes, then we don't need to do anything
      if (!hasUnsavedChanges) return;

      e.preventDefault();

      Alert.alert('Notice', 'You have unsaved data. Are you sure you want to discard it and go back?', [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Yes',
          // If the user confirmed, then we dispatch the action we blocked earlier
          // This will continue the action that had triggered the removal of the screen
          onPress: () => navigation.dispatch(e.data.action),
        },
      ]);
    });
  }, [navigation, hasUnsavedChanges]);

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
    }
    return true;
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
      Alert.alert('Notice', 'Please enter your current stat or clear it', [{ text: 'Ok' }]);
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
    const unenteredStatExists = !!statValues.find((el) => el !== '');

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

  const getValueWord = (): string => {
    return statValues.filter((el) => el !== '').length > 1 ? 'values' : 'value';
  };

  // Assumes stat type has no problems with it
  const selectStatType = (statType: IStatType, mode: 'select' | 'added' | 'edited' = 'select') => {
    if (statType.variant !== StatTypeVariant.MULTIPLE_CHOICE) {
      const nonEmptyValues = statValues.filter((el) => el !== '');

      if (nonEmptyValues.length > 1 && !statType.multipleValues) {
        const message1 =
          'You cannot select this stat type, because you have multiple values entered and this stat type does not allow that';
        const message2 = `The stat you just ${mode} does not allow multiple values, so it's not possible to switch to it automatically.`;

        Alert.alert('Notice', mode === 'select' ? message1 : message2, [{ text: 'Ok' }]);
      } else {
        // If there are no empty values and we're switching to a stat type that allows multiple values, add ''.
        // If there is an empty value and multiple values is enabled - don't do anything.
        if (statType.multipleValues && statValues.length === nonEmptyValues.length) {
          setStatValues((prevStatValues) => [...prevStatValues, '']);
        } else if (!statType.multipleValues) {
          // At this point nonEmptyValues can only have a single value at most, because it would have
          // gotten caught by (nonEmptyValues.length > 1 && !statType.multipleValues) otherwise
          setStatValues(nonEmptyValues.length === 1 ? nonEmptyValues : ['']);
        }

        setSelectedStatType(statType);
      }
    }
    // If there are no filled-in values
    else if (!statValues.find((el) => el !== '')) {
      setStatValues(['']);
      setSelectedStatType(statType);
    } else {
      const message1 = `This is a multiple choice stat type. If you proceed, the ${getValueWord()} you have entered will be lost. Proceed?`;
      const message2 = `You have created a multiple choice stat type. If you switch to it, the ${getValueWord()} you have entered will be lost. Switch to the new stat type?`;

      Alert.alert(mode === 'select' ? 'Warning' : 'Notice', mode === 'select' ? message1 : message2, [
        { text: 'Cancel' },
        {
          text: 'Yes',
          onPress: () => {
            setStatValues(['']);
            setSelectedStatType(statType);
          },
        },
      ]);
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

  // statType = null means add stat type
  const onAddEditStatType = (statType: IStatType = null) => {
    setStatModalOpen(false);

    const params = statType ? { statType } : undefined;
    navigation.navigate('AddEditStatType', params);
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

  const changeComment = (value: string) => {
    if (value !== comment) {
      setComment(value);
      setHasUnsavedChanges(true);
    }
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
          onAddEditStatType={onAddEditStatType}
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
            <Button onPress={() => onAddEditStatType()} title="Create Stat" color="green" />
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
              setHasUnsavedChanges={setHasUnsavedChanges}
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
          onChangeText={changeComment}
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
