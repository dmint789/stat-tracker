import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import DeleteButton from '../components/DeleteButton.js';

const Entry = ({entry, statTypes, deleteEntry}) => {
  // Get the unit for the given stat using the list of stat types
  const getUnit = statName => {
    for (let type of statTypes) {
      if (type.name === statName) return type.unit;
    }
    return '';
  };

  return (
    <View style={styles.item}>
      {entry.stats.map(stat => (
        <Text style={styles.text} key={Math.random()}>
          {stat.name}: {stat.value} {getUnit(stat.name)}
        </Text>
      ))}
      {entry.comment != '' && (
        <Text style={styles.comment}>{entry.comment}</Text>
      )}
      <View style={styles.bottomRow}>
        <Text style={styles.dateText}>{entry.date}</Text>
        <DeleteButton onPress={() => deleteEntry(entry.id)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'pink',
    marginTop: 20,
    marginHorizontal: 20,
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 10,
  },
  text: {
    color: 'black',
    fontSize: 20,
    marginBottom: 10,
  },
  comment: {
    color: '#444',
    fontSize: 18,
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
