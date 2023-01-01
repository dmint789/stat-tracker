import React, { useState, useEffect, SetStateAction } from 'react';
import { Modal, View, TextInput, Button, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { addStatCategory, editStatCategory } from '../redux/mainSlice';
import GS from '../shared/GlobalStyles';
import { IStatCategory } from '../shared/DataStructure';

const AddEditCategoryModal: React.FC<{
  prevCategory?: IStatCategory;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<SetStateAction<boolean>>;
}> = ({ prevCategory, modalOpen, setModalOpen }) => {
  const dispatch = useDispatch();

  const { statCategories, lastCategoryId } = useSelector((state: RootState) => state.main);

  const [name, setName] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    // Initialize inputs if we're editing a stat category
    if (prevCategory) {
      setName(prevCategory.name);
      setNote(prevCategory.note);
    } else {
      setName('');
      setNote('');
    }
  }, [modalOpen]);

  const onButtonPressed = () => {
    if (name.length > 0) {
      // Make sure this is not a duplicate stat category
      if (!statCategories.find((el) => el.name === name && el.id !== prevCategory?.id)) {
        if (!prevCategory) {
          dispatch(
            addStatCategory({
              id: lastCategoryId + 1,
              name,
              note,
              lastEntryId: 0,
              lastStatTypeId: 0,
              totalEntries: 0,
            }),
          );
        } else {
          dispatch(
            editStatCategory({
              ...prevCategory,
              name,
              note,
            }),
          );
        }

        setModalOpen(false);
      } else {
        Alert.alert('Error', 'You already have a stat category with this name', [{ text: 'Ok' }]);
      }
    } else {
      Alert.alert('Error', 'Please fill in the name of the stat category', [{ text: 'Ok' }]);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalOpen}
      onRequestClose={() => {
        setModalOpen(false);
      }}
    >
      <View style={GS.modalContainer}>
        <View style={GS.modalBackground}>
          <TextInput
            style={GS.input}
            placeholder="Name"
            placeholderTextColor="grey"
            value={name}
            onChangeText={(value) => setName(value)}
          />
          <TextInput
            style={GS.input}
            placeholder="Note"
            placeholderTextColor="grey"
            value={note}
            onChangeText={(value) => setNote(value)}
            multiline
          />
          <View style={GS.buttonRow}>
            <View style={GS.buttonRowButton}>
              <Button
                onPress={() => onButtonPressed()}
                title={prevCategory ? 'Edit' : 'Add'}
                color={prevCategory ? 'blue' : 'green'}
              />
            </View>
            <View style={GS.buttonRowButton}>
              <Button onPress={() => setModalOpen(false)} title="Cancel" color="grey" />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddEditCategoryModal;
