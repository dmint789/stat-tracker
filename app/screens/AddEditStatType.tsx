import React, { useState, useEffect } from 'react';
import { Alert, Button, ScrollView, Text, TextInput, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { addStatType, editStatType } from '../redux/mainSlice';
import GS from '../shared/GlobalStyles';
import { IStatType, ISelectOption, StatTypeVariant } from '../shared/DataStructure';

import Checkbox from '../components/Checkbox';
import Gap from '../components/Gap';
import Select from '../components/Select';

const AddEditStatType = ({ navigation, route }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { statCategory, statTypes } = useSelector((state: RootState) => state.main);

  const [name, setName] = useState<string>('');
  const [unit, setUnit] = useState<string>('');
  const [variant, setVariant] = useState<StatTypeVariant>(StatTypeVariant.TEXT);
  const [higherIsBetter, setHigherIsBetter] = useState<boolean>(true);
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

  const variantOptions: ISelectOption[] = [
    { label: 'Text', value: StatTypeVariant.TEXT },
    { label: 'Number', value: StatTypeVariant.NUMBER },
  ];

  const higherLowerIsBetterOptions: ISelectOption[] = [
    { label: 'Higher is better', value: 1 },
    { label: 'Lower is better', value: 0 },
  ];

  useEffect(() => {
    if (passedData?.statType) {
      navigation.setOptions({ title: 'Edit Stat Type' });

      const { statType } = passedData;

      setName(statType.name);
      if (statType.unit) setUnit(statType.unit);
      setVariant(statType.variant);
      if (statType.higherIsBetter !== undefined) setHigherIsBetter(statType.higherIsBetter);
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

  const changeHigherLowerIsBetter = (value: number) => {
    setHigherIsBetter(!!value); // value will be either 1 or 0
  };

  const getShowMultiNumericOptions = (): boolean => {
    return multipleValues && variant === StatTypeVariant.NUMBER;
  };

  const getCanHaveMultipleValues = (): boolean => {
    return [StatTypeVariant.TEXT, StatTypeVariant.NUMBER].includes(variant);
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
      if (variant === StatTypeVariant.NUMBER) {
        statType.higherIsBetter = higherIsBetter;
        statType.trackPBs = trackPBs;
      }
      if (getCanHaveMultipleValues()) statType.multipleValues = multipleValues;
      if (getShowMultiNumericOptions()) {
        statType.showBest = showBest;
        statType.showAvg = showAvg;
        statType.showSum = showSum;
      }

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
    <View style={GS.scrollContainer}>
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
        <Text style={GS.titleText}>Variant</Text>
        <Select
          options={
            passedData?.statType ? [variantOptions.find((el) => el.value === variant)] : variantOptions
          }
          selected={variant}
          onSelect={changeVariant}
        />
        {variant === StatTypeVariant.NUMBER && (
          <View style={{ marginHorizontal: 18 }}>
            <Select
              options={higherLowerIsBetterOptions}
              selected={Number(higherIsBetter)}
              onSelect={changeHigherLowerIsBetter}
              horizontal
            />
          </View>
        )}
        {getCanHaveMultipleValues() && (
          // Checkbox disabled if editing stat type
          <Checkbox checked={multipleValues} disabled={!!passedData?.statType} onChange={setMultipleValues}>
            Allow multiple values
          </Checkbox>
        )}
        {getShowMultiNumericOptions() && (
          <View style={{ marginLeft: 24 }}>
            <Checkbox checked={showBest} onChange={setShowBest}>
              Show best values
            </Checkbox>
            <Checkbox checked={showAvg} onChange={setShowAvg}>
              Show the average of all values
            </Checkbox>
            <Checkbox checked={showSum} onChange={setShowSum}>
              Show the sum of all values
            </Checkbox>
          </View>
        )}
        {/* Track PBs{variant === StatTypeVariant.TEXT ? ' (manual)' : ''} */}
        {variant === StatTypeVariant.NUMBER && (
          <Checkbox checked={trackPBs} onChange={setTrackPBs}>
            Track PBs
          </Checkbox>
        )}
        <Gap size="lg" />
        <Button
          onPress={addEditStatType}
          title={passedData?.statType ? 'Edit Stat Type' : 'Add Stat Type'}
          color={passedData?.statType ? 'blue' : 'red'}
        />
      </ScrollView>
    </View>
  );
};

export default AddEditStatType;
