import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

const IconButton = ({onPress, type = 'remove', color = 'red'}) => {
  return (
    <TouchableOpacity onPress={onPress} style={{marginLeft: 10}}>
      <Icon name={type} size={25} color={color} />
    </TouchableOpacity>
  );
};

export default IconButton;
