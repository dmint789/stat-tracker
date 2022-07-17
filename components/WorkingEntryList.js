import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import GS from '../shared/GlobalStyles.js';

import IconButton from './IconButton.js';

const WorkingEntryList = ({stats, statTypes, deleteEditStat}) => {
  // Copied from Entry.js
  const getUnit = statName => {
    for (let type of statTypes) {
      if (type.name === statName) return type.unit;
    }
    return '';
  };

  const onDelete = name => {
    deleteEditStat({name});
  };

  return (
    <View style={styles.container}>
      {stats.map(item => (
        <View style={styles.stat} key={Math.random()}>
          <TouchableOpacity
            style={{flex: 1}}
            onPress={() => deleteEditStat(item, true)}>
            <Text style={GS.text}>
              <Text style={GS.nameText}>{item.name}: </Text>
              {item.value} {getUnit(item.name)}
            </Text>
          </TouchableOpacity>

          <IconButton onPress={() => onDelete(item.name)} />
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
