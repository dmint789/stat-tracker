import React, {useState, useEffect, SetStateAction} from 'react';
import {Modal, View, TextInput, Button, Alert} from 'react-native';
import GS from '../shared/GlobalStyles.js';
import {IStatCategory} from '../shared/DataStructure';
import {updateExpression} from '@babel/types';

type Props = {
  categories: IStatCategory[];
  prevCategory: IStatCategory;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<SetStateAction<boolean>>;
  onAddCategory: (category: IStatCategory) => void;
  onEditCategory: (
    prevCategory: IStatCategory,
    category: IStatCategory,
  ) => void;
};

const AddEditCategoryModal: React.FC<Props> = ({
  categories,
  prevCategory,
  modalOpen,
  setModalOpen,
  onAddCategory,
  onEditCategory,
}) => {
  const [name, setName] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    // Initialize inputs if we're editing a stat category
    if (prevCategory) {
      setName(prevCategory.name);
      setNote(prevCategory.note);
    }
  }, [modalOpen]);

  const onButtonPressed = () => {
    if (name.length > 0) {
      // Make sure this is not a duplicate stat category
      if (!categories.find(item => item.name === name && item.note === note)) {
        if (!prevCategory) {
          onAddCategory({name, note, lastId: 0, totalEntries: 0});
        } else {
          const updatedCategory: IStatCategory = {
            name,
            note,
            lastId: prevCategory.lastId,
            totalEntries: prevCategory.lastId,
          };
          onEditCategory(prevCategory, updatedCategory);
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
      <View style={GS.modalContainer}>
        <View style={GS.modalBackground}>
          <TextInput
            style={GS.input}
            placeholder="Name"
            placeholderTextColor="grey"
            value={name}
            onChangeText={value => setName(value)}
          />
          <TextInput
            style={GS.input}
            placeholder="Note"
            placeholderTextColor="grey"
            value={note}
            onChangeText={value => setNote(value)}
            multiline
          />
          <View style={GS.buttonRow}>
            <View style={GS.button}>
              <Button
                onPress={() => onButtonPressed()}
                title={prevCategory ? 'Edit' : 'Add'}
                color={prevCategory ? 'blue' : 'green'}
              />
            </View>
            <View style={GS.button}>
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

export default AddEditCategoryModal;
