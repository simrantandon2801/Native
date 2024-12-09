import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Modal, ScrollView, TouchableOpacity, Alert } from 'react-native';
import * as XLSX from 'xlsx';
import { Checkbox, DataTable } from 'react-native-paper';


const Excel = () => {
  const [excelData, setExcelData] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [apiData, setApiData] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const fetchData = () => {
    fetch('https://underbuiltapi.aadhidigital.com/master/get_temp_users')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then((data) => {
        if (data?.data && Array.isArray(data.data)) {
          setApiData(data.data); 
        } else {
          console.error('API response does not contain an array:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching API data:', error);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleRowSelection = (index: number) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index)
        : [...prevSelected, index]
    );
  };

  const handleSendSelected = async () => {
    if (selectedRows.length === 0) {
      alert('Please select at least one row to send!');
      return;
    }
  
    // Prepare payload with an array of user_ids
    const payload = {
      user_ids: selectedRows.map((index) => apiData[index].user_id),
    };
  
    try {
      const response = await fetch('https://underbuiltapi.aadhidigital.com/master/insert_temp_users_to_users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send data');
      }
  
      const responseData = await response.json();
      console.log('Data sent successfully:', responseData);
      alert('Data sent successfully!');
      fetchData();
    } catch (error) {
      console.error('Error sending data:', error);
      alert('Failed to send data. Please try again.');
    }
  };


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

  const handleImportData = async () => {
    // Prepare payload from the data with the required sequence
    const payload = excelData.slice(1).map((row) => ({
      username: row[0],
      email: row[1],
      first_name: row[2],
      last_name: row[3],
      password: row[4],
      customer_id:0,
    }));

    try {
      
      const response = await fetch('https://underbuiltapi.aadhidigital.com/master/insert_bulk_temp_users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to import data');
      }

      const responseData = await response.json();
      console.log('Data imported successfully:', responseData);
      alert('Data imported successfully!');
      setModalVisible(false);
    } catch (error) {
      console.error('Error importing data:', error);
      alert('Failed to import data. Please try again.');
    }
  };

  return (


    <View style={styles.container}>
      <View style={styles.topContainer}>
      <View style={styles.buttonContainer}>
        <Button title="Import Excel File" onPress={handleFilePicker} />
        {excelData.length > 0 && !modalVisible && (
          <Button title="View Data" onPress={() => setModalVisible(true)} />
        )}
      </View>
      <View style={styles.manageUsersContainer}>
        <Text style={styles.heading}>Imported data</Text>
      </View>
      </View>


      {/* Table Section */}
      {Array.isArray(apiData) && apiData.length > 0 ? (
        <>
        <DataTable>
          <DataTable.Header>
          <DataTable.Title>✔</DataTable.Title>
            <DataTable.Title>S. No.</DataTable.Title>
            <DataTable.Title>Username</DataTable.Title>
            <DataTable.Title>Email</DataTable.Title>
            <DataTable.Title>First Name</DataTable.Title>
            <DataTable.Title>Last Name</DataTable.Title>
            <DataTable.Title>Password</DataTable.Title>
          </DataTable.Header>

          <ScrollView>
            {apiData.map((user, index) => (
              <DataTable.Row key={user.username || index}>
               <DataTable.Cell>
    <TouchableOpacity
      onPress={() => {
        setSelectedRows((prev) =>
          prev.includes(index)
            ? prev.filter((i) => i !== index) // Deselect
            : [...prev, index] // Select
        );
      }}
    >
      <Text>{selectedRows.includes(index) ? '☑' : '☐'}</Text>
    </TouchableOpacity>
  </DataTable.Cell>
                <DataTable.Cell>{index + 1}</DataTable.Cell>
                <DataTable.Cell>{user.username || "N/A"}</DataTable.Cell>
                <DataTable.Cell>{user.email || "N/A"}</DataTable.Cell>
                <DataTable.Cell>{user.first_name || "N/A"}</DataTable.Cell>
                <DataTable.Cell>{user.last_name || "N/A"}</DataTable.Cell>
                <DataTable.Cell>{user.password || "N/A"}</DataTable.Cell>
              </DataTable.Row>
            ))}
          </ScrollView>
        </DataTable>
        <TouchableOpacity
        style={styles.sendButton}
        onPress={handleSendSelected}
        disabled={selectedRows.length === 0}
      >
        <Text style={styles.sendButtonText}>
          {selectedRows.length > 0
            ? `Approve (${selectedRows.length} Selected)`
            : 'Approve'}
        </Text>
      </TouchableOpacity>
    </>
      ) : (
        <Text style={styles.noDataText}>No data available</Text>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
          
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
            <View style={styles.buttons}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.importButtonclose}>
                <Text style={styles.importTextclose}>Close</Text>
              </TouchableOpacity>
           
              <TouchableOpacity onPress={handleImportData} style={styles.importButton}>
                <Text style={styles.importText}>Import Data</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    
  },
  topContainer: {
    justifyContent: 'flex-start', 
    alignItems: 'center',        
    marginTop: 20,   
             
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
    gap:15
   
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
    elevation: 5, 
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeText: {
    fontSize: 24,
    color: '#333',
    backgroundColor:'red'
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
  sendButton: {
    marginVertical: 20,
    backgroundColor: '#5bc0de',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
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
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  importButton: {
    padding: 10,
    backgroundColor: '#5bc0de',
    borderRadius: 5,
  },
  importText: {
    color: '#fff',
    textAlign: 'center',
  },
  manageUsersContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#f4f4f4',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f4f4f4',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  actionText: {
    fontSize: 14,
  },
  middleActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
  leftAction: {
    marginRight: 10,
  },
  rightAction: {
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 60,
  },
  submitButton: {
    backgroundColor: '#044086',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 15,
    marginRight: 10,
    paddingHorizontal: 16,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  noDataText: {
    textAlign: 'center',
    margin: 20,
    fontSize: 16,
    color: '#757575',
  },
  importButtonclose: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  importTextclose: {
    color: '#fff',
    textAlign: 'center',
  },

});

export default Excel;
