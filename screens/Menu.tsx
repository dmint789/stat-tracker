import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import {
  initStatCategories,
  initLastCategoryId,
  deleteStatCategory,
  setStatCategory,
} from '../redux/mainSlice';
import * as SM from '../shared/StorageManager';
import GS from '../shared/GlobalStyles';
import { IStatCategory, IStatType, IEntry } from '../shared/DataStructures';

import StatCategory from '../components/StatCategory';
import AddEditCategoryModal from '../components/AddEditCategoryModal';
import ListModal from '../components/ListModal';
import IconButton from '../components/IconButton';

const Menu = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { statCategories } = useSelector((state: RootState) => state.main);

  // Used for passing the stat category to the edit category modal, which then edits it
  const [prevCategory, setPrevCategory] = useState<IStatCategory>(null);
  const [listModalOpen, setListModalOpen] = useState(false);
  const [addEditCategoryModalOpen, setAddEditCategoryModalOpen] = useState(false);

  useEffect(() => {
    SM.getStatCategories().then((result) => {
      if (result !== null) {
        dispatch(initStatCategories(result));
      }
    });

    SM.getLastCategoryId().then((result) => {
      if (result !== null) {
        dispatch(initLastCategoryId(result));
      }
    });
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: 'Stat Tracker',
      headerRight: () => (
        <IconButton
          type="ellipsis-v"
          color="white"
          bigHitbox={true}
          onPress={() => setListModalOpen((prevListModalOpen) => !prevListModalOpen)}
        />
      ),
    });
  }, [navigation]);

  const onAddCategory = () => {
    setPrevCategory(null);
    setAddEditCategoryModalOpen(true);
  };

  const onEditCategory = (statCategory: IStatCategory) => {
    setPrevCategory(statCategory);
    setAddEditCategoryModalOpen(true);
  };

  const deleteCategory = (statCategory: IStatCategory) => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete this stat category? All entries and stat types in it will be lost.',
      [
        { text: 'Cancel' },
        {
          text: 'Ok',
          onPress: () => dispatch(deleteStatCategory(statCategory)),
        },
      ],
    );
  };

  const openStatCategory = async (statCategory: IStatCategory) => {
    const statTypes: IStatType[] = (await SM.getData(statCategory.id, 'statTypes')) || [];
    const entries: IEntry[] = (await SM.getData(statCategory.id, 'entries')) || [];
    dispatch(setStatCategory({ statCategory, statTypes, entries }));

    navigation.navigate('Home');
  };

  return (
    <View style={GS.container}>
      <ListModal
        modalOpen={listModalOpen}
        setModalOpen={setListModalOpen}
        onAddCategory={onAddCategory}
        onOpenImportExport={() => navigation.navigate('ImportExport')}
        onOpenAbout={() => navigation.navigate('About')}
      />
      <AddEditCategoryModal
        prevCategory={prevCategory}
        modalOpen={addEditCategoryModalOpen}
        setModalOpen={setAddEditCategoryModalOpen}
      />
      {statCategories.length > 0 ? (
        <FlatList
          numColumns={1}
          keyExtractor={(item: IStatCategory) => String(item.id)}
          data={statCategories}
          renderItem={({ item }) => (
            <StatCategory
              category={item}
              onPress={(category: IStatCategory) => openStatCategory(category)}
              onEdit={onEditCategory}
              onDelete={deleteCategory}
            />
          )}
          ListFooterComponent={<View style={{ height: 20 }} />}
        />
      ) : (
        <Text style={GS.infoText}>
          Create your first stat category by pressing the elipsis and selecting "Add Stat Category"
        </Text>
      )}
    </View>
  );
};

export default Menu;
