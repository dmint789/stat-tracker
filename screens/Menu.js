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
import AddEditCategoryModal from '../components/AddEditCategoryModal.js';
import ListModal from '../components/ListModal.js';
import {stat} from 'react-native-fs';

const Menu = ({navigation}) => {
  const [statCategories, setStatCategories] = useState([]);
  // Used for passing the stat category to the edit category modal
  const [prevStatCategory, setPrevStatCategory] = useState('');
  const [listModalOpen, setListModalOpen] = useState(false);
  const [addEditCategoryModalOpen, setAddEditCategoryModalOpen] =
    useState(false);

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
    if (statCategories.find(item => item.name === statCategory.name)) {
      setStatCategories(prevStatCategories => {
        const newStatCategories = [
          statCategory,
          ...prevStatCategories.filter(item => item.name !== statCategory.name),
        ];

        SM.setStatCategories(newStatCategories);

        return newStatCategories;
      });

      navigation.navigate('Home', {statCategory: statCategory.name});
    }
  };

  const onEditCategory = statCategory => {
    setPrevStatCategory(statCategory);
    setAddEditCategoryModalOpen(true);
  };

  const addCategory = statCategory => {
    setStatCategories(prevStatCategories => {
      const newStatCategories = [statCategory, ...prevStatCategories];

      SM.setStatCategories(newStatCategories);

      return newStatCategories;
    });
  };

  const editCategory = (statCategory, prevStatCategory) => {
    setStatCategories(() => {
      const newStatCategories = statCategories.map(item =>
        item.name === prevStatCategory.name ? statCategory : item,
      );

      SM.editStatCategory(
        newStatCategories,
        statCategory.name,
        prevStatCategory.name,
      );

      return newStatCategories;
    });
  };

  const deleteCategory = statCategory => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete this stat category? All entries and stat types in it will be lost.',
      [
        {text: 'Cancel'},
        {
          text: 'Ok',
          onPress: () => {
            setStatCategories(prevStatCategories => {
              const newStatCategories = prevStatCategories.filter(
                item => item.name !== statCategory,
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
        onAddCategory={() => setAddEditCategoryModalOpen(true)}
        onOpenAbout={() => navigation.navigate('About')}
      />
      <AddEditCategoryModal
        statCategories={statCategories}
        prevStatCategory={prevStatCategory}
        modalOpen={addEditCategoryModalOpen}
        setModalOpen={setAddEditCategoryModalOpen}
        onAddCategory={addCategory}
        onEditCategory={editCategory}
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
              onEdit={onEditCategory}
              onDelete={deleteCategory}
            />
          )}
          ListFooterComponent={<View style={{height: 20}} />}
        />
      ) : (
        <Text style={GlobalStyles.infoText}>
          Create your first stat category by pressing the elipsis and selecting
          "Add Stat Category"
        </Text>
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
