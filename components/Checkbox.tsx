import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import GS from '../shared/GlobalStyles';

type Props = {
  children: any;
  checked: boolean;
  onChange: (value: boolean) => void;
};

const Checkbox: React.FC<Props> = ({ children, checked, onChange }) => {
  return (
    <TouchableOpacity onPress={() => onChange(!checked)} style={styles.checkboxContainer}>
      <View style={styles.checkbox}>{checked && <Icon name="check" size={24} color="red" />}</View>
      <Text style={GS.blackText}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  checkbox: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: 30,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: 'pink',
  },
});

export default Checkbox;
