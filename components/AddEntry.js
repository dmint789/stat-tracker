import React, {useState} from 'react';
import {Text, StyleSheet, TextInput, Button, View} from 'react-native';

const AddEntry = ({addEntry}) => {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [date, setDate] = useState('');

  const onChangeName = value => {
    setName(value);
  };

  const onChangeValue = value => {
    setValue(value);
  };

  const onChangeDate = value => {
    setDate(value);
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Name"
        onChangeText={onChangeName}
      />
      <TextInput
        style={styles.input}
        placeholder="Value"
        onChangeText={onChangeValue}
      />
      <TextInput
        style={styles.input}
        placeholder="Date"
        onChangeText={onChangeDate}
      />
      <Button
        onPress={() =>
          addEntry({stats: [{name: name, value: value}], date: date})
        }
        title="Add Entry"
        color="red"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default AddEntry;
