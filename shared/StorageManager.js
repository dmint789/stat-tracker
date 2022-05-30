import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getData = async (statCategory, request) => {
  const key = statCategory + '-' + request;

  try {
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

export const getStatCategories = async () => {
  try {
    const data = await AsyncStorage.getItem('statCategories');

    if (data.length > 0) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.log('Error when retrieving stat categories');
    console.log(err);
  }

  return null;
};

export const setData = async (statCategory, request, data) => {
  const key = statCategory + '-' + request;

  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.log(`Error when setting data for key ${key}:`);
    console.log(err);
  }
};

export const setStatCategories = async data => {
  try {
    await AsyncStorage.setItem('statCategories', JSON.stringify(data));
  } catch (err) {
    console.log('Error when setting stat categories');
    console.log(err);
  }
};

export const deleteData = async (statCategory, request) => {
  const key = statCategory + '-' + request;

  try {
    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.log(`Error when deleting data at key ${key}:`);
    console.log(err);
  }
};
