import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {GlobalStyles} from '../shared/GlobalStyles.js';
import DeleteButton from '../components/DeleteButton.js';

const StatCategory = ({statCategory, onPress}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(statCategory)}
      style={GlobalStyles.card}>
      <Text style={styles.text}>{statCategory}</Text>
      {/* <DeleteButton onPress={() => deleteStatType(item.name)} /> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    color: 'black',
    fontSize: 20,
  },
});

export default StatCategory;
