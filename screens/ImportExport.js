import React, {useState, useEffect} from 'react';
import {View, Text, Button, Alert, StyleSheet} from 'react-native';
import {GlobalStyles} from '../shared/GlobalStyles.js';
import * as SM from '../shared/StorageManager.js';

const ImportExport = ({route}) => {
  const [exportMessage, setExportMessage] = useState('');
  const [importMessage, setImportMessage] = useState('');
  const [statCategories, setStatCategories] = useState([]);

  // Passed data should be: {statCategories}
  const passedData = route.params;

  useEffect(() => {
    // Check that we received valid data and if so - save it.
    if (Object.keys(passedData).length > 0) {
      if (passedData.statCategories) {
        setStatCategories(passedData.statCategories);
      }
    }
  }, [passedData]);

  const exportData = async () => {
    const message = await SM.exportData();
    setExportMessage(message);
    setImportMessage('');
  };

  const importData = async () => {
    const message = await SM.importData(statCategories);
    setImportMessage(message);
    setExportMessage('');
  };

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.normalText}>
        Press "Export" to export all of your stats in .json format. WARNING:
        this will overwrite any existing files with the same name. You can use
        this file to back up your data and restore it later using the "Import"
        button below. For that to work you must place a backup file with the
        name "Stat_Tracker_Backup.json" in your Downloads folder. WARNING: this
        will overwrite any existing stat categories that have the same name as
        one of the stat categories in the backup file.
      </Text>
      {exportMessage !== '' && (
        <Text style={{...GlobalStyles.normalText, color: 'grey'}}>
          {exportMessage}
        </Text>
      )}
      <View style={styles.button}>
        <Button onPress={() => exportData()} title="Export" color="red" />
      </View>
      {importMessage !== '' && (
        <Text style={{...GlobalStyles.normalText, color: 'grey'}}>
          {importMessage}
        </Text>
      )}
      <View style={styles.button}>
        <Button onPress={() => importData()} title="Import" color="blue" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
    marginHorizontal: 40,
  },
});

export default ImportExport;
