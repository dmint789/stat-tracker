import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScopedStorage from 'react-native-scoped-storage';
import { formatDate } from './GlobalFunctions';
import { IStatCategory, IBackupData, dataPoints } from './DataStructure';

const verbose: number = __DEV__ ? 1 : 0;

export const getData = async (categoryId: number, request: string) => {
  const key: string = categoryId + '_' + request;

  try {
    if (verbose) console.log(`Getting data for key ${key}`);

    const data = JSON.parse(await AsyncStorage.getItem(key));

    if (verbose) console.log(JSON.stringify(data, null, 2));

    if (data) return data;
    else if (verbose) console.log(`No data found for key ${key}`);
  } catch (err) {
    console.error(`Error while searching for key ${key}: ${err}`);
  }

  return null;
};

export const setData = async (categoryId: number, request: string, data: any) => {
  const key = categoryId + '_' + request;

  try {
    if (verbose) {
      console.log(`Setting data for key ${key}:`);
      console.log(JSON.stringify(data, null, 2));
    }

    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error while setting data for key ${key}: ${err}`);
  }
};

export const deleteData = async (categoryId: number, request: string) => {
  const key = categoryId + '_' + request;

  try {
    if (verbose) console.log(`Deleting data for key ${key}`);

    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.log(`Error while deleting data at key ${key}:`);
    console.log(err);
  }
};

export const getStatCategories = async (): Promise<IStatCategory[]> => {
  try {
    if (verbose) console.log('Getting statCategories');

    let data: IStatCategory[] = JSON.parse(await AsyncStorage.getItem('statCategories'));

    if (verbose) console.log(JSON.stringify(data, null, 2));

    // Check that the data is valid (there is always an id property in every element of the array)
    if (data?.length > 0 && typeof data[0].id === 'number') return data;
  } catch (err) {
    console.log(`Error while retrieving stat categories: ${err}`);
  }

  return null;
};

export const getLastCategoryId = async (): Promise<number> => {
  try {
    if (verbose) console.log('Getting lastCategoryId');

    const data = await AsyncStorage.getItem('lastCategoryId');

    if (data === null) {
      console.error('lastCategoryId not found');
      return null;
    }

    if (verbose) console.log(data);

    return Number(data);
  } catch (err) {
    console.error(`Error while retrieving lastCategoryId: ${err}`);
  }

  return null;
};

export const setLastCategoryId = async (id: number) => {
  try {
    if (verbose) console.log(`Setting lastCategoryId to ${id}`);

    await AsyncStorage.setItem('lastCategoryId', String(id));
  } catch (err) {
    console.error(`Error while incrementing lastCategoryId: ${err}`);
  }
};

export const setStatCategories = async (statCategories: IStatCategory[]) => {
  try {
    if (verbose === 2) {
      console.log('Setting statCategories to:');
      console.log(JSON.stringify(statCategories, null, 2));
    }

    await AsyncStorage.setItem('statCategories', JSON.stringify(statCategories));
  } catch (err) {
    console.log(`Error while setting stat categories: ${err}`);
  }
};

// Sets the new list of stat categoies after a deletion and deletes all data used for it
export const deleteStatCategory = async (category: IStatCategory, newStatCategories: IStatCategory[]) => {
  try {
    if (verbose) console.log(`Deleting stat category ${category.name}`);

    for (let i of dataPoints) {
      await deleteData(category.id, i);
    }

    await setStatCategories(newStatCategories);
  } catch (err) {
    console.log(`Error while deleting stat category ${category.name}:`);
    console.log(err);
  }
};

export const importData = async (
  statCategories: IStatCategory[],
  lastCategoryId: number,
): Promise<{ message: string; error: string }> => {
  try {
    if (verbose) console.log('Importing backup file');

    const backupFile = await ScopedStorage.openDocument(true, 'utf8');

    const data: IBackupData = JSON.parse(backupFile.data);

    if (verbose) {
      console.log('Stat categories before import:');
      console.log(JSON.stringify(statCategories, null, 2));
      console.log('Backup file data:');
      console.log(JSON.stringify(data, null, 2));
    }

    if (data.lastCategoryId > lastCategoryId) {
      setLastCategoryId(data.lastCategoryId);
    }

    if (data.statCategories) {
      let successMessage = 'Successfully imported backup';
      const skippedCategories: string[] = [];

      // Go through the old stat categories and add any that are not to be overwritten
      // by the backup file due to having the same id
      if (verbose && statCategories.length) console.log(`Ignoring stat categories: ${statCategories}`);

      data.statCategories = data.statCategories.filter((statCategory) => {
        if (!statCategories.find((el) => el.id === statCategory.id || el.name === statCategory.name)) {
          return true;
        } else {
          skippedCategories.push(statCategory.name);
          return false;
        }
      });

      if (skippedCategories.length > 0) {
        successMessage +=
          ', but these stat categories in the backup were skipped due to the IDs or names overlapping with one of your existing stat categories: ';
        skippedCategories.forEach((el) => (successMessage += `${el}, `));
        successMessage = 'CAUTION! ' + successMessage.slice(0, -2);
      }

      for (let i of dataPoints) {
        for (let statCategory of data.statCategories) {
          setData(statCategory.id, i, data[i][statCategory.id]);
        }
      }

      setStatCategories([...statCategories, ...data.statCategories]);

      return { message: successMessage, error: '' };
    } else {
      return { error: 'Backup file is invalid', message: '' };
    }
  } catch (err) {
    return { error: `Error while importing backup file: ${err}`, message: '' };
  }
};

export const exportData = async (): Promise<{ message: string; error: string }> => {
  try {
    if (verbose) console.log('Exporting backup file');

    const backupDir: ScopedStorage.FileType = await getBackupDir();

    if (backupDir) {
      const backupFileName: string = 'Stat_Tracker_Backup_' + formatDate(new Date(), '_', true);
      const data: IBackupData = {
        statCategories: (await getStatCategories()) || [],
        lastCategoryId: await getLastCategoryId(),
        statTypes: {},
        entries: {},
      };

      for (let i of data.statCategories) {
        for (let j of dataPoints) {
          data[j][i.id] = await getData(i.id, j);
        }
      }

      if (verbose) console.log('Data to be exported:', JSON.stringify(data, null, 2));

      await ScopedStorage.writeFile(
        backupDir.uri,
        JSON.stringify(data),
        backupFileName,
        'application/json',
        'utf8',
      );

      return {
        message: `Successfully exported backup file as ${backupFileName}.json`,
        error: '',
      };
    } else {
      return { error: 'Error while getting permission to backup directory', message: '' };
    }
  } catch (err) {
    return { error: String(err), message: '' };
  }
};

// Will return backup directory uri or null if there's an error
const getBackupDir = async (): Promise<ScopedStorage.FileType> => {
  // Get the backup directory from storage and get list of directories the app has permission to
  let backupDir: ScopedStorage.FileType = JSON.parse(await AsyncStorage.getItem('backupDirectory'));
  const persistedUris: string[] = await ScopedStorage.getPersistedUriPermissions();
  let newDirRequired = false;

  if (verbose) {
    console.log('Backup directory info:', backupDir);
    console.log('Persisted URIs info:', persistedUris);
  }

  // Check for issues with the backup directory
  if (!backupDir) {
    if (verbose) console.log('Backup directory not in async storage');

    newDirRequired = true;
  } else {
    try {
      const files = await ScopedStorage.listFiles(backupDir.uri);

      if (verbose) console.log('Files in backup directory:', files);
    } catch (err) {
      if (verbose) console.log('Backup directory does not exist');

      newDirRequired = true;
    }
  }
  if (!newDirRequired && !persistedUris.find((uri) => backupDir.uri.includes(uri))) {
    if (verbose) console.log('Backup directory not in persisted URIs');

    newDirRequired = true;
  }

  // Request new one if needed
  if (newDirRequired) {
    if (verbose) console.log('Requesting new backup directory');
    backupDir = await ScopedStorage.openDocumentTree(true);

    if (!backupDir) {
      if (verbose) console.log('Still no backup directory available');
      return null;
    } else {
      if (verbose) console.log(`Setting backup directory to ${JSON.stringify(backupDir)}`);
      await AsyncStorage.setItem('backupDirectory', JSON.stringify(backupDir));
    }
  }
  return backupDir;
};

// USED FOR DEVELOPMENT
// export const deleteAllData = async (): Promise<void> => {
//   try {
//     if (verbose) console.log('Deleting all data');

//     await AsyncStorage.removeItem('lastCategoryId');
//     await AsyncStorage.removeItem('backupDirectory');

//     const categories = JSON.parse(await AsyncStorage.getItem('statCategories'));

//     if (categories?.length > 0) {
//       for (let i of categories) {
//         for (let j of dataPoints) {
//           deleteData(i.id, j);
//         }
//       }

//       await AsyncStorage.removeItem('statCategories');
//     }
//   } catch (err) {
//     console.error(`Error while deleting all data: ${err}`);
//   }
// };
