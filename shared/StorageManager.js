import AsyncStorage from '@react-native-async-storage/async-storage';

const dataPoints = ['statTypes', 'entries', 'lastId'];
const verbose = false;

export const getData = async (statCategory, request) => {
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

export const setData = async (statCategory, request, data) => {
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

export const deleteData = async (statCategory, request) => {
  const key = statCategory + '-' + request;

  try {
    if (verbose) console.log(`Deleting data for key ${key}`);

    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.log(`Error when deleting data at key ${key}:`);
    console.log(err);
  }
};

export const getStatCategories = async () => {
  try {
    if (verbose) console.log('Getting statCategories');

    let data = await AsyncStorage.getItem('statCategories');
    data = JSON.parse(data);

    if (verbose) console.log(data);

    // Check that the data is valid
    if (data.length > 0 && data[0].name) {
      return data;
    }
  } catch (err) {
    console.log('Error when retrieving stat categories:');
    console.log(err);
  }

  return null;
};

export const setStatCategories = async data => {
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

// Edits stat category by removing old keys in the storage and saving them again
// with the new name if it was renamed and then saving the list of stat categories
export const editStatCategory = async (
  newStatCategories,
  statCategory,
  prevCategory,
) => {
  try {
    if (verbose) console.log(`Editing stat category ${prevCategory}`);

    if (statCategory !== prevCategory) {
      for (let i of dataPoints) {
        const temp = await getData(prevCategory, i);

        if (verbose) {
          console.log(
            `Changing the data from ${prevCategory}-${i} to ${statCategory}-${i}:`,
          );
          console.log(temp);
        }

        await setData(statCategory, i, temp);
        await deleteData(prevCategory, i);
      }
    }

    await setStatCategories(newStatCategories);
  } catch (err) {
    console.log(`Error when editing stat category ${prevCategory}:`);
    console.log(err);
  }
};

// Sets the new list of stat categoies after a deletion and deletes all data used for it
// The input is an array of the new list of categories and the name of the category to be deleted
export const deleteStatCategory = async (newStatCategories, statCategory) => {
  try {
    if (verbose) console.log(`Deleting stat category ${statCategory}`);

    for (let i of dataPoints) {
      await deleteData(statCategory, i);
    }

    await setStatCategories(newStatCategories);
  } catch (err) {
    console.log(`Error when deleting stat category ${statCategory}:`);
    console.log(err);
  }
};
