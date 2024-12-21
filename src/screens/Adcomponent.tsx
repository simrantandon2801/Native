import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Button, CheckBox } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '@env';
interface UserData {
  id: string;  
  displayName: string;
  userPrincipalName: string;
  mail: string;
  mobilePhone: string | null;
  businessPhones: string | null;
  givenName: string | null;
  officeLocation: string | null;
  preferredLanguage: string | null;
  jobTitle: string | null;
  surname: string | null;
}

interface DropdownOption {
  label: string;
  value: string;
}
interface AdComponentProps {
  closeModal: () => void; 
  fetchUser:()=>  void;
}
const AdComponent: React.FC<AdComponentProps> = ({ closeModal,fetchUser }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [dropdownOptions, setDropdownOptions] = useState<DropdownOption[]>([]);
  const [data, setData] = useState<UserData[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
 
  const fetchDropdownOptions = async () => {
    try {
      const token = await AsyncStorage.getItem('Token');
      const response = await fetch(`${BASE_URL}/integration/get_activedirectory_customer_integration?customer_id=1`,
        {
          method: 'GET',  
          headers: {
            'Content-Type': 'application/json', 
            'Authorization': `${token}`,  
          },
        }
      );
      const result = await response.json();
      if (result.status === 'success' && Array.isArray(result.data)) {
        setDropdownOptions(result.data.map((item: any) => ({
          label: item.integration_name,
          value: item.integration_id.toString(),
        })));
      } else {
        console.error('Unexpected response structure:', result);
      }
    } catch (error) {
      console.error('Error fetching dropdown options:', error);
    }
  };
  

  const fetchData = async (optionValue: string) => {
    try {
      const response = await fetch(`${BASE_URL}/integration/get_users?Integration_customer_id=${optionValue}`);
      const result = await response.json();
      if (result.status === 'success' && result.data?.users) {
        setData(result.data.users);  // Access the users array inside the data object
      } else {
        console.error('Unexpected response structure:', result);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleImport = async () => {
    try {
      const selectedData = data.filter((item) => selectedRows.includes(item.id));
      const formattedData = selectedData.map((item) => ({
        businessPhones: item.businessPhones,
        displayName: item.displayName,
        givenName: item.givenName,
        jobTitle: item.jobTitle,
        mail: item.mail,
        mobilePhone: item.mobilePhone,
        officeLocation: item.officeLocation,
        preferredLanguage: item.preferredLanguage,
        surname: item.surname,
        userPrincipalName: item.userPrincipalName,
        id: item.id,
      }));
      const response = await fetch(`${BASE_URL}/integration/addUpdate_ADUsers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

        },
        body: JSON.stringify(formattedData),
      });
      const result = await response.json();
      console.log('Import successful:', result);
    } catch (error) {
      console.error('Error importing data:', error);
    }
    closeModal();
    fetchUser();
  };

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) => {
      if (prev.includes(id)) {
        return prev.filter((rowId) => rowId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]); 
    } else {
      setSelectedRows(data.map((item) => item.id));  
    }
    setSelectAll(!selectAll);  
  };
  const filteredData = data.filter((item) =>
    item.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.mail?.toLowerCase().includes(searchQuery.toLowerCase()) 
  );
  useEffect(() => {
    fetchDropdownOptions();
  }, []);

  useEffect(() => {
    if (selectedOption) {
      fetchData(selectedOption);
    }
  }, [selectedOption]);

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedOption}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedOption(itemValue)}
      >
        <Picker.Item label="Select" value="" />
        
        {dropdownOptions.map((option) => (
          <Picker.Item key={option.value} label={option.label} value={option.value} />
        ))}
      </Picker>
      </View>
      {data.length > 0 && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Name/Mail"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>
      )}

      {data.length > 0 && (
        <FlatList
        data={searchQuery ? filteredData : data}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.tableRow}>
            
            <CheckBox
           
              value={selectedRows.includes(item.id)}
              onValueChange={() => toggleRowSelection(item.id)}
            />
            <Text style={[styles.cell, styles.columnSNo]}>{index + 1}</Text>  
            <Text style={[styles.cell, styles.columnName]}>{item.displayName}</Text> 
            <Text style={[styles.cell, styles.columnJobTitle]}>{item.jobTitle || '-'}</Text> 
            <Text style={[styles.cell, styles.columnEmail]}>{item.mail}</Text>  
            <Text style={[styles.cell, styles.columnMobilePhone]}>{item.mobilePhone || '-'}</Text> 
          </View>
        )}
        ListHeaderComponent={() => (
          <View style={styles.tableHeader}>
              <CheckBox
               //style={styles.check}
                value={selectAll}
                onValueChange={toggleSelectAll} 
                
              />
           <Text style={[styles.headerCell, styles.columnSNo]}>S.No</Text>
    <Text style={[styles.headerCell, styles.columnName]}>Name</Text>
    <Text style={[styles.headerCell, styles.columnJobTitle]}>Job Title</Text>
    <Text style={[styles.headerCell, styles.columnEmail]}>Email</Text>
    <Text style={[styles.headerCell, styles.columnMobilePhone]}>Mobile Phone</Text>
          </View>
          
        )}
      />
     
      )}
       {data.length > 0 && (
        <View style={styles.importButtonContainer}>
          <Button title={`Import Selected (${selectedRows.length} records)`} onPress={handleImport} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  picker: {
    alignItems: 'center',
    width: 150,  
    height: 35,  
    fontSize: 14,  
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,  
    backgroundColor: '#f9f9f9', 
    paddingHorizontal: 10,  
  },
  importButtonContainer: {
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 16,
  },
  Selectall: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#A6A6A6',
    borderBottomWidth: 1,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#A6A6A6',
    paddingVertical: 8,
  },
  columnSNo: {
    width: 50, 
    textAlign: 'center',
  },
  columnName: {
    flex: 2, // Allocate more space for Name
    textAlign: 'left',
  },
  columnJobTitle: {
    flex: 2, // Allocate space for Job Title
    textAlign: 'left',
  },
  columnEmail: {
    flex: 3, // Allocate more space for Email
    textAlign: 'left',
  },
  columnMobilePhone: {
    flex: 2, // Allocate space for Mobile Phone
    textAlign: 'left',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
  },
  pickerContainer: {
    marginBottom: 20, 
    width: '100%',  
    alignItems: 'center', 
  },
  check:{paddingLeft:8,width:24,fontWeight: 'bold'},
  searchContainer: {
    marginBottom: 20, 
    width: '100%',  
    alignItems: 'flex-end', 
  },
  searchInput: {
    alignItems: 'center',
    width: '30%',  
    height: 35,  
    fontSize: 14,  
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,  
    backgroundColor: '#f9f9f9', 
    paddingHorizontal: 10, 
  },
});

export default AdComponent;
