import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

const IconButton = ({
  type = 'remove',
  color = 'red',
  onPress,
  bigHitbox = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={bigHitbox ? styles.bigButton : styles.button}>
      <Icon name={type} size={24} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
  },
  bigButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
  },
});

export default IconButton;
