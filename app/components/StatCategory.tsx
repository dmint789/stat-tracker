import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import GS from '../shared/GlobalStyles';
import { IStatCategory } from '../shared/DataStructure';

import IconButton from './IconButton';

type Props = {
  category: IStatCategory;
  onPress: (category: IStatCategory) => void;
  onEdit: (category: IStatCategory) => void;
  onDelete: (category: IStatCategory) => void;
};

const StatCategory: React.FC<Props> = ({ category, onPress, onEdit, onDelete }) => {
  const getEntriesText = () => {
    return category.totalEntries !== 1 ? `${category.totalEntries} entries` : '1 entry';
  };

  return (
    <TouchableOpacity onPress={() => onPress(category)} style={GS.bigCard}>
      <Text style={styles.titleText}>{category.name}</Text>
      {category.note !== '' && <Text style={GS.commentText}>{category.note}</Text>}
      <Text style={GS.smallGrayText}>{getEntriesText()}</Text>
      <View style={GS.cardButtons}>
        <IconButton type={'pencil'} color={'gray'} onPress={() => onEdit(category)} />
        <IconButton onPress={() => onDelete(category)} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  titleText: {
    marginBottom: 6,
    textAlign: 'center',
    fontSize: 24,
    color: 'black',
  },
});

export default StatCategory;
