import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import GS from '../shared/GlobalStyles.js';

const About = () => {
  return (
    <View style={GS.container}>
      <Text style={GS.normalText}>
        Made by Deni Mintsaev in 2022 using React Native. The source code is
        available at: https://github.com/dmint789/stat-tracker
      </Text>
    </View>
  );
};

export default About;
