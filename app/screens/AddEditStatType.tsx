import React, { useState, useEffect } from 'react';
import { Alert, Button, ScrollView, Text, TextInput, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { addStatType, editStatType } from '../redux/mainSlice';
import GS, { lgGap, mdGap } from '../shared/GlobalStyles';
import { IStatType, ISelectOption, StatTypeVariant } from '../shared/DataStructure';

import Checkbox from '../components/Checkbox';
import Gap from '../components/Gap';
import Select from '../components/Select';
import MultiValueInput from '../components/MultiValueInput';

const AddEditStatType = ({ navigation, route }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { statCategory, statTypes } = useSelector((state: RootState) => state.main);

  const [name, setName] = useState<string>('');
  const [unit, setUnit] = useState<string>('');
  const [variant, setVariant] = useState<StatTypeVariant>(StatTypeVariant.TEXT);
  // This is a string when used with NUMBER or TEXT variants and a number when used with MULTIPLE_CHOICE
  const [defaultValue, setDefaultValue] = useState<string | number>('');
  const [higherIsBetter, setHigherIsBetter] = useState<boolean>(true);
  const [choices, setChoices] = useState(['']);
  const [choicesAccepted, setChoicesAccepted] = useState<boolean>(false);
  // const [formula, setFormula] = useState<string>('');
  const [multipleValues, setMultipleValues] = useState<boolean>(false);
  const [showBest, setShowBest] = useState<boolean>(true);
  const [showAvg, setShowAvg] = useState<boolean>(false);
  const [showSum, setShowSum] = useState<boolean>(false);
  const [trackPBs, setTrackPBs] = useState<boolean>(false);

  // If statType is not set, we're adding a new stat type
  const passedData: {
    statType?: IStatType;
  } = route.params;

  const variantOptions: ISelectOption[] = [
    { label: 'Text', value: StatTypeVariant.TEXT },
    { label: 'Number', value: StatTypeVariant.NUMBER },
    { label: 'Multiple choice', value: StatTypeVariant.MULTIPLE_CHOICE },
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
      setUnit(statType.unit || '');
      setVariant(statType.variant);
      if (statType.defaultValue !== undefined) setDefaultValue(statType.defaultValue);
      else if (statType.variant === StatTypeVariant.MULTIPLE_CHOICE) setDefaultValue(0);
      if (statType.higherIsBetter !== undefined) setHigherIsBetter(statType.higherIsBetter);
      if (statType.choices !== undefined) {
        setChoices(statType.choices.map((el) => el.label));
        setChoicesAccepted(true);
      }
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
    switch (value) {
      case StatTypeVariant.TEXT:
        // If defaultValue is of type number, that means it was last edited for MULTIPLE_CHOICE
        if (typeof defaultValue === 'number') setDefaultValue('');
        break;
      case StatTypeVariant.NUMBER:
        if (typeof defaultValue === 'number' || isNaN(Number(defaultValue))) setDefaultValue('');
        break;
      case StatTypeVariant.MULTIPLE_CHOICE:
        setDefaultValue(0);
        break;
      default:
        throw new Error('Unexpected stat type variant when changing variant!');
    }

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
    } else if (variant === StatTypeVariant.NUMBER && isNaN(Number(defaultValue))) {
      Alert.alert('Error', 'The default value for a numeric stat type must be a number', [{ text: 'Ok' }]);
      return false;
    } else if (variant === StatTypeVariant.MULTIPLE_CHOICE) {
      if (!choicesAccepted) {
        Alert.alert('Error', 'You must accept your options first', [{ text: 'Ok' }]);
        return false;
      } else if (!!passedData?.statType && choices.length < passedData.statType.choices.length) {
        Alert.alert('Error', 'You cannot have fewer options than before', [{ text: 'Ok' }]);
        return false;
      }
    }
    return true;
  };

  const isValidChoices = (): boolean => {
    return choices.filter((el) => el !== '').length >= 2;
  };

  const acceptChoices = () => {
    const nonEmptyChoices = choices.filter((el) => el !== '');

    if (nonEmptyChoices.length >= 2) {
      setChoices(nonEmptyChoices);
      setChoicesAccepted(true);
      if (defaultValue > nonEmptyChoices.length) {
        setDefaultValue(0);
      }
    } else {
      Alert.alert('Error', 'Please enter at least two choices', [{ text: 'Ok' }]);
    }
  };

  const editChoices = () => {
    setChoicesAccepted(false);
    setChoices((prevChoices) => [...prevChoices, '']);
  };

  const getChoicesOptions = (): ISelectOption[] => {
    return [
      {
        label: 'None',
        value: 0,
        color: 'gray',
      },
      ...choices.map((choice, i) => ({
        label: choice,
        value: i + 1,
      })),
    ];
  };

  const addEditStatType = () => {
    if (isValidStatType()) {
      const statType: IStatType = {
        id: passedData?.statType ? passedData.statType.id : statCategory.lastStatTypeId + 1,
        name,
        order: passedData?.statType ? passedData.statType.order : statTypes.length + 1,
        variant,
      };

      if (unit && variant !== StatTypeVariant.MULTIPLE_CHOICE) statType.unit = unit;
      if (variant === StatTypeVariant.NUMBER) {
        statType.higherIsBetter = higherIsBetter;
        statType.trackPBs = trackPBs;
      } else if (variant === StatTypeVariant.MULTIPLE_CHOICE) {
        statType.choices = choices.map((val, i) => ({
          id: i + 1,
          label: val,
        }));
      }
      // If defaultValue is '' or 0, don't save it
      if (defaultValue && !multipleValues) {
        statType.defaultValue = variant === StatTypeVariant.NUMBER ? Number(defaultValue) : defaultValue;
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

      navigation.navigate('AddEditEntry', { statType, newStatType: !passedData?.statType });
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
        {variant !== StatTypeVariant.MULTIPLE_CHOICE && (
          <>
            <TextInput
              style={GS.input}
              value={unit}
              placeholder="Unit of measurement (km, lb, etc.)"
              placeholderTextColor="grey"
              onChangeText={(value) => setUnit(value)}
            />
            {!multipleValues && (
              <TextInput
                style={GS.input}
                value={String(defaultValue)}
                placeholder="Default value (leave empty if not needed)"
                placeholderTextColor="grey"
                onChangeText={(value) => setDefaultValue(value)}
              />
            )}
          </>
        )}
        <Text style={GS.titleText}>Variant</Text>
        <Select
          options={
            passedData?.statType ? [variantOptions.find((el) => el.value === variant)] : variantOptions
          }
          selected={variant}
          onSelect={changeVariant}
        />
        {variant === StatTypeVariant.NUMBER && (
          <View style={{ marginTop: lgGap, marginHorizontal: lgGap }}>
            <Select
              options={higherLowerIsBetterOptions}
              selected={Number(higherIsBetter)}
              onSelect={changeHigherLowerIsBetter}
              horizontal
            />
          </View>
        )}
        {variant === StatTypeVariant.MULTIPLE_CHOICE &&
          (!choicesAccepted ? (
            <>
              <MultiValueInput values={choices} setValues={setChoices} placeholder="Option" appendNumber />
              <Button
                color={isValidChoices() ? 'green' : 'grey'}
                title="Accept Options"
                onPress={acceptChoices}
              />
            </>
          ) : (
            <>
              <Text style={GS.titleText}>Default Option</Text>
              <View style={{ marginBottom: mdGap, marginHorizontal: lgGap }}>
                <Select
                  options={getChoicesOptions()}
                  selected={defaultValue as number}
                  onSelect={(value: number) => setDefaultValue(value)}
                />
              </View>
              <Button color="blue" title="Edit Options" onPress={editChoices} />
            </>
          ))}
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
        <Gap size="lg" />
      </ScrollView>
    </View>
  );
};

export default AddEditStatType;
