import React, {useState} from 'react';
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
  setNewStatType,
  deleteStatType,
}) => {
  const [newStatName, setNewStatName] = useState('');
  const [statUnit, setStatUnit] = useState('');

  const onButtonPressed = () => {
    if (newStatName.length > 0) {
      setNewStatType(statTypes.length, {name: newStatName, unit: statUnit});
      setNewStatName('');
      setStatUnit('');
      setModalOpen(false);
    } else {
      Alert.alert('Error', 'Please fill in the name of the new stat', [
        {text: 'Ok'},
      ]);
    }
  };

  const onStatChosen = name => {
    for (let i = 0; i < statTypes.length; i++) {
      if (statTypes[i].name === name) {
        setNewStatType(i);
        break;
      }
    }

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
        <ScrollView>
          <View style={GlobalStyles.modalBackground}>
            {statTypes.map(item => (
              <TouchableOpacity
                onPress={() => onStatChosen(item.name)}
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
