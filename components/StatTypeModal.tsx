import React, { SetStateAction } from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, Button, StyleSheet } from 'react-native';
import GS from '../shared/GlobalStyles';
import { IStatType } from '../shared/DataStructures';

import IconButton from './IconButton';

type Props = {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<SetStateAction<boolean>>;
  filteredStatTypes: IStatType[];
  selectStatType: (id: number) => void;
  onAddStatType: () => void;
  onEditStatType: (statType: IStatType) => void;
  onDeleteStatType: (statType: IStatType) => void;
};

const ChooseStatModal: React.FC<Props> = ({
  modalOpen,
  setModalOpen,
  filteredStatTypes,
  selectStatType,
  onAddStatType,
  onEditStatType,
  onDeleteStatType,
}) => {
  const submitStatType = (statType: IStatType) => {
    selectStatType(statType.id);
    setModalOpen(false);
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
        <ScrollView keyboardShouldPersistTaps="always">
          <View style={GS.modalBackground}>
            {filteredStatTypes.map((item) => (
              <TouchableOpacity onPress={() => submitStatType(item)} key={item.id}>
                <View style={GS.smallCard}>
                  <Text style={{ ...GS.text, flex: 1 }}>
                    {item.name}
                    {item?.unit && ` (${item.unit})`}
                  </Text>
                  <IconButton type={'pencil'} color={'gray'} onPress={() => onEditStatType(item)} />
                  <IconButton onPress={() => onDeleteStatType(item)} />
                </View>
              </TouchableOpacity>
            ))}

            <View style={GS.buttonRow}>
              <View style={GS.button}>
                <Button onPress={onAddStatType} title="New" color="green" />
              </View>
              <View style={GS.button}>
                <Button onPress={() => setModalOpen(false)} title="Cancel" color="grey" />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default ChooseStatModal;
