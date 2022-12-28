import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import GS from '../shared/GlobalStyles';
import * as SM from '../shared/StorageManager';

const ImportExport = () => {
  const { statCategories } = useSelector((state: RootState) => state.main);

  const [exportMessage, setExportMessage] = useState<string>('');
  const [importMessage, setImportMessage] = useState<string>('');

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
        Press "Export" to export all of your stats in .json format. You can use this file to back up your data
        and restore it later using the "Import" button below. WARNING: this will overwrite any existing stat
        categories that have the same name as one of the stat categories in the backup file.
      </Text>
      {exportMessage !== '' && <Text style={{ ...GS.normalText, color: 'grey' }}>{exportMessage}</Text>}
      <View style={styles.button}>
        <Button onPress={exportData} title="Export" color="red" />
      </View>
      {importMessage !== '' && <Text style={{ ...GS.normalText, color: 'grey' }}>{importMessage}</Text>}
      <View style={styles.button}>
        <Button onPress={importData} title="Import" color="blue" />
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
