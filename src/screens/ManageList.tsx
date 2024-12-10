/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  TextInput,
  Module,
  Alert,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {DataTable, Icon, IconButton, Menu} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import { addmodule, fetchModules } from '../database/RestData';
// Define the User type to ensure type safety
import Header from '../header/header';
interface User {
  id: number;
  modulename: string;
  parentmodule: string;
  status: string;
  order: string;
  createdby: string;
  actions: string;
 
}
const {height} = Dimensions.get('window');
const ManageList: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modulename, setmoduleName] = useState('');
  const [url, seturl] = useState('');
  //const [remark, setRemark] = useState('');
  const [display, setDisplay] = useState('');

  const [manager, setManager] = useState('');
  const [parentmodule, setParentmodule] = useState('');
  const [actionsVisible, setActionsvisible] = useState(false); // State to control menu visibility
  const [modules, setModules] = useState<Module[]>([]);
  const [parentModules, setParentModules] = useState<any[]>([]);
  const fetchParentModules = async () => {
    try {
      const response = await fetch('https://underbuiltapi.aadhidigital.com/master/get_modules');
      const data = await response.json();
      console.log('Raw API Response:', data);
  
      if (data.status === 'success' && data.data && Array.isArray(data.data.modules)) {
        const parentModules = data.data.modules.map((module) => ({
          label: module.module_name || 'Unnamed Module', 
          value: module.module_id.toString(), 
        }));
        console.log('Mapped Parent Modules:', parentModules);
        setParentModules(parentModules);
      } else {
        console.error('Unexpected API response format:', data);
      }
    } catch (error) {
      console.error('Error fetching parent modules:', error);
    }
  };
  
  useEffect(() => {
    console.log('Calling fetchParentModules...');
    fetchParentModules();
  }, []);
  const toggleMenu = () => setActionsvisible(prev => !prev);

  const submitHandler = async () => {
    try {
     
      const requestBody = {
        
        module_name: modulename, 
        module_level: 'Level 1', 
        parent_module_id: parentmodule,
        url:url,
        order_id:display

        
      };

      const response = await addmodule(requestBody)

      const data = await JSON.parse(response);
 
      console.log('Insert Module API Response:', data);
 
      Alert.alert('Module inserted successfully!');

      setIsModalVisible(false);
      
    } catch (error) {
     
      console.error('Insert Module API Error:', error);
      Alert.alert('Failed to insert the module. Please try again later.');
    }
  };
  const getModules = async () => {
    try {
      const response = await fetchModules('');
      const result = await JSON.parse(response);
  
     
      if (result?.data?.modules) {
        setModules(result.data.modules);
      } else {
        console.error('Unexpected API response structure:', result);
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  useEffect(() => {
    getModules();
  }, []);
  return (
    <>
    <header />
      {/* Manage Users Section */}
      <View style={styles.manageUsersContainer}>
        <Text style={styles.heading}>Manage Module</Text>
      </View>

      {/* Action Bar */}
      <View style={styles.actions}>
      {/*   <TouchableOpacity style={[styles.actionButton, styles.leftAction]}>
          <IconButton icon="trash-can-outline" size={16} color="#344054" />
          <Text style={[styles.actionText, { color: '#344054' }]}>Delete</Text>
        </TouchableOpacity> */}
        <View style={styles.middleActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setIsModalVisible(true)}>
            <IconButton icon="plus" size={16} color="#044086" />
            <Text style={[styles.actionText, { color: '#044086' }]}>
              Add Module
            </Text>
          </TouchableOpacity>
        </View>
       {/*  <TouchableOpacity style={[styles.actionButton, styles.rightAction]}>
          <IconButton icon="filter" size={16} color="#344054" />
          <Text style={[styles.actionText, { color: '#344054' }]}>Filters</Text>
        </TouchableOpacity> */}
      </View>

      {/* Table Section */}
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>S. No.</DataTable.Title>
          <DataTable.Title>Module Name</DataTable.Title>
          {/* <DataTable.Title>Module Level</DataTable.Title> */}
          <DataTable.Title>Parent Module Name</DataTable.Title>
          <DataTable.Title>URL</DataTable.Title>
          <DataTable.Title>Status</DataTable.Title>
          <DataTable.Title>Created at</DataTable.Title>
        {/*   <DataTable.Title>Action</DataTable.Title> */}
          {/* <DataTable.Title>Updated at</DataTable.Title>
          <DataTable.Title>Created by</DataTable.Title>
          <DataTable.Title>Updated by</DataTable.Title> */}
        </DataTable.Header>

        <ScrollView style={{maxHeight:500,}} >
        {modules.map((module, index) => (
  <DataTable.Row key={module.module_id}>
    <DataTable.Cell>{index + 1}</DataTable.Cell>
    <DataTable.Cell>
      {module.module_name === "string" ? "No Name Provided" : module.module_name}
    </DataTable.Cell>
    {/* <DataTable.Cell>{module.module_level || "N/A"}</DataTable.Cell> */}
    <DataTable.Cell>
  {module.parent_module === "root module" ? "-------" : module.parent_module || "N/A"}
    </DataTable.Cell>

    <DataTable.Cell>{module.url || "N/A"}</DataTable.Cell>
    <DataTable.Cell>
      {module.is_active ? "Active" : "Inactive"}
    </DataTable.Cell>
    <DataTable.Cell>
      {module.created_at ? new Date(module.created_at).toLocaleString() : "N/A"}
    </DataTable.Cell>
   {/*  <DataTable.Cell>
      {module.updated_at ? new Date(module.updated_at).toLocaleString() : "N/A"}
    </DataTable.Cell>
    <DataTable.Cell>{module.created_by || "N/A"}</DataTable.Cell>
    <DataTable.Cell>{module.updated_by || "N/A"}</DataTable.Cell> */}

{/* <DataTable.Cell>
                <Menu
                  visible={actionsVisible}
                  onDismiss={toggleMenu}
                  anchor={
                    <TouchableOpacity onPress={toggleMenu}>
                      <IconButton icon="dots-vertical" size={20} />
                    </TouchableOpacity>
                  }>
                  <Menu.Item
                    onPress={() => console.log('Edit Permissions')}
                    title="Edit Permissions"
                  />
                  <Menu.Item
                    onPress={() => console.log('Activate/Deactivate')}
                    title="Activate/Deactivate"
                  />
                  <Menu.Item onPress={() => console.log('Delete')} title="Delete" />
                </Menu>
              </DataTable.Cell> */}
  </DataTable.Row>
))}

        </ScrollView>
      </DataTable>

      <Modal
        visible={isModalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>Add New Module</Text>

            {/* Input Fields for Name and Email */}

            <View style={styles.inputRow}>
              <View style={styles.inputWrapper}>
                <Text style={styles.label} >* Parent Module</Text>
                <Picker
  selectedValue={parentmodule} 
  onValueChange={(itemValue) => setParentmodule(itemValue)} 
>
  {parentModules.map((module) => (
    <Picker.Item 
      key={module.module_name} 
      label={module.label}  
      value={module.parent_module_id}  
    />
  ))}
</Picker>
              </View>
            </View>
            <View style={styles.inputRow}>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>* Module Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter module name"
                  value={modulename}
                  onChangeText={setmoduleName}
                />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>* url</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter url"
                  //keyboardType="email-address"
                  value={url}
                  onChangeText={seturl}
                />
              </View>
            </View>
            <View style={styles.inputRow}>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>* Display order</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Display order"
                  value={display}
                  onChangeText={setDisplay}
                />
              </View>
             {/*  <View style={styles.inputWrapper}>
                <Text style={styles.label}>* Remark</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter remark"
                  //keyboardType="email-address"
                  value={remark}
                  onChangeText={setRemark}
                />
              </View> */}
            </View>

           
            <View
              style={{flexDirection: 'row', justifyContent: 'center', gap: 14}}>
              <TouchableOpacity style={styles.submitButton} onPress={submitHandler}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>

              {/* Close Button */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => setIsModalVisible(false)}>
                <Text style={styles.submitButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
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
  table: {
    marginTop: 10,
    paddingHorizontal: 10,
    //maxHeight: 800,
  },
  tableRow: {
    flexDirection: 'row',
    //paddingVertical: 10,
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#757575',
    maxHeight: 500,
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
  },
  center: {
    textAlign: 'center',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '40%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 40,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 60,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  inputWrapper: {
    flex: 1,
    alignItems: 'left', // Centers the label above the input
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#044086',
    marginBottom: 5, // Adds space between the label and the input
  },
  input: {
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#000',
    borderBottomWidth: 1.5,
    borderBottomColor: '#044086',
    borderWidth: 0,
    outlineStyle: 'none',
    width: '100%', // Ensures input takes up the full width of the container
  },
  picker: {
    height: 50,
    borderBottomWidth: 1.5,
    borderBottomColor: '#044086',
    backgroundColor: 'transparent',
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
});

export default ManageList;
