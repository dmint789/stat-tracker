import React from 'react';
import {StyleSheet, View, TouchableOpacity, FlatList, Text} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

const WorkingEntryList = ({stats, deleteStat}) => {
  return (
    <View style={styles.container}>
      {stats.map(item => (
        <View style={styles.stat} key={item.id}>
          <Text style={styles.text}>
            {item.name}: {item.value}
          </Text>
          {/* This is a copy from Entry.js! Make a component and import it */}
          <TouchableOpacity onPress={() => deleteStat(item.id)}>
            <Icon name="remove" size={20} color="red" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 40,
  },
  stat: {
    //flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
  text: {
    color: 'black',
    fontSize: 20,
    marginBottom: 10,
  },
});

export default WorkingEntryList;
