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
  StatValues,
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

  const getEmptyValue = (statType = selectedStatType): 0 | '' | null => {
    switch (statType?.variant) {
      case StatTypeVariant.MULTIPLE_CHOICE:
        return null;
      case StatTypeVariant.TIME:
        return 0;
      default:
        return '';
    }
  };

  // Used when editing an entry (note: ids start from 1, so this can only be falsy when set to null).
  // We need this, because passedData.entry get erased when going to the AddEditStatType screen.
  const [prevEntryId, setPrevEntryId] = useState<number>(null);
  const [stats, setStats] = useState<IStat[]>([]);
  const [filteredStatTypes, setFilteredStatTypes] = useState<IStatType[]>([]);
  const [selectedStatType, setSelectedStatType] = useState<IStatType>(statTypes[0] || null);
  // number[] for TIME variant, [null] for MULTIPLE_CHOICE variant and string[] for everything else
  const [statValues, setStatValues] = useState<StatValues>([getEmptyValue()]);
  // Multiple choice stat type only
  const [comment, setComment] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [statModalOpen, setStatModalOpen] = useState(false);

  // Only works when adding new entry
  // USE .includes() and getEmptyValue if applicable
  // const hasUnsavedChanges = Boolean(
  //   prevEntryId === null &&
  //     (comment ||
  //       statValues.find((el) => el !== '') ||
  //       stats.find((el) => el.values[0] !== statTypes.find((st) => st.id === el.type)?.defaultValue)),
  // );

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
          if (statType.defaultValue !== undefined) addStatWithDefault(statType);
        });
      }
    }

    // If coming from Home screen and editing an entry
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
    }
    // If coming from AddEditStatType screen with new/edited stat type
    else if (passedData?.statType) {
      // Update selected stat type if it's the one that was just edited
      if (selectedStatType?.id === passedData.statType.id) {
        setSelectedStatType(passedData.statType);
      }

      // If stat type has a default value and the values are empty
      if (
        passedData.statType.defaultValue &&
        statValues.find((el) => el !== getEmptyValue(passedData.statType)) === undefined
      ) {
        addStatWithDefault(passedData.statType);
      }
    }
  }, [passedData]);

  // useEffect(() => {
  //   navigation.addListener('beforeRemove', (e) => {
  //     console.log('test', hasUnsavedChanges);
  //     // If we don't have unsaved changes, then we don't need to do anything
  //     if (!hasUnsavedChanges) return;

  //     e.preventDefault();

  //     Alert.alert('Notice', 'You have unsaved data. Are you sure you want to discard it and go back?', [
  //       { text: 'Cancel', onPress: () => {} },
  //       {
  //         text: 'Yes',
  //         // If the user confirmed, then we dispatch the action we blocked earlier
  //         // This will continue the action that had triggered the removal of the screen
  //         onPress: () => navigation.dispatch(e.data.action),
  //       },
  //     ]);
  //   });
  // }, [navigation, hasUnsavedChanges]);

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
      if (statTypes.find((el) => el.id === stat.type) === undefined) {
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
      statValues.filter((el) => el !== getEmptyValue()).length > 1
    ) {
      if (showAlerts)
        Alert.alert(
          'Error',
          'This stat type does not allow multiple values. Please select a different stat type or enter just one value.',
          [{ text: 'Ok' }],
        );
      return false;
    } else if (statValues.find((el) => el !== getEmptyValue()) === undefined) {
      if (showAlerts) Alert.alert('Error', 'Please enter a stat value', [{ text: 'Ok' }]);
      return false;
    } else if (
      selectedStatType.variant === StatTypeVariant.NUMBER &&
      statValues.find((el) => isNaN(Number(el))) !== undefined
    ) {
      if (showAlerts) {
        const error = selectedStatType.multipleValues
          ? 'All values must be numeric for this stat type'
          : 'The value must be numeric for this stat type';
        Alert.alert('Error', error, [{ text: 'Ok' }]);
      }
      return false;
    } else if (selectedStatType.variant === StatTypeVariant.TIME && statValues.includes(-1)) {
      if (showAlerts) Alert.alert('Error', 'All times must be valid', [{ text: 'Ok' }]);
      return false;
    }
    return true;
  };

  // Used for automatically adding a default stat value. Assumes the stat type has a default value.
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
    let values = statValues.filter((val) => val !== getEmptyValue()) as string[] | number[];
    const mvs = {} as IMultiValueStat;

    if ([StatTypeVariant.NUMBER, StatTypeVariant.TIME].includes(selectedStatType.variant)) {
      // Convert all values to number type for the NUMBER variant
      values = values.map((val) => Number(val));

      if (selectedStatType.multipleValues) {
        mvs.sum = values.reduce((acc, val) => acc + val, 0);
        mvs.low = Math.min(...values);
        mvs.high = Math.max(...values);

        let sum = mvs.sum;
        let valuesNum = values.length;

        if (selectedStatType.exclBestWorst && values.length > 3) {
          sum = mvs.sum - mvs.low - mvs.high;
          valuesNum -= 2;
        }

        if (selectedStatType.variant === StatTypeVariant.NUMBER) {
          // Round average to two decimals
          mvs.avg = Math.round((sum / valuesNum + Number.EPSILON) * 100) / 100;
        } else {
          mvs.avg = Math.round(sum / valuesNum);
        }
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
      setStatValues([getEmptyValue()]);
    }
  };

  // Delete a stat from the list or edit it (delete from the list, but put values in the inputs)
  const deleteEditStat = (stat: IStat, edit = false) => {
    const statType = statTypes.find((el) => el.id === stat.type) || null;

    // If editing and there is a value that hasn't been entered yet
    if (
      edit &&
      selectedStatType?.variant !== StatTypeVariant.MULTIPLE_CHOICE &&
      statValues.find((el) => el !== getEmptyValue()) !== undefined
    ) {
      Alert.alert('Notice', 'Please enter your current stat or clear it', [{ text: 'Ok' }]);
    } else {
      // Remove stat from working list of stats
      setStats((prevStats: IStat[]) => prevStats.filter((el) => el.id !== stat.id));

      if (edit) {
        let newValues: StatValues = stat.values;

        // Convert values to string if not MULTIPLE_CHOICE or TIME variant
        if (![StatTypeVariant.MULTIPLE_CHOICE, StatTypeVariant.TIME].includes(statType?.variant)) {
          newValues = newValues.map((el) => String(el));
        }

        if (statType === null) {
          setStatValues(newValues);
          setSelectedStatType(null);
        } else {
          selectStatType(statType, newValues);
        }
      }
    }
  };

  const addEditEntry = () => {
    const nonEmptyValueExists: boolean = statValues.find((el) => el !== getEmptyValue()) !== undefined;

    if (!nonEmptyValueExists || isValidStat()) {
      const entry: IEntry = {
        id: prevEntryId || statCategory.lastEntryId + 1, // lastEntryId then gets updated in addEntry if adding
        stats: nonEmptyValueExists ? getNewStats() : stats, // add last entered stat if needed
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

  // Assumes stat type has no problems with it. newStatValues is for deleteEditStat().
  // When called from deleteEditStat(), it's certain that there are no non-empty values and
  // the new stat values are already converted if needed
  const selectStatType = (newStatType: IStatType, newStatValues?: Array<string | number>) => {
    const updateStatTypeAndValues = (prevStatValues: StatValues = []) => {
      let processedStatValues: StatValues;

      if (newStatValues !== undefined) {
        processedStatValues = newStatValues;
      } else {
        if (prevStatValues.length > 0) {
          processedStatValues = prevStatValues;
        } else {
          if (newStatType?.defaultValue !== undefined) {
            if (newStatType.variant === StatTypeVariant.NUMBER) {
              processedStatValues = [String(newStatType.defaultValue)];
            } else {
              processedStatValues = [newStatType.defaultValue];
            }
          } else {
            processedStatValues = [getEmptyValue(newStatType)];
          }
        }
      }

      // If we're switching to a stat type that allows multiple values and there are no empty values, add one
      if (newStatType?.multipleValues && !processedStatValues.includes(getEmptyValue(newStatType))) {
        processedStatValues = [...processedStatValues, getEmptyValue(newStatType)];
      }

      setStatValues(processedStatValues);
      setSelectedStatType(newStatType);
    };

    const showWarningWithDiscard = (message: string) => {
      Alert.alert('Warning', message, [
        { text: 'Cancel' },
        { text: 'Yes', onPress: () => updateStatTypeAndValues() },
      ]);
    };

    if (newStatType.variant === StatTypeVariant.MULTIPLE_CHOICE) {
      // If there are non-empty values
      if (statValues.find((el) => el !== getEmptyValue()) !== undefined) {
        const valueWord = statValues.filter((el) => el !== getEmptyValue()).length > 1 ? 'values' : 'value';
        showWarningWithDiscard(
          `This is a multiple choice stat type. If you proceed, the ${valueWord} you have entered will be lost. Proceed?`,
        );
      } else {
        updateStatTypeAndValues();
      }
    } else {
      // Get non-empty values from prev. stat type (only if prev. stat type was not multiple choice)
      const nonEmptyValues =
        selectedStatType?.variant !== StatTypeVariant.MULTIPLE_CHOICE
          ? statValues.filter((el) => el !== getEmptyValue())
          : [];

      if (
        nonEmptyValues.length > 0 &&
        selectedStatType?.variant !== StatTypeVariant.TIME &&
        newStatType.variant === StatTypeVariant.TIME
      ) {
        showWarningWithDiscard(
          'This stat type has the time stat type variant. Do you want to discard the entered values?',
        );
      } else if (
        (nonEmptyValues.length > 0 &&
          selectedStatType?.variant === StatTypeVariant.TIME &&
          newStatType.variant !== StatTypeVariant.TIME) ||
        (nonEmptyValues.length > 0 &&
          selectedStatType?.variant === StatTypeVariant.TEXT &&
          newStatType.variant !== StatTypeVariant.TEXT)
      ) {
        showWarningWithDiscard(
          'The current stat type is not compatible with the selected one. Do you want to discard the entered values?',
        );
      } else if (nonEmptyValues.length > 1 && !newStatType.multipleValues) {
        showWarningWithDiscard(
          'This stat type does not allow multiple values. Do you want to discard the entered values?',
        );
      }
      // If there are no warning pop-ups
      else {
        updateStatTypeAndValues(nonEmptyValues);
      }
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

  // Filter out stat types that have already been entered
  const filterStatTypes = () => {
    const newFilteredStatTypes = statTypes.filter(
      (type) => stats.find((stat) => stat.type === type.id) === undefined,
    );

    if (newFilteredStatTypes.length === 0) {
      // If the remaining stat values are not of type string, discard them
      // (e.g. when the previous stat type was TIME or MULTIPLE_CHOICE)
      if (typeof statValues[0] !== 'string') setStatValues(['']);
      setSelectedStatType(null);
    }
    // If the selected stat type is not in the filtered list or none is selected, select next stat type (by order)
    else if (newFilteredStatTypes.find((el) => el.id === selectedStatType?.id) === undefined) {
      let newSelectedStatType = null;

      if (selectedStatType) {
        for (let st of newFilteredStatTypes) {
          if (st.order >= selectedStatType.order) {
            newSelectedStatType = st;
            break;
          }
        }
      }
      // If there are no more stat types further down the list or the selected stat type is null,
      // use the first stat type in newFilteredStatTypes
      if (newSelectedStatType === null) newSelectedStatType = newFilteredStatTypes[0];

      selectStatType(newSelectedStatType);
    }

    setFilteredStatTypes(newFilteredStatTypes);
  };

  const changeComment = (value: string) => {
    if (value !== comment) {
      setComment(value);
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
              statType={selectedStatType}
              placeholder="Value"
              numeric={selectedStatType?.variant === StatTypeVariant.NUMBER}
              allowMultiple={selectedStatType?.multipleValues}
            />
            <Button color={isValidStat(false) ? 'green' : 'grey'} title="Add Stat" onPress={addStat} />
          </>
        ) : (
          <Select
            options={getChoicesOptions()}
            selected={(statValues[0] as number) || 0}
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
