import React from 'react';
import {StyleSheet, View, TouchableOpacity, FlatList, Text} from 'react-native';
import {GlobalStyles} from '../shared/GlobalStyles.js';
import DeleteButton from './DeleteButton.js';

const WorkingEntryList = ({stats, statTypes, deleteStat}) => {
  // Copied from Entry.js
  const getUnit = statName => {
    for (let type of statTypes) {
      if (type.name === statName) return type.unit;
    }
    return '';
  };

  return (
    <View style={styles.container}>
      {stats.map(item => (
        <View style={styles.stat} key={Math.random()}>
          <Text style={GlobalStyles.valueText}>
            <Text style={GlobalStyles.nameText}>{item.name}: </Text>
            {item.value} {getUnit(item.name)}
          </Text>
          {/* This is a copy from Entry.js! Make a component and import it */}
          <DeleteButton onPress={() => deleteStat(item.name)} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 6,
  },
  stat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
});

export default WorkingEntryList;
