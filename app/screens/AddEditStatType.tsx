import React, { useState, useEffect } from 'react';
import { Alert, Button, ScrollView, Text, TextInput, View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { addStatType, editStatType } from '../redux/mainSlice';
import GS, {
  blue,
  green,
  xxsGap,
  smGap,
  mdGap,
  lgGap,
  lightBlue,
  rowStyle,
  justifyRowStyle,
  lgFontSize,
} from '../shared/GlobalStyles';
import { IStatType, ISelectOption, StatTypeVariant } from '../shared/DataStructure';

import Checkbox from '../components/Checkbox';
import Gap from '../components/Gap';
import Select from '../components/Select';
import MultiValueInput from '../components/MultiValueInput';
import TimeInput from '../components/TimeInput';
import { getIsNumericVariant } from '../shared/GlobalFunctions';

const AddEditStatType = ({ navigation, route }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { statCategory, statTypes } = useSelector((state: RootState) => state.main);

  const [name, setName] = useState<string>('');
  const [unit, setUnit] = useState<string>('');
  const [variant, setVariant] = useState<StatTypeVariant>(StatTypeVariant.TEXT);
  const [defaultValue, setDefaultValue] = useState<string | number>('');
  const [higherIsBetter, setHigherIsBetter] = useState<boolean>(true);
  const [choices, setChoices] = useState(['']);
  const [choicesAccepted, setChoicesAccepted] = useState<boolean>(false);
  const [decimals, setDecimals] = useState<number>(2);
  // const [formula, setFormula] = useState<string>('');
  const [multipleValues, setMultipleValues] = useState<boolean>(false);
  const [showBest, setShowBest] = useState<boolean>(true);
  const [showAvg, setShowAvg] = useState<boolean>(false);
  const [exclBestWorst, setExclBestWorst] = useState<boolean>(false);
  const [showSum, setShowSum] = useState<boolean>(false);
  const [trackPBs, setTrackPBs] = useState<boolean>(false);
  const [trackYearPBs, setTrackYearPBs] = useState<boolean>(false);
  const [trackMonthPBs, setTrackMonthPBs] = useState<boolean>(false);

  // If statType is not set, we're adding a new stat type
  const passedData: {
    statType?: IStatType;
  } = route.params;

  const variantOptions: ISelectOption[] = [
    { label: 'Text', value: StatTypeVariant.TEXT },
    { label: 'Number', value: StatTypeVariant.NUMBER },
    { label: 'Time', value: StatTypeVariant.TIME },
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
      if (statType.decimals !== undefined) setDecimals(statType.decimals);
      if (statType.multipleValues !== undefined) setMultipleValues(statType.multipleValues);
      if (statType.showBest !== undefined) setShowBest(statType.showBest);
      if (statType.showAvg !== undefined) setShowAvg(statType.showAvg);
      if (statType.exclBestWorst !== undefined) setShowAvg(statType.exclBestWorst);
      if (statType.showSum !== undefined) setShowSum(statType.showSum);
      if (statType.trackPBs !== undefined) setTrackPBs(statType.trackPBs);
      if (statType.trackYearPBs !== undefined) setTrackYearPBs(statType.trackYearPBs);
      if (statType.trackMonthPBs !== undefined) setTrackMonthPBs(statType.trackMonthPBs);
    } else {
      navigation.setOptions({ title: 'Add Stat Type' });
    }
  }, [passedData]);

  const changeName = (value: string) => {
    if (value !== name) setName(value);
  };

  const changeUnit = (value: string) => {
    if (value !== unit) setUnit(value);
  };

  const changeDefaultValue = (value: string | number) => {
    if (typeof value !== 'string' || value !== defaultValue) {
      setDefaultValue(value);
    }
  };

  const changeVariant = (value: StatTypeVariant) => {
    // Reset things before changing variant
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
      case StatTypeVariant.TIME:
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

  const changeDecimals = (e: any) => {
    if (!/[^0-9]/.test(e.nativeEvent.key)) {
      setDecimals(Math.max(Math.min(Number(e.nativeEvent.key), 6), 0));
    }
  };

  const getShowMultiNumericOptions = (): boolean => {
    return multipleValues && [StatTypeVariant.NUMBER, StatTypeVariant.TIME].includes(variant);
  };

  const getCanHaveMultipleValues = (): boolean => {
    return [StatTypeVariant.TEXT, StatTypeVariant.NUMBER, StatTypeVariant.TIME].includes(variant);
  };

  // For now it's the same as getIsNumericVariant, but this could change in the future
  const getCanTrackPBs = (): boolean => {
    return [StatTypeVariant.NUMBER, StatTypeVariant.TIME].includes(variant);
  };

  const getCanHaveUnit = (): boolean => {
    return [StatTypeVariant.NUMBER, StatTypeVariant.TEXT].includes(variant);
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
    } else if (variant === StatTypeVariant.TIME && defaultValue === -1) {
      Alert.alert('Error', 'The default time is invalid', [{ text: 'Ok' }]);
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
      if ((defaultValue as number) > nonEmptyChoices.length) {
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

      if (unit && getCanHaveUnit()) statType.unit = unit;
      if (getCanTrackPBs()) {
        statType.higherIsBetter = higherIsBetter;
        statType.trackPBs = trackPBs;
        statType.trackYearPBs = trackYearPBs;
        statType.trackMonthPBs = trackMonthPBs;
      }
      if (variant === StatTypeVariant.MULTIPLE_CHOICE) {
        statType.choices = choices.map((val, i) => ({
          id: i + 1,
          label: val,
        }));
      }
      if (getIsNumericVariant(variant)) {
        statType.decimals = decimals;
      }
      // If defaultValue is '' or 0 and multipleValues is unset, don't save it
      if (defaultValue && !multipleValues) {
        statType.defaultValue = getIsNumericVariant(variant) ? Number(defaultValue) : defaultValue;
      }
      if (getCanHaveMultipleValues()) statType.multipleValues = multipleValues;
      if (getShowMultiNumericOptions()) {
        statType.showBest = showBest;
        statType.showAvg = showAvg;
        if (variant === StatTypeVariant.TIME) statType.exclBestWorst = exclBestWorst;
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
          onChangeText={changeName}
        />
        {getCanHaveUnit() && (
          <TextInput
            style={GS.input}
            value={unit}
            placeholder="Unit of measurement (km, lb, etc.)"
            placeholderTextColor="grey"
            onChangeText={changeUnit}
          />
        )}
        {!multipleValues &&
          variant !== StatTypeVariant.MULTIPLE_CHOICE &&
          (variant !== StatTypeVariant.TIME ? (
            <TextInput
              style={GS.input}
              value={defaultValue as string}
              placeholder="Default value"
              placeholderTextColor="grey"
              keyboardType={variant === StatTypeVariant.NUMBER ? 'numeric' : 'default'}
              contextMenuHidden={true}
              onChangeText={changeDefaultValue}
            />
          ) : (
            <TimeInput
              value={defaultValue as number}
              decimals={decimals}
              placeholder="Default time"
              placeholderTextColor="grey"
              dontShowTimeWhenZero
              changeTime={changeDefaultValue}
            />
          ))}
        <Text style={GS.titleText}>Variant</Text>
        <Select
          options={
            passedData?.statType ? [variantOptions.find((el) => el.value === variant)] : variantOptions
          }
          selected={variant}
          onSelect={changeVariant}
        />
        {getIsNumericVariant(variant) && (
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
        {variant === StatTypeVariant.TIME && (
          <View style={{ ...rowStyle, marginTop: smGap, marginBottom: xxsGap, marginLeft: lgGap }}>
            <Text style={GS.largeText}>Decimals:</Text>
            <TextInput
              style={{
                ...GS.input,
                marginLeft: smGap,
                marginBottom: 0,
                paddingHorizontal: 8,
                borderWidth: 2,
                borderBottomWidth: 2,
                fontSize: lgFontSize,
                textAlign: 'center',
              }}
              value={String(decimals)}
              maxLength={1}
              keyboardType="number-pad"
              onKeyPress={changeDecimals}
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
          <View style={{ paddingHorizontal: 20 }}>
            <Checkbox checked={showBest} onChange={setShowBest}>
              Show best values
            </Checkbox>
            <Checkbox checked={showAvg} onChange={setShowAvg}>
              Show the average of all values
            </Checkbox>
            {showAvg && (
              <View style={{ paddingHorizontal: 20 }}>
                <Checkbox checked={exclBestWorst} onChange={setExclBestWorst}>
                  Exclude best and worst time from avg (if &gt;= 4 values)
                </Checkbox>
              </View>
            )}
            <Checkbox checked={showSum} onChange={setShowSum}>
              Show the sum of all values
            </Checkbox>
          </View>
        )}
        {/* Track PBs{variant === StatTypeVariant.TEXT ? ' (manual)' : ''} */}
        {getCanTrackPBs() && (
          <>
            <View style={{ ...justifyRowStyle }}>
              <Checkbox checked={trackPBs} onChange={setTrackPBs}>
                Track PBs
              </Checkbox>
              <View style={{ ...styles.colorSquare, backgroundColor: blue }}></View>
            </View>
            <View style={{ ...justifyRowStyle }}>
              <Checkbox checked={trackYearPBs} onChange={setTrackYearPBs}>
                Track annual PBs
              </Checkbox>
              <View style={{ ...styles.colorSquare, backgroundColor: lightBlue }}></View>
            </View>
            <View style={{ ...justifyRowStyle }}>
              <Checkbox checked={trackMonthPBs} onChange={setTrackMonthPBs}>
                Track monthly PBs
              </Checkbox>
              <View style={{ ...styles.colorSquare, backgroundColor: green }}></View>
            </View>
          </>
        )}
        <Gap size="xl" />
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

const styles = StyleSheet.create({
  colorSquare: {
    width: 20,
    height: 20,
    marginRight: lgGap,
    marginTop: 20, // THIS SHOULDN'T BE NECESSARY, BUT alignItems: 'center' DOESN'T WORK
    borderRadius: 5,
  },
});

export default AddEditStatType;
