import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import GS, { xxsGap, xsGap, mdGap } from '../shared/GlobalStyles';
import { sortStats, getTimeString, getShowParentheses } from '../shared/GlobalFunctions';
import { IStat, IStatType, StatTypeVariant } from '../shared/DataStructure';

import IconButton from './IconButton';

const WorkingEntryList: React.FC<{
  stats: IStat[];
  deleteEditStat: (stat: IStat, edit?: boolean) => void;
}> = ({ stats, deleteEditStat }) => {
  const { statTypes } = useSelector((state: RootState) => state.main);

  const getStatValues = (stat: IStat, statType: IStatType): string => {
    if (statType?.variant !== StatTypeVariant.MULTIPLE_CHOICE) {
      // Not relevant for TIME stat type variant
      const unit = statType?.unit ? ` ${statType.unit}` : '';
      // Only relevant for when exclude best and worst values is on
      const valueFound = { high: false, low: false };

      return stat.values
        .map((val: string | number) => {
          let output: string;

          if (statType?.variant !== StatTypeVariant.TIME) output = val + unit;
          else output = getTimeString(val as number, statType.decimals, true);

          if (getShowParentheses(val, stat, statType, valueFound)) output = `(${output})`;

          return output;
        })
        .join(', ');
    } else {
      return statType.choices.find((el) => el.id === stat.values[0]).label;
    }
  };

  return (
    <View style={{ marginTop: 6 }}>
      {sortStats(stats, statTypes).map((stat) => {
        const statType = statTypes.find((el) => el.id === stat.type);
        const getStatistic = (value: number): string => {
          if (statType?.variant !== StatTypeVariant.TIME) {
            return String(value);
          } else {
            return getTimeString(value, statType.decimals, true);
          }
        };

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
                    `Best: ${getStatistic(
                      statType.higherIsBetter ? stat.multiValueStats.high : stat.multiValueStats.low,
                    )}  `}
                  {statType.showAvg && `Avg: ${getStatistic(stat.multiValueStats.avg)}  `}
                  {statType.showSum && `Sum: ${getStatistic(stat.multiValueStats.sum)}`}
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
