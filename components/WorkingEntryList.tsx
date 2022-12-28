import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import GS from '../shared/GlobalStyles';
import { getStatValues, getShowStats, getMultiValueStats } from '../shared/GlobalFunctions';
import { IStat } from '../shared/DataStructures';

import IconButton from './IconButton';

const WorkingEntryList: React.FC<{
  stats: IStat[];
  deleteEditStat: (stat: IStat, edit?: boolean) => void;
}> = ({ stats, deleteEditStat }) => {
  const { statTypes } = useSelector((state: RootState) => state.main);

  return (
    <View style={styles.container}>
      {stats.map((stat) => (
        <View style={styles.stat} key={stat.id}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => deleteEditStat(stat, true)}>
            <Text style={GS.text}>
              <Text style={GS.grayText}>
                {statTypes.find((el) => el.id === stat.type)?.name || '(Deleted)'}:{' '}
              </Text>
              {getStatValues(stat, statTypes)}
            </Text>
            {getShowStats(stat, statTypes) && (
              <Text style={{ ...GS.text, ...GS.grayText }}>{getMultiValueStats(stat, statTypes)}</Text>
            )}
          </TouchableOpacity>

          <IconButton onPress={() => deleteEditStat(stat)} />
        </View>
      ))}
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
