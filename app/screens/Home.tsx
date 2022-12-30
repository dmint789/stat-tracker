import React, { useEffect } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { deleteEntry } from '../redux/mainSlice';
import GS from '../shared/GlobalStyles';
import { IEntry } from '../shared/DataStructure';

import Entry from '../components/Entry';
import MyButton from '../components/MyButton';

const Home = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { statCategory, entries } = useSelector((state: RootState) => state.main);

  useEffect(() => {
    navigation.setOptions({
      title: statCategory.name,
      // Set the plus button in the header
      headerRight: () => (
        <MyButton onPress={() => navigation.navigate('AddEditEntry')}>
          <Icon name="plus" size={24} color="red" />
        </MyButton>
      ),
    });
  }, [navigation]);

  const onEditEntry = (entry: IEntry) => {
    navigation.navigate('AddEditEntry', { entry });
  };

  const onDeleteEntry = (entry: IEntry) => {
    Alert.alert('Confirmation', 'Are you sure you want to delete the entry?', [
      { text: 'Cancel' },
      {
        text: 'Ok',
        onPress: () => dispatch(deleteEntry(entry)),
      },
    ]);
  };

  return (
    <View style={GS.container}>
      {/* Views in React Native are flexbox components by default. */}
      {/* The items inside are automatically flex items. */}

      {/* FlatList is better for performance than ScrollView. It also */}
      {/* automatically assigns the key value to each item. */}
      {entries.length > 0 ? (
        <FlatList
          numColumns={1}
          keyExtractor={(item: IEntry) => String(item.id)}
          data={entries}
          renderItem={({ item }) => (
            <Entry entry={item} onDeleteEntry={onDeleteEntry} onEditEntry={onEditEntry} />
          )}
          ListFooterComponent={<View style={{ height: 20 }} />}
        />
      ) : (
        <Text style={GS.infoText}>Press + to add a stat entry</Text>
      )}
    </View>
  );
};

export default Home;
