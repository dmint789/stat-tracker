import React, { useState, useEffect } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { addStatType, editStatType } from '../redux/mainSlice';
import GS from '../shared/GlobalStyles';
import { getIsNumericVariant } from '../shared/GlobalFunctions';
import { IStatType, ISelectOption, StatTypeVariant } from '../shared/DataStructures';
import Checkbox from '../components/Checkbox';
import Select from '../components/Select';

const AddEditStatType = ({ navigation, route }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { statCategory, statTypes } = useSelector((state: RootState) => state.main);

  const [name, setName] = useState<string>('');
  const [unit, setUnit] = useState<string>('');
  const [variant, setVariant] = useState<StatTypeVariant>(StatTypeVariant.NON_NUMERIC);
  // const [choices, setChoices] = useState([]);
  // const [formula, setFormula] = useState<string>('');
  const [multipleValues, setMultipleValues] = useState<boolean>(false);
  const [showBest, setShowBest] = useState<boolean>(true);
  const [showAvg, setShowAvg] = useState<boolean>(false);
  const [showSum, setShowSum] = useState<boolean>(false);
  const [trackPBs, setTrackPBs] = useState<boolean>(false);

  // If statType is null, we're adding a new stat type
  const passedData: {
    statType?: IStatType;
  } = route.params;

  const options: ISelectOption[] = [
    { label: 'Text', value: StatTypeVariant.NON_NUMERIC },
    { label: 'Number (higher is better)', value: StatTypeVariant.HIGHER_IS_BETTER },
    { label: 'Number (lower is better)', value: StatTypeVariant.LOWER_IS_BETTER },
  ];

  useEffect(() => {
    if (passedData?.statType) {
      navigation.setOptions({ title: 'Edit Stat Type' });

      const { statType } = passedData;

      setName(statType.name);
      if (statType.unit) setUnit(statType.unit);
      setVariant(statType.variant);
      if (statType.multipleValues !== undefined) setMultipleValues(statType.multipleValues);
      if (statType.showBest !== undefined) setShowBest(statType.showBest);
      if (statType.showAvg !== undefined) setShowAvg(statType.showAvg);
      if (statType.showSum !== undefined) setShowSum(statType.showSum);
      if (statType.trackPBs !== undefined) setTrackPBs(statType.trackPBs);
    } else {
      navigation.setOptions({ title: 'Add Stat Type' });
    }
  }, [passedData]);

  const changeVariant = (value: StatTypeVariant) => {
    setVariant(value);
  };

  const getShowMultiNumericOptions = (): boolean => {
    return multipleValues && getIsNumericVariant(variant);
  };

  const getCanHaveMultipleValues = (): boolean => {
    return [
      StatTypeVariant.NON_NUMERIC,
      StatTypeVariant.HIGHER_IS_BETTER,
      StatTypeVariant.LOWER_IS_BETTER,
    ].includes(variant);
  };

  const isValidStatType = (): boolean => {
    if (name === '') {
      Alert.alert('Error', 'Please enter a name', [{ text: 'Ok' }]);
      return false;
    } else if (statTypes.find((el) => el.name === name && el.id !== passedData?.statType.id)) {
      Alert.alert('Error', 'A stat type with that name already exists', [{ text: 'Ok' }]);
      return false;
    } else return true;
  };

  const addEditStatType = () => {
    if (isValidStatType()) {
      const statType: IStatType = {
        id: passedData?.statType ? passedData.statType.id : statCategory.lastStatTypeId + 1,
        name,
        order: passedData?.statType ? passedData.statType.order : statTypes.length + 1,
        variant,
      };

      if (unit) statType.unit = unit;
      if (getCanHaveMultipleValues()) statType.multipleValues = multipleValues;
      if (getShowMultiNumericOptions()) {
        statType.showBest = showBest;
        statType.showAvg = showAvg;
        statType.showSum = showSum;
      }
      if (getIsNumericVariant(variant)) statType.trackPBs = trackPBs;

      if (passedData?.statType) {
        if (passedData.statType.pbs) statType.pbs = passedData.statType.pbs;

        dispatch(editStatType(statType));
      } else {
        dispatch(addStatType(statType));
      }

      navigation.navigate('AddEditEntry', { statType });
    }
  };

  return (
    <View style={GS.container}>
      <ScrollView keyboardShouldPersistTaps="always" style={GS.scrollableArea}>
        <TextInput
          style={{ ...GS.input, marginTop: 15 }}
          value={name}
          placeholder="Stat type name"
          placeholderTextColor="grey"
          onChangeText={(value) => setName(value)}
        />
        <TextInput
          style={GS.input}
          value={unit}
          placeholder="Unit of measurement (km, lb, etc.)"
          placeholderTextColor="grey"
          onChangeText={(value) => setUnit(value)}
        />
        <Text style={styles.label}>Variant:</Text>
        <Select
          options={passedData?.statType ? [options.find((el) => el.value === variant)] : options}
          selected={variant}
          onSelect={changeVariant}
        />
        {getCanHaveMultipleValues() && (
          // Checkbox disabled if editing stat type
          <Checkbox checked={multipleValues} disabled={!!passedData?.statType} onChange={setMultipleValues}>
            Allow multiple values
          </Checkbox>
        )}
        {getShowMultiNumericOptions() && (
          <>
            <Checkbox checked={showBest} onChange={setShowBest}>
              Show best values
            </Checkbox>
            <Checkbox checked={showAvg} onChange={setShowAvg}>
              Show the average of all values
            </Checkbox>
            <Checkbox checked={showSum} onChange={setShowSum}>
              Show the sum of all values
            </Checkbox>
          </>
        )}
        {getIsNumericVariant(variant) && (
          <Checkbox checked={trackPBs} onChange={setTrackPBs}>
            Track PBs{variant === StatTypeVariant.NON_NUMERIC ? ' (manual)' : ''}
          </Checkbox>
        )}
        <View style={{ marginVertical: 20 }}>
          <Button
            onPress={addEditStatType}
            title={passedData?.statType ? 'Edit Stat Type' : 'Add Stat Type'}
            color={passedData?.statType ? 'blue' : 'red'}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 22,
    color: 'black',
  },
});

export default AddEditStatType;
