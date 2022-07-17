import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import * as SM from '../shared/StorageManager';
import GS from '../shared/GlobalStyles';
import {IStatCategory} from '../shared/DataStructure';

import Entry from '../components/Entry';
import MyButton from '../components/MyButton';

const Home = ({navigation, route}) => {
  const [statCategory, setStatCategory] = useState<IStatCategory>();
  const [entries, setEntries] = useState([]);
  const [statTypes, setStatTypes] = useState([]);
  const [lastId, setLastId] = useState(0);

  interface IPassedData {
    statCategory?: IStatCategory;
    newEntry?: any;
    statTypes?: any;
  }
  const passedData: IPassedData = route.params;

  useEffect(() => {
    getInitData();
  }, []);

  useEffect(() => {
    // Set the plus button in the header. Pass null to indicate that we're adding an entry.
    navigation.setOptions({
      headerRight: () => (
        <MyButton
          onPress={() =>
            navigation.navigate('AddEditEntry', {
              statCategory: passedData.statCategory.name,
            })
          }>
          <Icon name="plus" size={24} color="red" />
        </MyButton>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    // Check that we received valid data and if so - save it.
    if (Object.keys(passedData).length > 0) {
      // If stat category was passed from Menu, save the name and last id,
      // reorder stat categories with the chosen one at the top of the list, and set the title
      if (passedData.statCategory) {
        setStatCategory(passedData.statCategory);
        SM.reorderStatCategories(passedData.statCategory);
        navigation.setOptions({title: passedData.statCategory.name});
      }

      // Save new stat types passed from AddEditEntry (if any)
      if (passedData.statTypes) {
        setStatTypes(passedData.statTypes);
      }

      // Save new or edited entry
      if (passedData.newEntry) {
        // If the passed id is -1, that means we're adding an entry. If not - we're editing one.
        if (passedData.newEntry.id === -1) {
          addEntry(passedData.newEntry);

          // Set updated stat category
          setStatCategory((prevCategory: IStatCategory) => {
            const updatedCategory: IStatCategory = {
              name: prevCategory.name,
              note: prevCategory.note,
              lastId: lastId + 1,
              totalEntries: prevCategory.totalEntries + 1,
            };

            SM.editStatCategory(prevCategory, updatedCategory);

            setLastId(lastId + 1);

            return updatedCategory;
          });
        } else {
          editEntry(passedData.newEntry);
        }
      }
    }
  }, [passedData]);

  const getInitData = async () => {
    const category = passedData.statCategory.name;

    // Get entry data (if any)
    const tempEntries = await SM.getData(category, 'entries');
    if (tempEntries !== null) {
      setEntries(tempEntries);
    }
    // Get stat types data (if any)
    const tempStatTypes = await SM.getData(category, 'statTypes');
    if (tempStatTypes !== null) {
      setStatTypes(tempStatTypes);
    }
  };

  const addEntry = entry => {
    setEntries(prevEntries => {
      const newEntries = [
        {
          id: lastId,
          stats: entry.stats,
          comment: entry.comment,
          date: entry.date,
        },
        ...prevEntries,
      ];

      SM.setData(statCategory.name, 'entries', newEntries);

      return newEntries;
    });
  };

  const onEditEntry = (id: number) => {
    const entry = entries.find(item => item.id === id);

    navigation.navigate('AddEditEntry', {
      statCategory: statCategory.name,
      entry,
    });
  };

  const editEntry = entry => {
    setEntries(prevEntries => {
      let newEntries = prevEntries;

      // Get the index of the entry that has the same id as the one we're editing
      const index: number = prevEntries.findIndex(item => item.id === entry.id);
      newEntries[index] = entry;

      SM.setData(statCategory.name, 'entries', newEntries);

      return newEntries;
    });
  };

  const onDeleteEntry = (id: number) => {
    Alert.alert('Confirmation', 'Are you sure you want to delete the entry?', [
      {text: 'Cancel'},
      {
        text: 'Ok',
        onPress: () => {
          setEntries(prevEntries => {
            const newEntries = prevEntries.filter(item => item.id !== id);

            if (newEntries.length === 0) {
              SM.deleteData(statCategory.name, 'entries');
            } else {
              SM.setData(statCategory.name, 'entries', newEntries);
            }

            return newEntries;
          });
        },
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
          keyExtractor={item => item.id}
          data={entries}
          renderItem={({item}) => (
            <Entry
              entry={item}
              statTypes={statTypes}
              onDelete={onDeleteEntry}
              onEditEntry={onEditEntry}
            />
          )}
          ListFooterComponent={<View style={{height: 20}} />}
        />
      ) : (
        <Text style={GS.infoText}>Press + to add some stat entries</Text>
      )}
    </View>
  );
};

export default Home;
