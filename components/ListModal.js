import React from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const ListModal = ({modalOpen, setModalOpen, onAddCategory, onOpenAbout}) => {
  const options = [
    {
      title: 'Add Stat Category',
      onChoose: () => {
        setModalOpen(false);
        onAddCategory();
      },
    },
    {
      title: 'About',
      onChoose: () => {
        setModalOpen(false);
        onOpenAbout();
      },
    },
  ];

  return (
    <Modal
      transparent={true}
      visible={modalOpen}
      onRequestClose={() => {
        setModalOpen(false);
      }}>
      <View style={styles.background}>
        {options.map(item => (
          <TouchableOpacity
            onPress={() => {
              item.onChoose();
            }}
            style={styles.item}
            key={Math.random()}>
            <Text style={styles.text}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  background: {
    width: '70%',
    paddingVertical: 0,
    marginTop: 60,
    alignSelf: 'flex-end',
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    elevation: 8,
    backgroundColor: '#fff',
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: '#bbb',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default ListModal;
