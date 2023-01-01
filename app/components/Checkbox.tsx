import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import GS from '../shared/GlobalStyles';

type Props = {
  children: any;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
};

const Checkbox: React.FC<Props> = ({ children, checked, disabled = false, onChange }) => {
  const onPress = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    // 0.2 is the default activeOpacity in React Native
    <TouchableOpacity onPress={onPress} activeOpacity={disabled ? 1 : 0.2} style={styles.checkboxContainer}>
      <View style={{ ...styles.checkbox, backgroundColor: disabled ? 'lightgray' : 'pink' }}>
        {checked && <Icon name="check" size={24} color={disabled ? 'gray' : 'red'} />}
      </View>
      <Text style={GS.text}>{children}</Text>
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
  },
});

export default Checkbox;
