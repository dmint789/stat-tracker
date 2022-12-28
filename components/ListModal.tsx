import React, { SetStateAction } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<SetStateAction<boolean>>;
  onAddCategory: () => void;
  onOpenImportExport: () => void;
  onOpenAbout: () => void;
};

const ListModal: React.FC<Props> = ({
  modalOpen,
  setModalOpen,
  onAddCategory,
  onOpenImportExport,
  onOpenAbout,
}) => {
  const options = [
    {
      id: 0,
      title: 'Add Stat Category',
      onChoose: () => {
        setModalOpen(false);
        onAddCategory();
      },
    },
    {
      id: 1,
      title: 'Import/Export',
      onChoose: () => {
        setModalOpen(false);
        onOpenImportExport();
      },
    },
    {
      id: 2,
      title: 'About',
      onChoose: () => {
        setModalOpen(false);
        onOpenAbout();
      },
    },
  ];

  return (
    <Modal transparent={true} visible={modalOpen} onRequestClose={() => setModalOpen(false)}>
      <View style={styles.background}>
        {options.map((item) => (
          <TouchableOpacity onPress={item.onChoose} style={styles.item} key={item.id}>
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
