import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import * as XLSX from 'xlsx';

const Excel = () => {
  const [excelData, setExcelData] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleFilePicker = async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.xlsx';
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const header = jsonData[0];
        const bodyData = jsonData.slice(1);
        setExcelData([header, ...bodyData]);
      };
      reader.readAsArrayBuffer(file);
    };
    fileInput.click();
  };

  const handleOkClick = () => {
    // Prepare payload from the data with the required sequence
    const payload = excelData.slice(1).map((row) => ({
      username: row[0],
      email: row[1],
      first_name: row[2],
      last_name: row[3],
      password: row[4],
    }));

    // Send data to API (replace with your API call logic)
    console.log('Sending payload:', payload);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <Button title="Import Excel File" onPress={handleFilePicker} />
        {excelData.length > 0 && !modalVisible && (
          <Button title="View Data" onPress={() => setModalVisible(true)} />
        )}
      </View>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>✖</Text>
            </TouchableOpacity>
            <ScrollView style={styles.tableContainer}>
              <View style={styles.headerRow}>
                {excelData[0]?.map((header, index) => (
                  <View key={index} style={styles.headerCell}>
                    <Text style={styles.headerText}>{header}</Text>
                  </View>
                ))}
              </View>
              {excelData.slice(1).map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                  {row.map((cell, cellIndex) => (
                    <View key={cellIndex} style={styles.cell}>
                      <Text style={styles.cellText}>{cell}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </ScrollView>
            <Button title="OK" onPress={handleOkClick} style={styles.okButton} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5, // Shadow effect
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ddd',
    borderRadius: 15,
    padding: 5,
  },
  closeText: {
    fontSize: 20,
    color: '#333',
  },
  tableContainer: {
    maxHeight: 300,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
  },
  headerCell: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  cellText: {
    fontSize: 14,
    color: '#333',
  },
  okButton: {
    marginTop: 10,
  },
});

export default Excel;
