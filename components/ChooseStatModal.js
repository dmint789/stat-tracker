import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import {GlobalStyles} from '../shared/GlobalStyles.js';
import IconButton from './IconButton.js';

const ChooseStatModal = ({
  modalOpen,
  setModalOpen,
  statTypes,
  filteredStatTypes,
  addChangeStatType,
  deleteStatType,
}) => {
  const [newStatName, setNewStatName] = useState('');
  const [statUnit, setStatUnit] = useState('');

  const onAddButtonPressed = () => {
    if (newStatName.length > 0) {
      if (!statTypes.find(item => item.name === newStatName))
        submitStatType({name: newStatName, unit: statUnit});
      else {
        Alert.alert('Error', 'A stat type with that name already exists!', [
          {text: 'Ok'},
        ]);
      }
    } else {
      Alert.alert('Error', 'Please fill in the name of the new stat type', [
        {text: 'Ok'},
      ]);
    }
  };

  // Submits either the name of the selected stat type or the object of a new stat type
  const submitStatType = statType => {
    addChangeStatType(statType);

    setNewStatName('');
    setStatUnit('');
    setModalOpen(false);
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
        <ScrollView keyboardShouldPersistTaps="always">
          <View style={GlobalStyles.modalBackground}>
            {filteredStatTypes.map(item => (
              <TouchableOpacity
                onPress={() => submitStatType({name: item.name})}
                key={Math.random()}>
                <View style={styles.item}>
                  <Text style={{...GlobalStyles.text, flex: 1}}>
                    {item.name}
                    {item.unit.length > 0 ? item.unit + ' ' : ''}
                  </Text>
                  <IconButton onPress={() => deleteStatType(item.name)} />
                </View>
              </TouchableOpacity>
            ))}

            <View>
              <View style={{marginVertical: 10}}>
                <TextInput
                  style={GlobalStyles.input}
                  value={newStatName}
                  placeholder="New Stat"
                  placeholderTextColor="grey"
                  onChangeText={value => setNewStatName(value)}
                />
                <TextInput
                  style={GlobalStyles.input}
                  value={statUnit}
                  placeholder="Unit of measurement"
                  placeholderTextColor="grey"
                  onChangeText={value => setStatUnit(value)}
                />
              </View>
              <View style={GlobalStyles.buttonRow}>
                <View style={GlobalStyles.button}>
                  <Button
                    onPress={() => onAddButtonPressed()}
                    title="Add"
                    color="green"
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
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'pink',
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
});

export default ChooseStatModal;
