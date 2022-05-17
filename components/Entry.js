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
      {entry.comment != '' && (
        <Text style={styles.comment}>{entry.comment}</Text>
      )}
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
