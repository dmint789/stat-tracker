import React, { SetStateAction, useState } from 'react';
import { Alert, Button, Modal, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { reorderStatTypes, deleteStatType } from '../redux/mainSlice';
import GS, { smGap } from '../shared/GlobalStyles';
import { formatIDate } from '../shared/GlobalFunctions';
import { IStatType } from '../shared/DataStructure';

import IconButton from './IconButton';

const ChooseStatModal: React.FC<{
  modalOpen: boolean;
  setStatModalOpen: React.Dispatch<SetStateAction<boolean>>;
  filteredStatTypes: IStatType[];
  selectStatType: (statType: IStatType) => void;
  onAddEditStatType: (statType?: IStatType) => void;
}> = ({ modalOpen, setStatModalOpen, filteredStatTypes, selectStatType, onAddEditStatType }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { statTypes, entries } = useSelector((state: RootState) => state.main);

  const [reordering, setReordering] = useState<boolean>(false);

  const submitStatType = (statType: IStatType) => {
    selectStatType(statType);
    setReordering(false);
    setStatModalOpen(false);
  };

  const onDeleteStatType = (statType: IStatType) => {
    let message = `Are you sure you want to delete the stat type ${statType.name}?`;
    const orphanEntries = entries.filter((el) => !!el.stats.find((st) => st.type === statType.id));

    if (orphanEntries.length > 0) {
      if (orphanEntries.length === 1)
        message += ` You have an entry from ${formatIDate(orphanEntries[0].date, '.')} that uses it!`;
      else {
        message += ` You have ${orphanEntries.length} entries that use it! They were made on these dates: `;
        const iterations = Math.min(3, orphanEntries.length);
        for (let i = 0; i < iterations; i++) {
          message += formatIDate(orphanEntries[i].date, '.');
          message += i !== iterations - 1 ? ', ' : orphanEntries.length > 3 ? ' ...' : '';
        }
      }
    }

    Alert.alert(orphanEntries.length === 0 ? 'Confirmation' : 'WARNING!', message, [
      { text: 'Cancel' },
      {
        text: 'Ok',
        onPress: () => {
          dispatch(deleteStatType(statType.id));

          // -1, because it won't be updated until the next tick
          if (statTypes.length - 1 === 0) setStatModalOpen(false);
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
        <View style={GS.modalBackground}>
          {filteredStatTypes.length === statTypes.length && statTypes.length > 1 && (
            <TouchableOpacity onPress={() => setReordering((prevReordering) => !prevReordering)}>
              <Text style={{ ...GS.text, marginBottom: smGap, textAlign: 'right', color: 'blue' }}>
                {reordering ? 'Done' : 'Reorder'}
              </Text>
            </TouchableOpacity>
          )}
          <ScrollView keyboardShouldPersistTaps="always">
            {filteredStatTypes.map((item) => (
              <TouchableOpacity onPress={() => submitStatType(item)} key={item.id}>
                <View style={GS.smallCard}>
                  <Text style={{ ...GS.text, flex: 1 }}>
                    {item.name}
                    {item?.unit && ` (${item.unit})`}
                  </Text>
                  {!reordering ? (
                    <>
                      <IconButton type={'pencil'} color={'gray'} onPress={() => onAddEditStatType(item)} />
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
          </ScrollView>

          <View style={GS.buttonRow}>
            <View style={GS.buttonRowButton}>
              <Button onPress={() => onAddEditStatType()} title="New" color="green" />
            </View>
            <View style={GS.buttonRowButton}>
              <Button onPress={onCancel} title="Cancel" color="grey" />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ChooseStatModal;
