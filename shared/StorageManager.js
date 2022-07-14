import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';

const dataPoints = ['statTypes', 'entries', 'lastId'];
const backupPath = RNFS.DownloadDirectoryPath + '/Stat_Tracker_Backup.json';
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
    if (verbose) console.log(`Error while searching for key ${key}:`);
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
    if (verbose) console.log(`Error while setting data for key ${key}:`);
    console.log(err);
  }
};

export const deleteData = async (statCategory, request) => {
  const key = statCategory + '-' + request;

  try {
    if (verbose) console.log(`Deleting data for key ${key}`);

    await AsyncStorage.removeItem(key);
  } catch (err) {
    if (verbose) console.log(`Error while deleting data at key ${key}:`);
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
    if (verbose) console.log('Error while retrieving stat categories:');
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
    if (verbose) console.log('Error while setting stat categories:');
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

        if (verbose)
          console.log(
            `Changing the data from ${prevCategory}-${i} to ${statCategory}-${i}:`,
          );

        await setData(statCategory, i, temp);
        await deleteData(prevCategory, i);
      }
    }

    await setStatCategories(newStatCategories);
  } catch (err) {
    if (verbose)
      console.log(`Error while editing stat category ${prevCategory}:`);
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
    if (verbose)
      console.log(`Error while deleting stat category ${statCategory}:`);
    console.log(err);
  }
};

export const exportData = async () => {
  try {
    if (verbose) console.log('Exporting backup file');

    let data = {};
    data.statCategories = await getStatCategories();
    data.backup = [];

    for (let i of data.statCategories) {
      for (let j of dataPoints) {
        // Save every piece of data in the app's storage in a format that
        // can be used by setData() later when importing
        data.backup.push({
          statCategory: i.name,
          request: j,
          data: await getData(i.name, j),
        });
      }
    }

    data = JSON.stringify(data);

    if (verbose) console.log(data);

    await RNFS.writeFile(backupPath, data, 'utf8');

    return `Successfully exported backup file to ${backupPath}`;
  } catch (err) {
    console.log(err);
    return 'Error while exporting backup file';
  }
};

// Deletes old stat categories (based on the passed array) and imports backup
export const importData = async statCategories => {
  try {
    if (verbose) console.log('Importing backup file');

    const data = JSON.parse(await RNFS.readFile(backupPath));

    if (verbose) console.log(data);

    // Check validity of the received data
    if (data.statCategories) {
      // Go through the old stat categories and add any that are not to be overwritten
      // by the backup file due to having the same name
      for (let i of statCategories) {
        if (!data.statCategories.find(item => item.name === i.name)) {
          data.statCategories.push(i);
        }
      }

      setStatCategories(data.statCategories);

      for (let i of data.backup) {
        setData(i.statCategory, i.request, i.data);
      }

      return 'Successfully imported backup file';
    } else {
      return 'Backup file is empty';
    }
  } catch (err) {
    console.log(err);
    return 'Error while importing backup file';
  }
};
