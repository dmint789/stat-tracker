import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {GlobalStyles} from '../shared/GlobalStyles.js';
import DeleteButton from '../components/DeleteButton.js';

const Entry = ({entry, statTypes, deleteEntry, onEditEntry}) => {
  // Get the unit for the given stat using the list of stat types
  const getUnit = statName => {
    for (let type of statTypes) {
      if (type.name === statName) return type.unit;
    }
    return '';
  };

  return (
    <TouchableOpacity onPress={() => onEditEntry(entry.id)} style={styles.item}>
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
        <DeleteButton onPress={() => deleteEntry(entry.id)} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'pink',
    marginTop: 12,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 10,
  },
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
