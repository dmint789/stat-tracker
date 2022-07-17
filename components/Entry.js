import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import GS from '../shared/GlobalStyles.js';

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
    <TouchableOpacity onPress={() => onEditEntry(entry.id)} style={GS.card}>
      {entry.stats.map(stat => (
        <Text style={GS.text} key={Math.random()}>
          <Text style={GS.nameText}>{stat.name}: </Text>
          {stat.value} {getUnit(stat.name)}
        </Text>
      ))}
      {entry.comment !== '' && (
        <Text style={{...GS.commentText, color: getCommentColor()}}>
          {entry.comment}
        </Text>
      )}
      <Text style={GS.smallText}>{entry.date.text}</Text>
      <View style={GS.bottomButtons}>
        <IconButton onPress={() => onDelete(entry.id)} />
      </View>
    </TouchableOpacity>
  );
};

export default Entry;
