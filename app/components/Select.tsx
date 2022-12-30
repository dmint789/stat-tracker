import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import GS from '../shared/GlobalStyles';
import { ISelectOption } from '../shared/DataStructures';

type Props = {
  options: ISelectOption[];
  selected: number; // corresponds to the value field of ISelectOption
  onSelect: (value: number) => void;
};

const Select: React.FC<Props> = ({ options, selected, onSelect }) => {
  return (
    <View>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          onPress={() => onSelect(option.value)}
          style={{
            ...GS.smallCard,
            backgroundColor: option.value === selected ? 'red' : 'pink',
          }}
        >
          <Text style={option.value === selected ? GS.whiteText : GS.blackText}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Select;