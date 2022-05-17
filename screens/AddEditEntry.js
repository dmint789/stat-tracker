import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  TextInput,
  Button,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

const AddEditEntry = ({navigation}) => {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [date, setDate] = useState('');
  const [comment, setComment] = useState('');

  const onChangeName = value => {
    setName(value);
  };

  const onChangeValue = value => {
    setValue(value);
  };

  const onChangeDate = value => {
    setDate(value);
  };

  const onChangeComment = value => {
    setComment(value);
  };

  const addEntry = () => {
    navigation.navigate('Home', {
      stats: [{name: name, value: value}],
      comment: comment,
      date: date,
    });
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}>
      <View style={styles.container}>
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

        {/* Comment */}
        <TextInput
          style={styles.input}
          placeholder="Comment"
          onChangeText={onChangeComment}
        />
        {/* Date */}
        <TextInput
          style={styles.input}
          placeholder="Date"
          onChangeText={onChangeDate}
        />
        {/* Make title conditional */}
        <Button onPress={() => addEntry()} title="Add Entry" color="red" />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default AddEditEntry;
