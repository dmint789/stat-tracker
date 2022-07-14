import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {GlobalStyles} from '../shared/GlobalStyles.js';

const About = props => {
  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.normalText}>
        Made by Deni Mintsaev in 2022 using React Native. The source code is
        available at: https://github.com/dmint789/stat-tracker
      </Text>
    </View>
  );
};

export default About;
