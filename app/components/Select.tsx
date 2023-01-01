import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import GS from '../shared/GlobalStyles';
import { ISelectOption } from '../shared/DataStructure';

type Props = {
  options: ISelectOption[];
  selected: number; // corresponds to the value field of ISelectOption
  onSelect: (value: number) => void;
  horizontal?: boolean;
};

const Select: React.FC<Props> = ({ options, selected, onSelect, horizontal = false }) => {
  return (
    <View style={horizontal ? { flexDirection: 'row', justifyContent: 'space-between' } : {}}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          onPress={() => onSelect(option.value)}
          style={{
            ...GS.smallCard,
            backgroundColor: option.value === selected ? 'red' : 'pink',
          }}
        >
          <Text style={option.value === selected ? GS.whiteText : GS.text}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Select;
