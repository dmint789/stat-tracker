import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import {GlobalStyles} from '../shared/GlobalStyles.js';
import DeleteButton from '../components/DeleteButton.js';

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

  const onSelect = name => {
    submitStatType({name});
  };

  // Submits either the name of the selected stat type or the object of a new stat type
  const submitStatType = statType => {
    addChangeStatType(statType);

    setNewStatName('');
    setStatUnit('');
    setModalOpen(false);
  };

  const unitText = unit => {
    if (unit.length > 0) return `(${unit})`;
    else return '';
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
        <ScrollView keyboardShouldPersistTaps="always">
          <View style={GlobalStyles.modalBackground}>
            {filteredStatTypes.map(item => (
              <TouchableOpacity
                onPress={() => onSelect(item.name)}
                key={Math.random()}>
                <View style={styles.item}>
                  <Text style={styles.text}>
                    {item.name} {unitText(item.unit)}
                  </Text>

                  <DeleteButton onPress={() => deleteStatType(item.name)} />
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
              <View style={{flexDirection: 'row'}}>
                <View style={styles.button}>
                  <Button
                    onPress={() => onAddButtonPressed()}
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  text: {
    color: 'black',
    fontSize: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
});

export default ChooseStatModal;
