import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

const Entry = ({entry, deleteEntry}) => {
  return (
    <View style={styles.item}>
      {entry.stats.map(stat => (
        <Text style={styles.text} key={Math.random()}>
          {stat.name}: {stat.value}
        </Text>
      ))}
      <View style={styles.bottomRow}>
        <Text style={styles.dateText}>{entry.date}</Text>
        <TouchableOpacity onPress={() => deleteEntry(entry.id)}>
          <Icon name="remove" size={20} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'pink',
    marginBottom: 24,
    marginHorizontal: 10,
    padding: 30,
    borderRadius: 10,
  },
  text: {
    color: 'black',
    fontSize: 24,
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
