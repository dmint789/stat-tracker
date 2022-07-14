import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {GlobalStyles} from '../shared/GlobalStyles.js';
import IconButton from '../components/IconButton.js';

const Entry = ({entry, statTypes, onDelete, onEditEntry}) => {
  // Get the unit for the given stat using the list of stat types
  const getUnit = statName => {
    for (let type of statTypes) {
      if (type.name === statName) return type.unit;
    }
    return '';
  };

  const getCommentColor = () => {
    if (entry.stats.length >= 1) {
      return '#555';
    } else {
      return 'black';
    }
  };

  return (
    <TouchableOpacity
      onPress={() => onEditEntry(entry.id)}
      style={GlobalStyles.card}>
      {entry.stats.map(stat => (
        <Text style={GlobalStyles.text} key={Math.random()}>
          <Text style={GlobalStyles.nameText}>{stat.name}: </Text>
          {stat.value} {getUnit(stat.name)}
        </Text>
      ))}
      {entry.comment !== '' && (
        <Text style={{...GlobalStyles.commentText, color: getCommentColor()}}>
          {entry.comment}
        </Text>
      )}
      <Text style={GlobalStyles.smallText}>{entry.date.text}</Text>
      <View style={GlobalStyles.bottomButtons}>
        <IconButton onPress={() => onDelete(entry.id)} />
      </View>
    </TouchableOpacity>
  );
};

export default Entry;
