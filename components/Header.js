import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {GlobalStyles} from '../GlobalStyles.js';

const Header = ({onOpenAddEntry}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Stat Tracker</Text>
      <TouchableOpacity
        style={GlobalStyles.button}
        onPress={() => onOpenAddEntry()}>
        <Icon name="plus" size={30} color="red" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    //height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'red',
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },
});

export default Header;
