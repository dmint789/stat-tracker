import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import GS from '../shared/GlobalStyles';
import { IStat, IStatType } from '../shared/DataStructures';

import IconButton from './IconButton';

const WorkingEntryList: React.FC<{
  stats: IStat[];
  deleteEditStat: (stat: IStat, edit?: boolean) => void;
}> = ({ stats, deleteEditStat }) => {
  const { statTypes } = useSelector((state: RootState) => state.main);

  const getStatValues = (stat: IStat, statType: IStatType): string => {
    if (stat.values.length === 1) return String(stat.values[0]);
    else {
      return stat.values
        .map((val) => val + (statType.unit ? ` ${statType.unit}` : '') + ', ')
        .join('')
        .slice(0, -2);
    }
  };

  return (
    <View style={styles.container}>
      {stats.map((stat) => {
        const statType = statTypes.find((el) => el.id === stat.type);
        return (
          <View style={styles.stat} key={stat.id}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => deleteEditStat(stat, true)}>
              <Text style={GS.text}>
                <Text style={GS.grayText}>{statType?.name || '(Deleted)'}: </Text>
                {getStatValues(stat, statType)}
              </Text>
              {stat.values.length > 1 && (statType?.showBest || statType?.showAvg || statType?.showSum) && (
                <Text style={{ ...GS.text, ...GS.grayText }}>
                  {statType?.showBest && `Best: ${stat.multiValueStats.best}  `}
                  {statType?.showAvg && `Avg: ${stat.multiValueStats.avg}  `}
                  {statType?.showSum && `Sum: ${stat.multiValueStats.sum}`}
                </Text>
              )}
            </TouchableOpacity>

            <IconButton onPress={() => deleteEditStat(stat)} />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 6,
  },
  stat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
});

export default WorkingEntryList;
