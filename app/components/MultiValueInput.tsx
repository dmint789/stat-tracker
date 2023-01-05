import React, { SetStateAction } from 'react';
import { View, TextInput } from 'react-native';
import GS from '../shared/GlobalStyles';

const MultiValueInput: React.FC<{
  values: string[];
  setValues: React.Dispatch<SetStateAction<string[]>>;
  placeholder: string;
  numeric?: boolean;
  allowMultiple?: boolean;
  appendNumber?: boolean;
  setHasUnsavedChanges?: React.Dispatch<SetStateAction<boolean>>;
}> = ({
  values,
  setValues,
  placeholder,
  numeric = false,
  allowMultiple = true,
  appendNumber = false,
  setHasUnsavedChanges,
}) => {
  const updateStatValues = (index: number, value: string) => {
    setValues((prevValues: string[]) => {
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
        const emptyValues = newValues.filter((el) => el === '');

        if (allowMultiple) {
          if (emptyValues.length === 0) {
            newValues.push('');
          } else if (emptyValues.length > 1) {
            for (let i = newValues.length - 1; i >= 0; i--) {
              if (newValues[i] === '' && newValues[i - 1] === '') {
                newValues.pop();
              } else break;
            }
          }
        }

        setHasUnsavedChanges(true);
      }

      return newValues;
    });
  };

  return (
    <View>
      {values.map((value: string, index: number) => (
        <TextInput
          key={String(index)}
          style={GS.input}
          placeholder={placeholder + (appendNumber ? ` ${index + 1}` : '')}
          placeholderTextColor="grey"
          multiline
          keyboardType={numeric ? 'numeric' : 'default'}
          value={value}
          onChangeText={(val: string) => updateStatValues(index, val)}
        />
      ))}
    </View>
  );
};

export default MultiValueInput;
