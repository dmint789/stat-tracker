import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';

const MyButton = ({children, onPress}) => {
  return (
    <TouchableOpacity style={styles.myButton} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  myButton: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 8,
    width: 40,
    height: 40,
    borderRadius: 10,
  },
});

export default MyButton;
