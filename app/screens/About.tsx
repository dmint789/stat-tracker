import React from 'react';
import { View, Text } from 'react-native';
import GS from '../shared/GlobalStyles';

const About = () => {
  return (
    <View style={GS.container}>
      <Text style={{ ...GS.normalText, textAlign: 'justify' }}>
        This is an app for tracking various statistics, like things related to work, education, hobbies,
        health, etc. Shows personal bests for numeric stats, has various customization options for stat types,
        allows setting the date and a comment for each entry and more.
      </Text>
      <Text style={{ ...GS.normalText, textAlign: 'justify' }}>
        Made by Deni Mintsaev in 2022 using React Native. The source code is available at:
        https://github.com/dmint789/stat-tracker
      </Text>
    </View>
  );
};

export default About;
