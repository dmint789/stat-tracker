import React from 'react';
import { Button, View, ScrollView, Text, Linking, StyleSheet } from 'react-native';
import GS, { mdGap } from '../shared/GlobalStyles';

import Gap from '../components/Gap';

const About = () => {
  const openLink = (link: string) => {
    Linking.openURL(link);
  };

  return (
    <View style={GS.scrollContainer}>
      <ScrollView keyboardShouldPersistTaps="always" style={GS.scrollableArea}>
        <Gap />
        <Text style={GS.titleText}>About the app</Text>
        <Text style={styles.text}>
          This is a mobile app for tracking various daily statistics and personal bests. You can use it for
          things like work, education, hobbies, health, or whatever it is you can find it useful for in your
          personal life. It shows personal bests for numeric stats, has various customization options for stat
          types, allows setting the date and a comment for each entry and more.
        </Text>
        <Text style={GS.titleText}>Support</Text>
        <Text style={styles.text}>
          If you would like to support this project, feel free to become a patron on my Patreon page. If you
          don't want to contribute monthly, you can just wait until your first payment goes through at the
          start of the next month and unsubscribe. I appreciate any and all contributions.
        </Text>
        <Button onPress={() => openLink('https://patreon.com/denimintsaev')} title="Support" color="orange" />
        <Gap size="xl" />
        <Text style={styles.text}>
          Made by Deni Mintsaev in 2022 using React Native. The source code is available here:
        </Text>
        <Button
          onPress={() => openLink('https://github.com/dmint789/stat-tracker')}
          title="Github"
          color="black"
        />
        <Gap size="xl" />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: mdGap,
  },
  text: {
    ...GS.normalText,
    textAlign: 'justify',
  },
});

export default About;
