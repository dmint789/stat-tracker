import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import GS, { xxsGap, xsGap, mdGap } from '../shared/GlobalStyles';
import { sortStats } from '../shared/GlobalFunctions';
import { IStat, IStatType } from '../shared/DataStructure';

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
        .map((val) => val + (statType?.unit ? ` ${statType.unit}` : '') + ', ')
        .join('')
        .slice(0, -2);
    }
  };

  return (
    <View style={{ marginTop: 6 }}>
      {sortStats(stats, statTypes).map((stat) => {
        const statType = statTypes.find((el) => el.id === stat.type);

        return (
          <View style={styles.stat} key={stat.id}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => deleteEditStat(stat, true)}>
              <Text style={GS.textMar}>
                <Text style={GS.darkGrayText}>{statType?.name || '(Deleted)'}: </Text>
                {getStatValues(stat, statType)}
              </Text>
              {stat.values.length > 1 && (statType?.showBest || statType?.showAvg || statType?.showSum) && (
                <Text style={GS.darkGrayText}>
                  {statType.showBest &&
                    `Best: ${
                      statType.higherIsBetter ? stat.multiValueStats.high : stat.multiValueStats.low
                    }  `}
                  {statType.showAvg && `Avg: ${stat.multiValueStats.avg}  `}
                  {statType.showSum && `Sum: ${stat.multiValueStats.sum}`}
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
  stat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: mdGap,
    paddingHorizontal: xsGap,
    paddingBottom: xxsGap,
    // Same as the input border bottom
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
});

export default WorkingEntryList;
