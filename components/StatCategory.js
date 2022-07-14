import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {GlobalStyles} from '../shared/GlobalStyles.js';
import IconButton from '../components/IconButton.js';

const StatCategory = ({statCategory, onPress, onEdit, onDelete}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(statCategory)}
      style={GlobalStyles.card}>
      <Text style={styles.titleText}>{statCategory.name}</Text>
      {statCategory.note !== '' && (
        <Text
          style={{...GlobalStyles.commentText, marginTop: 6, marginBottom: 24}}>
          {statCategory.note}
        </Text>
      )}
      <View style={GlobalStyles.bottomButtons}>
        <IconButton
          type={'pencil'}
          color={'gray'}
          onPress={() => onEdit(statCategory)}
        />
        <IconButton onPress={() => onDelete(statCategory.name)} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  titleText: {
    textAlign: 'center',
    fontSize: 24,
    color: 'black',
  },
});

export default StatCategory;
