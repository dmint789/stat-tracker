import React, {useState, useEffect} from 'react';
import {Modal, View, TextInput, Button, Alert} from 'react-native';
import {GlobalStyles} from '../shared/GlobalStyles.js';

const AddCategoryModal = ({
  statCategories,
  prevStatCategory,
  modalOpen,
  setModalOpen,
  onAddCategory,
  onEditCategory,
}) => {
  const [name, setName] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    // Initialize inputs if we're editing a stat category
    if (prevStatCategory) {
      setName(prevStatCategory.name);
      setNote(prevStatCategory.note);
    }
  }, [modalOpen]);

  const onButtonPressed = () => {
    if (name.length > 0) {
      // Make sure this is not a duplicate stat category
      if (
        !statCategories.find(item => item.name === name && item.note === note)
      ) {
        if (!prevStatCategory) {
          onAddCategory({name, note});
        } else {
          onEditCategory({name, note}, prevStatCategory);
        }

        setName('');
        setNote('');
        setModalOpen(false);
      } else {
        Alert.alert(
          'Error',
          'You already have a stat category with this name and note!',
          [{text: 'Ok'}],
        );
      }
    } else {
      Alert.alert('Error', 'Please fill in the name of the stat category', [
        {text: 'Ok'},
      ]);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalOpen}
      onRequestClose={() => {
        setModalOpen(false);
      }}>
      <View style={GlobalStyles.modalContainer}>
        <View style={GlobalStyles.modalBackground}>
          <TextInput
            style={GlobalStyles.input}
            placeholder="Name"
            placeholderTextColor="grey"
            value={name}
            onChangeText={value => setName(value)}
          />
          <TextInput
            style={GlobalStyles.input}
            placeholder="Note"
            placeholderTextColor="grey"
            value={note}
            onChangeText={value => setNote(value)}
            multiline
          />
          <View style={GlobalStyles.buttonRow}>
            <View style={GlobalStyles.button}>
              <Button
                onPress={() => onButtonPressed()}
                title={prevStatCategory ? 'Edit' : 'Add'}
                color={prevStatCategory ? 'blue' : 'green'}
              />
            </View>
            <View style={GlobalStyles.button}>
              <Button
                onPress={() => setModalOpen(false)}
                title="Cancel"
                color="grey"
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddCategoryModal;
