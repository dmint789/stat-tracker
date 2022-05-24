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
import DeleteButton from '../components/DeleteButton.js';

const ChooseStatModal = ({
  statModalOpen,
  setStatModalOpen,
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
      setStatModalOpen(false);
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
    setStatModalOpen(false);
  };

  const unitText = unit => {
    if (unit.length > 0) return `(${unit})`;
    else return '';
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={statModalOpen}
      onRequestClose={() => {
        setStatModalOpen(prevStatModalOpen => !prevStatModalOpen);
      }}>
      <View styles={styles.container}>
        <ScrollView>
          <View style={styles.background}>
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
              <View style={styles.inputView}>
                <TextInput
                  style={styles.input}
                  value={newStatName}
                  placeholder="New Stat"
                  placeholderTextColor="grey"
                  onChangeText={value => setNewStatName(value)}
                />
                <TextInput
                  style={styles.input}
                  value={statUnit}
                  placeholder="Unit of measurement"
                  placeholderTextColor="grey"
                  onChangeText={value => setStatUnit(value)}
                />
              </View>
              <View style={styles.buttons}>
                <View style={styles.button}>
                  <Button
                    onPress={() => onButtonPressed()}
                    title="Add"
                    color="green"
                  />
                </View>
                <View style={styles.button}>
                  <Button
                    onPress={() => setStatModalOpen(false)}
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    width: 350,
    //height: 500,
    borderRadius: 30,
    padding: 30,
    marginTop: 100,
    marginBottom: 20,
    alignSelf: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    elevation: 16,
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'pink',
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 10,
  },
  text: {
    color: 'black',
    fontSize: 20,
  },
  inputView: {
    marginVertical: 10,
  },
  input: {
    color: 'black',
    fontSize: 20,
    marginBottom: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  buttons: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
});

export default ChooseStatModal;
