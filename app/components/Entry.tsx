import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import GS from '../shared/GlobalStyles';
import { formatIDate, sortStats } from '../shared/GlobalFunctions';
import { IEntry, IStatType, IStat, StatTypeVariant } from '../shared/DataStructure';

import IconButton from './IconButton';

const Entry: React.FC<{
  entry: IEntry;
  onDeleteEntry: (entry: IEntry) => void;
  onEditEntry: (entry: IEntry) => void;
}> = ({ entry, onDeleteEntry, onEditEntry }) => {
  const { statTypes } = useSelector((state: RootState) => state.main);

  const getValueStyle = (
    value: string | number,
    statType: IStatType,
    pbValueShown: { val: boolean },
  ): object => {
    if (pbValueShown.val) return {};
    else if (
      statType?.trackPBs &&
      statType.pbs?.allTime?.entryId.bestWorst === entry.id &&
      statType.pbs.allTime.result.bestWorst === value
    )
      return styles.PBStyle;
    else if (
      statType?.trackYearPBs &&
      statType.pbs?.year?.entryId.bestWorst === entry.id &&
      statType.pbs.year.result.bestWorst === value
    )
      return styles.yearPBStyle;
    else if (
      statType?.trackMonthPBs &&
      statType.pbs?.month?.entryId.bestWorst === entry.id &&
      statType.pbs.month.result.bestWorst === value
    )
      return styles.monthPBStyle;
    else return {};
  };

  const getMultiStatTextElement = (stat: IStat, statType: IStatType, key: 'bestWorst' | 'avg' | 'sum') => {
    let style;
    let output: number;

    if (statType?.trackPBs && statType.pbs?.allTime?.entryId[key] === entry.id) {
      style = styles.PBStyle;
    } else if (statType?.trackYearPBs && statType.pbs?.year?.entryId[key] === entry.id) {
      style = styles.yearPBStyle;
    } else if (statType?.trackMonthPBs && statType.pbs?.month?.entryId[key] === entry.id) {
      style = styles.monthPBStyle;
    } else style = {};

    if (key === 'bestWorst') {
      output = statType.higherIsBetter ? stat.multiValueStats.high : stat.multiValueStats.low;
    } else {
      output = stat.multiValueStats[key];
    }

    return <Text style={style}>{output}</Text>;
  };

  return (
    <TouchableOpacity onPress={() => onEditEntry(entry)} style={GS.bigCard}>
      {sortStats(entry.stats, statTypes).map((stat) => {
        const statType = statTypes.find((el) => el.id === stat.type);

        // Best/avg/sum should be shown if needed and if there are multiple values or the best/avg/sum is a PB
        const showBest = statType?.showBest && stat.values.length > 1;
        const showAvg =
          statType?.showAvg && (stat.values.length > 1 || statType.pbs?.allTime.entryId.avg === entry.id);
        const showSum =
          statType?.showSum && (stat.values.length > 1 || statType.pbs?.allTime.entryId.sum === entry.id);

        // This is for stats with pb tracking and multiple values
        const pbValueShown = { val: false };

        return (
          <View key={stat.id}>
            <Text style={GS.textMar}>
              <Text style={GS.darkGrayText}>{statType?.name || '(Deleted)'}: </Text>
              {stat.values.map((value, i) => (
                <Text key={i}>
                  {/* Make sure only the first best value in a multivalue stat with ties is highlighted */}
                  <Text style={getValueStyle(value, statType, pbValueShown)}>
                    {statType?.variant !== StatTypeVariant.MULTIPLE_CHOICE
                      ? value
                      : statType.choices.find((el) => el.id === value).label}
                  </Text>
                  {statType?.unit && ` ${statType?.unit}`}
                  {i !== stat.values.length - 1 && ', '}
                </Text>
              ))}
            </Text>
            {(showBest || showAvg || showSum) && (
              <Text style={{ ...GS.darkGrayText, marginLeft: 14, marginBottom: 8, fontSize: 16 }}>
                {/* &#8194; is the En space character */}
                {showBest && <>Best: {getMultiStatTextElement(stat, statType, 'bestWorst')}&#8194;</>}
                {showAvg && <>Avg: {getMultiStatTextElement(stat, statType, 'avg')}&#8194;</>}
                {showSum && <>Sum: {getMultiStatTextElement(stat, statType, 'sum')}</>}
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
      {entry.date && <Text style={GS.smallGrayText}>{formatIDate(entry.date)}</Text>}
      <View style={GS.cardButtons}>
        <IconButton onPress={() => onDeleteEntry(entry)} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  PBStyle: {
    color: 'blue',
    fontWeight: 'bold',
  },
  yearPBStyle: {
    color: 'cyan',
    fontWeight: 'bold',
  },
  monthPBStyle: {
    color: 'green',
    fontWeight: 'bold',
  },
});

export default Entry;
