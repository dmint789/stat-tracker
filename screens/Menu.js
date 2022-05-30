import React, {useState, useEffect} from 'react';
import {View, Text, FlatList} from 'react-native';
import {GlobalStyles} from '../shared/GlobalStyles.js';
import * as SM from '../shared/StorageManager.js';
import StatCategory from '../components/StatCategory.js';

const Menu = ({navigation}) => {
  const [statCategories, setStatCategories] = useState([]);

  useEffect(() => {
    //SM.setStatCategories(['Health']);
    getInitData();
  }, []);

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

  return (
    <View style={GlobalStyles.container}>
      {statCategories.length > 0 ? (
        <FlatList
          numColumns={1}
          keyExtractor={() => Math.random()}
          data={statCategories}
          renderItem={({item}) => (
            <StatCategory statCategory={item} onPress={onChooseCategory} />
          )}
          ListFooterComponent={<View style={{height: 20}} />}
        />
      ) : (
        <Text style={GlobalStyles.text}>Create a new stat category</Text>
      )}
    </View>
  );
};

export default Menu;
