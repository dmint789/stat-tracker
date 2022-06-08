import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getData = async (statCategory, request, verbose = false) => {
  const key = statCategory + '-' + request;

  try {
    if (verbose) console.log(`Getting data for key ${key}`);

    const data = await AsyncStorage.getItem(key);

    if (data.length > 0) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.log(`Error when searching for key ${key}:`);
    console.log(err);
  }

  return null;
};

export const getStatCategories = async (verbose = false) => {
  try {
    if (verbose) console.log('Getting statCategories');

    const data = await AsyncStorage.getItem('statCategories');

    if (data.length > 0) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.log('Error when retrieving stat categories:');
    console.log(err);
  }

  return null;
};

export const setData = async (statCategory, request, data, verbose = false) => {
  const key = statCategory + '-' + request;

  try {
    if (verbose) {
      console.log(`Setting data for key ${key}:`);
      console.log(data);
    }

    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.log(`Error when setting data for key ${key}:`);
    console.log(err);
  }
};

export const setStatCategories = async (data, verbose = false) => {
  try {
    if (verbose) {
      console.log('Setting statCategories to:');
      console.log(data);
    }

    await AsyncStorage.setItem('statCategories', JSON.stringify(data));
  } catch (err) {
    console.log('Error when setting stat categories:');
    console.log(err);
  }
};

export const deleteData = async (statCategory, request, verbose = false) => {
  const key = statCategory + '-' + request;

  try {
    if (verbose) console.log(`Deleting data for key ${key}`);

    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.log(`Error when deleting data at key ${key}:`);
    console.log(err);
  }
};

// Sets the new list of stat categoies after a deletion and deletes all data used for it
export const deleteStatCategory = async (
  newStatCategories,
  statCategory,
  verbose = false,
) => {
  try {
    if (verbose) console.log(`Deleting stat category ${statCategory}`);

    await setStatCategories(newStatCategories);

    await deleteData(statCategory, 'statTypes');
    await deleteData(statCategory, 'entries');
    await deleteData(statCategory, 'lastId');
  } catch (err) {
    console.log(`Error when deleting stat category ${statCategory}:`);
    console.log(err);
  }
};
