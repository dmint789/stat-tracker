import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

const DeleteButton = ({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Icon name="remove" size={20} color="red" />
    </TouchableOpacity>
  );
};

export default DeleteButton;
