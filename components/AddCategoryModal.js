import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import {GlobalStyles} from '../shared/GlobalStyles.js';

const AddCategoryModal = ({
  statCategories,
  modalOpen,
  setModalOpen,
  onAddCategory,
}) => {
  const [statCategory, setStatCategory] = useState('');

  const onButtonPressed = () => {
    if (statCategory.length > 0) {
      // Make sure this is not a duplicate stat category
      if (!statCategories.find(item => item === statCategory)) {
        onAddCategory(statCategory);
        setStatCategory('');
        setModalOpen(false);
      } else {
        Alert.alert(
          'Error',
          'You already have a stat category with this name!',
          [{text: 'Ok'}],
        );
      }
    } else {
      Alert.alert('Error', 'Please fill in the name of the new stat category', [
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
      <View styles={GlobalStyles.modalContainer}>
        <View style={GlobalStyles.modalBackground}>
          <TextInput
            style={GlobalStyles.input}
            value={statCategory}
            placeholder="Stat category"
            placeholderTextColor="grey"
            onChangeText={value => setStatCategory(value)}
          />
          <View style={{flexDirection: 'row'}}>
            <View style={styles.button}>
              <Button
                onPress={() => onButtonPressed()}
                title="Add"
                color="green"
              />
            </View>
            <View style={styles.button}>
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

const styles = StyleSheet.create({
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
});

export default AddCategoryModal;
