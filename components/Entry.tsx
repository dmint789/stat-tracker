import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import GS from '../shared/GlobalStyles';
import { getStatValues, getShowStats, getMultiValueStats } from '../shared/GlobalFunctions';
import { IEntry } from '../shared/DataStructures';

import IconButton from './IconButton';

const Entry: React.FC<{
  entry: IEntry;
  onDeleteEntry: (id: number) => void;
  onEditEntry: (entry: IEntry) => void;
}> = ({ entry, onDeleteEntry, onEditEntry }) => {
  const { statTypes } = useSelector((state: RootState) => state.main);

  return (
    <TouchableOpacity onPress={() => onEditEntry(entry)} style={GS.card}>
      {entry.stats.map((stat) => (
        <View key={stat.id}>
          <Text style={GS.text}>
            <Text style={GS.grayText}>
              {statTypes.find((el) => el.id === stat.type)?.name || '(Deleted)'}:{' '}
            </Text>
            {getStatValues(stat, statTypes)}
          </Text>
          {getShowStats(stat, statTypes) && (
            <Text style={{ ...GS.grayText, marginLeft: 14, marginBottom: 8, fontSize: 16 }}>
              {getMultiValueStats(stat, statTypes)}
            </Text>
          )}
        </View>
      ))}
      {entry.comment !== '' && (
        <Text
          style={{
            ...GS.commentText,
            color: entry.stats.length >= 1 ? '#555' : 'black',
          }}
        >
          {entry.comment}
        </Text>
      )}
      <Text style={GS.smallText}>{entry.date.text}</Text>
      <View style={GS.bottomButtons}>
        <IconButton onPress={() => onDeleteEntry(entry.id)} />
      </View>
    </TouchableOpacity>
  );
};

export default Entry;
