import React, { SetStateAction, useState } from 'react';
import { Alert, Button, Modal, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { reorderStatTypes, deleteStatType } from '../redux/mainSlice';
import GS from '../shared/GlobalStyles';
import { IStatType } from '../shared/DataStructure';

import IconButton from './IconButton';

const ChooseStatModal: React.FC<{
  modalOpen: boolean;
  setStatModalOpen: React.Dispatch<SetStateAction<boolean>>;
  filteredStatTypes: IStatType[];
  selectStatType: (id: number) => void;
  onAddStatType: () => void;
  onEditStatType: (statType: IStatType) => void;
}> = ({ modalOpen, setStatModalOpen, filteredStatTypes, selectStatType, onAddStatType, onEditStatType }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { statTypes } = useSelector((state: RootState) => state.main);

  const [reordering, setReordering] = useState<boolean>(false);

  const submitStatType = (statType: IStatType) => {
    selectStatType(statType.id);
    setReordering(false);
    setStatModalOpen(false);
  };

  const onDeleteStatType = (statType: IStatType) => {
    Alert.alert('Confirmation', `Are you sure you want to delete the stat type ${statType.name}?`, [
      { text: 'Cancel' },
      {
        text: 'Ok',
        onPress: () => {
          dispatch(deleteStatType(statType.id));

          // -1, because it won't be updated until the next tick
          if (statTypes.length - 1 === 0) {
            setStatModalOpen(false);
          }
        },
      },
    ]);
  };

  const onReorder = (statType: IStatType, up: boolean) => {
    if ((up && statType.order !== 1) || (!up && statType.order !== statTypes.length)) {
      dispatch(reorderStatTypes({ statType, up }));
    }
  };

  const onCancel = () => {
    setReordering(false);
    setStatModalOpen(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={modalOpen}
      onRequestClose={() => {
        setStatModalOpen(false);
      }}
    >
      <View style={GS.modalContainer}>
        <ScrollView keyboardShouldPersistTaps="always">
          <View style={GS.modalBackground}>
            {filteredStatTypes.length === statTypes.length && statTypes.length > 1 && (
              <TouchableOpacity onPress={() => setReordering((prevReordering) => !prevReordering)}>
                <Text style={{ ...GS.text, marginBottom: 16, textAlign: 'right', color: 'blue' }}>
                  {reordering ? 'Done' : 'Reorder'}
                </Text>
              </TouchableOpacity>
            )}
            {filteredStatTypes.map((item) => (
              <TouchableOpacity onPress={() => submitStatType(item)} key={item.id}>
                <View style={GS.smallCard}>
                  <Text style={{ ...GS.text, flex: 1 }}>
                    {item.name}
                    {item?.unit && ` (${item.unit})`}
                  </Text>
                  {!reordering ? (
                    <>
                      <IconButton type={'pencil'} color={'gray'} onPress={() => onEditStatType(item)} />
                      <IconButton onPress={() => onDeleteStatType(item)} />
                    </>
                  ) : (
                    <>
                      <IconButton
                        type={'arrow-down'}
                        color={item.order !== statTypes.length ? 'red' : 'pink'}
                        onPress={() => onReorder(item, false)}
                      />
                      <IconButton
                        type={'arrow-up'}
                        color={item.order !== 1 ? 'red' : 'pink'}
                        onPress={() => onReorder(item, true)}
                      />
                    </>
                  )}
                </View>
              </TouchableOpacity>
            ))}

            <View style={GS.buttonRow}>
              <View style={GS.button}>
                <Button onPress={onAddStatType} title="New" color="green" />
              </View>
              <View style={GS.button}>
                <Button onPress={onCancel} title="Cancel" color="grey" />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default ChooseStatModal;
