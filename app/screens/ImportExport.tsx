import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { exportData, importData, clearAllMessages } from '../redux/importExportSlice';
import GS from '../shared/GlobalStyles';

const ImportExport = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { exportSuccess, exportError, importSuccess, importError } = useSelector(
    (state: RootState) => state.importExport,
  );
  const { statCategories, lastCategoryId } = useSelector((state: RootState) => state.main);

  useEffect(() => {
    dispatch(clearAllMessages());
  }, []);

  const onExportData = () => {
    dispatch(exportData());
  };

  const onImportData = () => {
    dispatch(importData({ statCategories, lastCategoryId }));
  };

  return (
    <View style={GS.container}>
      <Text style={styles.text}>
        Press "Export" to export all of your stats in .json format. You can use this file to back up your data
        and restore it later using the "Import" button below.
      </Text>
      {exportSuccess !== '' && <Text style={{ ...styles.text, color: 'grey' }}>{exportSuccess}</Text>}
      {exportError !== '' && <Text style={{ ...styles.text, color: 'red' }}>{exportError}</Text>}
      <View style={styles.button}>
        <Button onPress={onExportData} title="Export" color="red" />
      </View>
      {importSuccess !== '' && <Text style={{ ...styles.text, color: 'grey' }}>{importSuccess}</Text>}
      {importError !== '' && <Text style={{ ...styles.text, color: 'red' }}>{importError}</Text>}
      <View style={styles.button}>
        <Button onPress={onImportData} title="Import" color="blue" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
    marginHorizontal: 40,
  },
  text: {
    ...GS.normalText,
    margin: 20,
  },
});

export default ImportExport;
