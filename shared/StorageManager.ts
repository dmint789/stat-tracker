import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScopedStorage from 'react-native-scoped-storage';
import {formatDate} from './GlobalFunctions';
import {IStatCategory, BackupData, dataPoints} from './DataStructure';

const verbose = false;

export const getData = async (statCategory: string, request: string) => {
  const key: string = statCategory + '_' + request;

  try {
    if (verbose) console.log(`Getting data for key ${key}`);

    const data: any = JSON.parse(await AsyncStorage.getItem(key));

    if (verbose) console.log(data);

    if (data) {
      return data;
    }
  } catch (err) {
    console.log(`Error while searching for key ${key}:`);
    console.log(err);
  }

  return null;
};

export const setData = async (
  statCategory: string,
  request: string,
  data: any,
) => {
  const key = statCategory + '_' + request;

  try {
    if (verbose) {
      console.log(`Setting data for key ${key}:`);
      console.log(data);
    }

    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.log(`Error while setting data for key ${key}:`);
    console.log(err);
  }
};

export const deleteData = async (statCategory: string, request: string) => {
  const key = statCategory + '_' + request;

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

    let data: IStatCategory[] = JSON.parse(
      await AsyncStorage.getItem('statCategories'),
    );

    if (verbose) console.log(data);

    // Check that the data is valid (there is always a name property in every element of the array)
    if (data.length > 0 && data[0].name) return data;
  } catch (err) {
    console.log(`Error while retrieving stat categories: ${err}`);
  }

  return null;
};

export const setStatCategories = async (statCategories: IStatCategory[]) => {
  try {
    if (verbose) {
      console.log('Setting statCategories to:');
      console.log(statCategories);
    }

    await AsyncStorage.setItem(
      'statCategories',
      JSON.stringify(statCategories),
    );
  } catch (err) {
    console.log(`Error while setting stat categories: ${err}`);
  }
};

export const reorderStatCategories = async (statCategory: IStatCategory) => {
  try {
    if (verbose)
      console.log(
        `Reordering statCategories with ${statCategory.name} at the top`,
      );

    let newStatCategories = await getStatCategories();
    newStatCategories = [
      statCategory,
      ...newStatCategories.filter(item => item.name !== statCategory.name),
    ];

    await setStatCategories(newStatCategories);
  } catch (err) {
    console.log(`Error while reordering stat categories: ${err}`);
  }
};

export const editStatCategory = async (
  prevCategory: IStatCategory,
  statCategory: IStatCategory,
) => {
  try {
    if (verbose) console.log(`Editing stat category ${prevCategory.name}`);

    // If the name was changed, delete old keys from async storage and save them under the new name
    if (statCategory.name !== prevCategory.name) {
      for (let i of dataPoints) {
        const temp: any = await getData(prevCategory.name, i);

        if (verbose)
          console.log(
            `Changing the data from ${prevCategory.name}_${i} to ${statCategory.name}_${i}:`,
          );

        await setData(statCategory.name, i, temp);
        await deleteData(prevCategory.name, i);
      }
    }

    let newStatCategories: IStatCategory[] = await getStatCategories();
    newStatCategories = newStatCategories.map(item =>
      item.name === prevCategory.name ? statCategory : item,
    );

    await setStatCategories(newStatCategories);
  } catch (err) {
    console.log(`Error while editing stat category ${prevCategory}:`);
    console.log(err);
  }
};

// Sets the new list of stat categoies after a deletion and deletes all data used for it
export const deleteStatCategory = async (
  newStatCategories: IStatCategory[],
  statCategory: string,
) => {
  try {
    if (verbose) console.log(`Deleting stat category ${statCategory}`);

    for (let i of dataPoints) {
      await deleteData(statCategory, i);
    }

    await setStatCategories(newStatCategories);
  } catch (err) {
    console.log(`Error while deleting stat category ${statCategory}:`);
    console.log(err);
  }
};

export const exportData = async (): Promise<string> => {
  try {
    if (verbose) console.log('Exporting backup file');

    let data = new BackupData();
    data.statCategories = await getStatCategories();

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

    if (verbose) console.log(data);

    const backupDir: ScopedStorage.FileType = await getBackupDir();

    if (backupDir) {
      const backupFile: string =
        'Stat_Tracker_Backup_' + formatDate(new Date(), false);

      await ScopedStorage.writeFile(
        backupDir.uri,
        backupFile,
        'application/json',
        JSON.stringify(data),
      );
      return `Successfully exported backup file to ${backupDir.path}/${backupFile}.json`;
    } else {
      return 'Error while getting permission to backup directory';
    }
  } catch (err) {
    console.log(err);
    return `Error while exporting backup file: ${err}`;
  }
};

// Deletes old stat categories (based on the passed array) and imports backup
export const importData = async (
  statCategories: IStatCategory[],
): Promise<string> => {
  try {
    if (verbose) console.log('Importing backup file');

    // Check for permission to backup directory or request it and continue if there's no error (null value returned)
    if (await getBackupDir()) {
      const backupFile = await ScopedStorage.openDocument(true, 'utf8');
      const data: BackupData = JSON.parse(backupFile.data);

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
        return 'Backup file is invalid';
      }
    } else {
      return 'Error while trying to access backup file';
    }
  } catch (err) {
    console.log(err);
    return `Error while importing backup file: ${err}`;
  }
};

// Will return backup directory uri or null if there's an error
const getBackupDir = async (): Promise<ScopedStorage.FileType> => {
  // Get the backup directory from storage and get list of directories the app has permission to
  let backupDir: any = JSON.parse(
    await AsyncStorage.getItem('backupDirectory'),
  );
  const persistedUris = await ScopedStorage.getPersistedUriPermissions();

  if (verbose) {
    console.log(`Backup directory info:`);
    console.log(backupDir);
  }

  // If directory wasn't in storage or permission to it has been revoked, ask user to give permission and save new directory
  if (!backupDir || persistedUris.indexOf(backupDir.uri) === -1) {
    if (verbose)
      console.log(
        'Backup directory not found in async storage, requesting backup directory from user',
      );

    backupDir = await ScopedStorage.openDocumentTree(true);
    if (!backupDir) return null;

    await AsyncStorage.setItem('backupDirectory', JSON.stringify(backupDir));
  }

  return backupDir;
};
