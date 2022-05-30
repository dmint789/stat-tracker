import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {GlobalStyles} from '../shared/GlobalStyles.js';
import DeleteButton from '../components/DeleteButton.js';

const StatCategory = ({statCategory, onPress, onDelete}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(statCategory)}
      style={{...GlobalStyles.card, ...styles.card}}>
      <Text style={styles.text}>{statCategory}</Text>
      <DeleteButton onPress={() => onDelete(statCategory)} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: 'black',
    fontSize: 20,
  },
});

export default StatCategory;
