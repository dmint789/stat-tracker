import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import GS from '../shared/GlobalStyles';
import { IEntry, IStatType, IMultiValueStat } from '../shared/DataStructures';

import IconButton from './IconButton';

const Entry: React.FC<{
  entry: IEntry;
  onDeleteEntry: (entry: IEntry) => void;
  onEditEntry: (entry: IEntry) => void;
}> = ({ entry, onDeleteEntry, onEditEntry }) => {
  const { statTypes } = useSelector((state: RootState) => state.main);

  const getValueTextElement = (
    value: string | number,
    statType: IStatType,
    key = null as 'best' | 'avg' | 'sum',
  ) => {
    const isPB =
      statType?.trackPBs &&
      ((!key && statType.pbs?.allTime.entryId === entry.id) ||
        (key &&
          statType.pbs?.allTime.entryId[key] === entry.id &&
          statType.pbs?.allTime.result[key] === value));

    return <Text style={isPB ? styles.pbStyle : {}}>{value}</Text>;
  };

  return (
    <TouchableOpacity onPress={() => onEditEntry(entry)} style={GS.card}>
      {entry.stats.map((stat) => {
        const statType = statTypes.find((el) => el.id === stat.type);

        // Best/avg/sum should be shown if needed and if there are multiple values or the best/avg/sum is a PB
        const showBest = statType?.showBest && stat.values.length > 1;
        const showAvg =
          statType?.showAvg &&
          (stat.values.length > 1 || (statType.pbs?.allTime.entryId as IMultiValueStat)?.avg === entry.id);
        const showSum =
          statType?.showSum &&
          (stat.values.length > 1 || (statType.pbs?.allTime.entryId as IMultiValueStat)?.sum === entry.id);

        return (
          <View key={stat.id}>
            <Text style={GS.text}>
              <Text style={GS.grayText}>{statType?.name || '(Deleted)'}: </Text>
              {stat.values.map((value, i) => (
                <Text key={i}>
                  {getValueTextElement(value, statType, statType?.multipleValues ? 'best' : null)}
                  {i !== stat.values.length - 1 && ', '}
                </Text>
              ))}
            </Text>
            {(showBest || showAvg || showSum) && (
              <Text style={{ ...GS.grayText, marginLeft: 14, marginBottom: 8, fontSize: 16 }}>
                {/* &#8194; is the En space character */}
                {showBest && (
                  <>Best: {getValueTextElement(stat.multiValueStats.best, statType, 'best')}&#8194;</>
                )}
                {showAvg && <>Avg: {getValueTextElement(stat.multiValueStats.avg, statType, 'avg')}&#8194;</>}
                {showSum && <>Sum: {getValueTextElement(stat.multiValueStats.sum, statType, 'sum')}</>}
              </Text>
            )}
          </View>
        );
      })}
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
        <IconButton onPress={() => onDeleteEntry(entry)} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pbStyle: {
    color: '#0c0',
    fontWeight: 'bold',
  },
});

export default Entry;
