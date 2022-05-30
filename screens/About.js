import React from 'react';
import {View, Text} from 'react-native';
import {GlobalStyles} from '../shared/GlobalStyles.js';

const About = props => {
  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.text}>Made by Deni Mintsaev</Text>
    </View>
  );
};

export default About;
