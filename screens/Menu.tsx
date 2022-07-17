import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, Alert, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import * as SM from '../shared/StorageManager';
import GS from '../shared/GlobalStyles';
import {IStatCategory} from '../shared/DataStructure';

import Category from '../components/StatCategory';
import AddEditCategoryModal from '../components/AddEditCategoryModal';
import ListModal from '../components/ListModal';
import IconButton from '../components/IconButton';

const Menu = ({navigation}) => {
  const [categories, setCategories] = useState<IStatCategory[]>([]);
  // Used for passing the stat category to the edit category modal, which then edits it
  const [prevCategory, setPrevCategory] = useState<IStatCategory>();
  const [listModalOpen, setListModalOpen] = useState(false);
  const [addEditCategoryModalOpen, setAddEditCategoryModalOpen] =
    useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: 'Stat Tracker',
      headerRight: () => (
        <IconButton
          type="ellipsis-v"
          color="white"
          bigHitbox={true}
          onPress={() =>
            setListModalOpen(prevListModalOpen => !prevListModalOpen)
          }
        />
      ),
    });
  }, [navigation]);

  // Update this screen's data when returning to it
  useFocusEffect(
    React.useCallback(() => {
      getInitData();

      // Do something when leaving this screen
      return () => {};
    }, []),
  );

  const getInitData = async () => {
    const tempStatCategories = await SM.getStatCategories();
    if (tempStatCategories !== null) {
      setCategories(tempStatCategories);
    }
  };

  // Called when the pencil icon is clicked, requesting the edit category window to be opened
  const onEditCategory = (category: IStatCategory) => {
    setPrevCategory(category);
    setAddEditCategoryModalOpen(true);
  };

  const addCategory = (category: IStatCategory) => {
    setCategories(prevCategories => {
      const newCategories: IStatCategory[] = [category, ...prevCategories];

      SM.setStatCategories(newCategories);

      return newCategories;
    });
  };

  // Called when a stat category is edited
  const editCategory = (
    prevCategory: IStatCategory,
    category: IStatCategory,
  ) => {
    setCategories(() => {
      const newCategories: IStatCategory[] = categories.map(item =>
        item.name === prevCategory.name ? category : item,
      );

      SM.editStatCategory(prevCategory, category);

      return newCategories;
    });
  };

  const deleteCategory = (category: string) => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete this stat category? All entries and stat types in it will be lost.',
      [
        {text: 'Cancel'},
        {
          text: 'Ok',
          onPress: () => {
            setCategories(prevCategories => {
              const newCategories: IStatCategory[] = prevCategories.filter(
                item => item.name !== category,
              );
              SM.deleteStatCategory(newCategories, category);
              return newCategories;
            });
          },
        },
      ],
    );
  };

  return (
    <View style={GS.container}>
      <ListModal
        modalOpen={listModalOpen}
        setModalOpen={setListModalOpen}
        onAddCategory={() => setAddEditCategoryModalOpen(true)}
        onOpenImportExport={() =>
          navigation.navigate('ImportExport', {categories})
        }
        onOpenAbout={() => navigation.navigate('About')}
      />
      <AddEditCategoryModal
        categories={categories}
        prevCategory={prevCategory}
        modalOpen={addEditCategoryModalOpen}
        setModalOpen={setAddEditCategoryModalOpen}
        onAddCategory={addCategory}
        onEditCategory={editCategory}
      />
      {categories.length > 0 ? (
        <FlatList
          numColumns={1}
          keyExtractor={() => Math.random().toString()}
          data={categories}
          renderItem={({item}) => (
            <Category
              category={item}
              onPress={(category: IStatCategory) =>
                navigation.navigate('Home', {statCategory: category})
              }
              onEdit={onEditCategory}
              onDelete={deleteCategory}
            />
          )}
          ListFooterComponent={<View style={{height: 20}} />}
        />
      ) : (
        <Text style={GS.infoText}>
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
