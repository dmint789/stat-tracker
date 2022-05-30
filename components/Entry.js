import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {GlobalStyles} from '../shared/GlobalStyles.js';
import DeleteButton from '../components/DeleteButton.js';

const Entry = ({entry, statTypes, onDelete, onEditEntry}) => {
  // Get the unit for the given stat using the list of stat types
  const getUnit = statName => {
    for (let type of statTypes) {
      if (type.name === statName) return type.unit;
    }
    return '';
  };

  return (
    <TouchableOpacity
      onPress={() => onEditEntry(entry.id)}
      style={GlobalStyles.card}>
      {entry.stats.map(stat => (
        <Text style={GlobalStyles.valueText} key={Math.random()}>
          <Text style={GlobalStyles.nameText}>{stat.name}: </Text>
          {stat.value} {getUnit(stat.name)}
        </Text>
      ))}
      {entry.comment != '' && (
        <Text style={styles.comment}>{entry.comment}</Text>
      )}
      <View style={styles.bottomRow}>
        <Text style={styles.dateText}>{entry.date.text}</Text>
        <DeleteButton onPress={() => onDelete(entry.id)} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  comment: {
    color: '#555',
    fontSize: 17,
    marginTop: 4,
    marginBottom: 10,
  },
  dateText: {
    color: 'grey',
    fontSize: 16,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Entry;
