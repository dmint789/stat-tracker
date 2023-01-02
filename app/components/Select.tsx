import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import GS from '../shared/GlobalStyles';
import { ISelectOption, SelectColor } from '../shared/DataStructure';

type Props = {
  options: ISelectOption[];
  selected: number; // corresponds to the value field of ISelectOption
  onSelect: (value: number) => void;
  horizontal?: boolean;
};

const Select: React.FC<Props> = ({ options, selected, onSelect, horizontal = false }) => {
  const getColor = (option: ISelectOption): string => {
    if (option.value === selected) {
      return option.color || 'red';
    } else {
      switch (option.color) {
        case 'gray':
          return 'lightgray';
        default:
          return 'pink';
      }
    }
  };

  return (
    <View style={horizontal ? { flexDirection: 'row', justifyContent: 'space-between' } : {}}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          onPress={() => onSelect(option.value)}
          style={{
            ...GS.smallCard,
            backgroundColor: getColor(option),
          }}
        >
          <Text style={option.value === selected ? GS.whiteText : GS.text}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Select;
