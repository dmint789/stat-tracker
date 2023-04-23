import React, { SetStateAction } from 'react';
import { View, TextInput } from 'react-native';
import GS from '../shared/GlobalStyles';
import { IStatType, StatTypeVariant } from '../shared/DataStructure';
import TimeInput from './TimeInput';

const MultiValueInput: React.FC<{
  values: Array<string | number>;
  setValues: React.Dispatch<SetStateAction<Array<string | number>>>;
  statType?: IStatType;
  placeholder: string;
  numeric?: boolean;
  allowMultiple?: boolean;
  appendNumber?: boolean;
}> = ({
  values,
  setValues,
  statType,
  placeholder,
  numeric = false,
  allowMultiple = true,
  appendNumber = false,
}) => {
  const emptyValue = statType?.variant !== StatTypeVariant.TIME ? '' : 0;

  const updateStatValues = (index: number, value: string | number) => {
    setValues((prevValues: Array<string | number>) => {
      let updated = false;
      let newValues = prevValues.map((prevValue, i) => {
        if (i === index) {
          if (value !== prevValue) {
            updated = true;
            return value;
          } else return prevValue;
        } else return prevValue;
      });

      if (updated) {
        const emptyValues = newValues.filter((el) => el === emptyValue);

        if (allowMultiple) {
          if (emptyValues.length === 0) {
            newValues.push(emptyValue);
          } else if (emptyValues.length > 1) {
            for (let i = newValues.length - 1; i >= 0; i--) {
              if (newValues[i] === emptyValue && newValues[i - 1] === emptyValue) {
                newValues.pop();
              } else break;
            }
          }
        }
      }

      return newValues;
    });
  };

  return (
    <View>
      {values.map((value: string | number, index: number) =>
        statType?.variant !== StatTypeVariant.TIME ? (
          <TextInput
            key={String(index)}
            style={GS.input}
            placeholder={placeholder + (appendNumber ? ` ${index + 1}` : '')}
            placeholderTextColor="grey"
            multiline
            keyboardType={numeric ? 'numeric' : 'default'}
            value={String(value)}
            onChangeText={(val: string) => updateStatValues(index, val)}
          />
        ) : (
          <TimeInput
            key={String(index)}
            value={value as number}
            decimals={statType.decimals}
            dontShowTimeWhenZero
            changeTime={(newValue: number) => updateStatValues(index, newValue)}
          />
        ),
      )}
    </View>
  );
};

export default MultiValueInput;
