import React, {useState, useEffect} from 'react';
import {View, Text, Button, Alert, StyleSheet} from 'react-native';
import GS from '../shared/GlobalStyles';
import * as SM from '../shared/StorageManager';

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
    <View style={GS.container}>
      <Text style={GS.normalText}>
        Press "Export" to export all of your stats in .json format. You can use
        this file to back up your data and restore it later using the "Import"
        button below. WARNING: this will overwrite any existing stat categories
        that have the same name as one of the stat categories in the backup
        file.
      </Text>
      {exportMessage !== '' && (
        <Text style={{...GS.normalText, color: 'grey'}}>{exportMessage}</Text>
      )}
      <View style={styles.button}>
        <Button onPress={() => exportData()} title="Export" color="red" />
      </View>
      {importMessage !== '' && (
        <Text style={{...GS.normalText, color: 'grey'}}>{importMessage}</Text>
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
