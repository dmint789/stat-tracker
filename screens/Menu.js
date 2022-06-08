import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {GlobalStyles} from '../shared/GlobalStyles.js';
import * as SM from '../shared/StorageManager.js';
import StatCategory from '../components/StatCategory.js';
import AddCategoryModal from '../components/AddCategoryModal.js';
import ListModal from '../components/ListModal.js';

const Menu = ({navigation}) => {
  const [statCategories, setStatCategories] = useState([]);
  const [listModalOpen, setListModalOpen] = useState(false);
  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);

  useEffect(() => {
    getInitData();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: 'Stat Tracker',
      headerRight: () => (
        <TouchableOpacity
          style={styles.ellipsis}
          onPress={() => {
            setListModalOpen(prevListModalOpen => !prevListModalOpen);
          }}>
          <Icon name="ellipsis-v" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const getInitData = async () => {
    const tempStatCategories = await SM.getStatCategories();
    if (tempStatCategories !== null) {
      setStatCategories(tempStatCategories);
    }
  };

  const onChooseCategory = statCategory => {
    if (statCategories.find(item => item === statCategory)) {
      navigation.navigate('Home', {statCategory});
    }
  };

  const addCategory = statCategory => {
    setStatCategories(prevStatCategories => {
      const newStatCategories = [statCategory, ...prevStatCategories];

      SM.setStatCategories(newStatCategories);

      return newStatCategories;
    });
  };

  const deleteCategory = statCategory => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete this stat category? All entries and stat types in it will be lost.',
      [
        {
          text: 'Cancel',
          onPress: () => {},
        },
        {
          text: 'Ok',
          onPress: () => {
            setStatCategories(prevStatCategories => {
              const newStatCategories = prevStatCategories.filter(
                item => item !== statCategory,
              );

              SM.deleteStatCategory(newStatCategories, statCategory);

              return newStatCategories;
            });
          },
        },
      ],
    );
  };

  return (
    <View style={GlobalStyles.container}>
      <ListModal
        modalOpen={listModalOpen}
        setModalOpen={setListModalOpen}
        onAddCategory={() => setAddCategoryModalOpen(true)}
        onOpenAbout={() => navigation.navigate('About')}
      />
      <AddCategoryModal
        statCategories={statCategories}
        modalOpen={addCategoryModalOpen}
        setModalOpen={setAddCategoryModalOpen}
        onAddCategory={addCategory}
      />
      {statCategories.length > 0 ? (
        <FlatList
          numColumns={1}
          keyExtractor={() => Math.random()}
          data={statCategories}
          renderItem={({item}) => (
            <StatCategory
              statCategory={item}
              onPress={onChooseCategory}
              onDelete={deleteCategory}
            />
          )}
          ListFooterComponent={<View style={{height: 20}} />}
        />
      ) : (
        <Text style={GlobalStyles.text}>Create a new stat category</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  ellipsis: {
    width: 50,
    height: 50,
    paddingTop: 14,
    alignItems: 'center',
  },
});

export default Menu;
