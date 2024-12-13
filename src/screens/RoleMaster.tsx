import React, { ReactNode, useState,useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StyleSheet,View,Text,TouchableOpacity,Modal,ScrollView,Pressable,Dimensions, Alert, TouchableWithoutFeedback} from 'react-native';
import {CheckBox} from 'react-native';

import { IconButton, Menu, DataTable, Button, TextInput } from 'react-native-paper';
import PropTypes from 'prop-types';
import { AddAndEditRole } from '../database/RoleMaster';
import { decodeBase64 } from '../core/securedata';

const { height } = Dimensions.get('window');
const adjustedHeight = height * 0.9;
interface User {
    id: number;
    roleMaster: string;
    ViewModulesAssigned: string;
  }
  interface Module {
      module_id: number;
      module_name: string;
      parent_module_id: number | null;
      is_active: boolean;
      sub_modules: Module[];
    }
    interface Submodule {
      module_id: number;
      module_name: string;
      is_active: boolean;
    }
const RoleMaster = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [actionsVisible, setActionsVisible] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectedUser, setSelectedUser] = useState(null); 
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);
  const [selectedModules, setSelectedModules] = useState<number[]>([]); 
  const [editRoleIndex, setEditRoleIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const[users,setUsers]=useState([])
  const [isAddRoleModalVisible, setAddRoleModalVisible] = useState(false);
  const [isAssignModuleModalVisible, setAssignModuleModalVisible] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);   
  const[role,setRole]=useState([]);
  const [expandedModules, setExpandedModules] = useState<number[]>([]);
  const [role_name, setRoleInput] = useState('');

  const toggleMenu = () => setActionsVisible(!actionsVisible);

  const fetchModules = async () => {
    try {
      const response = await fetch('https://underbuiltapi.aadhidigital.com/master/modules');
      const data = await response.json();
      if (!Array.isArray(data)) {
        console.error('Modules data is not an array:', data);
        return;
      }
      setModules(data);
    } catch (error) {
      console.error('Error fetching modules:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchRoleModules = async () => {
    try {
        const encodedRoleId = await AsyncStorage.getItem('UserType');
        const decodedRoleId = decodeBase64(encodedRoleId ?? ''); 
      const response = await fetch(`https://underbuiltapi.aadhidigital.com/master/get_role_vs_modules?role_id=${decodedRoleId}`);
      const responseData = await response.json();
      console.log('Fetched Role:', JSON.stringify(responseData, null, 2)); 
      
      // Extract role_vs_modules array from the response
      const roleModules = responseData.data?.role_vs_modules || [];
  
      if (response.ok) {
        // Create a map of module_id to is_active status
        const moduleStatusMap = roleModules.reduce((acc: Record<number, boolean>, module: any) => {
            acc[module.module_id] = module.is_active;
            return acc;
          }, {});
  
        // Recursive function to update modules and submodules with is_active
        const updateModules = (moduleList: Module[]): Module[] => {
            return moduleList.map((module) => ({
              ...module,
              is_active: !!moduleStatusMap[module.module_id], 
              sub_modules: module.sub_modules
                ? updateModules(module.sub_modules) 
                : [],
            }));
          };
  
        // Update modules state with the new structure
        //setModules((prevModules) => updateModules(prevModules));
        setModules(updateModules(modules));
      } else {
        console.error('Error fetching role modules:', responseData);
      }
    } catch (error) {
      console.error('Error fetching role modules data:', error);
    }
  };
  useEffect(() => {
    if (isModalVisible) {
      setLoading(true);
      fetchRoleModules().finally(() => setLoading(false));
    }
  }, [isModalVisible]);

  const toggleExpand = (moduleId: number) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId) // Collapse if already expanded
        : [...prev, moduleId] // Expand if not already expanded
    );
  };
  
  useEffect(() => {
    fetchModules();
  }, []);
  const handleViewModules = () => {
    setIsModalVisible(true);
    fetchModules();
  };
  
  const sendUpdatedData = async () => {
    const moduleIds: number[] = [];
    const submoduleIds: number[] = [];
  
    // Collect module and submodule IDs separately
    modules.forEach((module) => {
      if (module.is_active) {
        moduleIds.push(module.module_id); // Add module ID if active
      }
      module.sub_modules?.forEach((submodule) => {
        if (submodule.is_active) {
          submoduleIds.push(submodule.module_id); // Add submodule ID if active
        }
      });
    });
  
    // Combine module IDs and submodule IDs
    const combinedModuleIds = [...moduleIds, ...submoduleIds];
  
    // Log for debugging
    console.log('Selected Module IDs:', JSON.stringify(moduleIds, null, 2));
    console.log('Selected Submodule IDs:', JSON.stringify(submoduleIds, null, 2));
    console.log('Combined Module IDs:', JSON.stringify(combinedModuleIds, null, 2));
  
    if (combinedModuleIds.length === 0) {
      // Handle empty selection case
      const payload = {
        id: 0,
        modules: "", // Empty string for no selection
        role_id: decodeBase64(await AsyncStorage.getItem('UserType') ?? ''),
        created_by: decodeBase64(await AsyncStorage.getItem('UserType') ?? ''),
      };
  
      try {
        const response = await fetch('https://underbuiltapi.aadhidigital.com/master/insert_update_role_vs_module', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
  
        if (!response.ok) throw new Error(`Failed to save data. Status: ${response.status}`);
        Alert.alert('Data saved successfully!');
      } catch (error) {
        console.error('Error sending data:', error);
        Alert.alert('Failed to save data. Please try again.');
      }
  
      return; // Exit early for empty payload
    }
  
    // Proceed with sending the payload if there are selected modules or submodules
    try {
      const encodedRoleId = await AsyncStorage.getItem('UserType');
      const decodedRoleId = decodeBase64(encodedRoleId ?? '');
      const UserType = decodeBase64(await AsyncStorage.getItem('UserType') ?? '');
  
      const payload = {
        id: 0,
        modules: combinedModuleIds.join(','), // Send combined IDs
        role_id: decodedRoleId,
        created_by: UserType,
      };
  
      console.log('Sending Payload:', JSON.stringify(payload, null, 2));
  
      const response = await fetch('https://underbuiltapi.aadhidigital.com/master/insert_update_role_vs_module', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) throw new Error(`Failed to save data. Status: ${response.status}`);
  
      Alert.alert('Data saved successfully!');
    } catch (error) {
      console.error('Error sending data:', error);
      Alert.alert('Failed to save data. Please try again.');
    }
  };
 /*  const users: User[] = [
    {
      id: 1,
      roleMaster: 'Customer Admin',
      ViewModulesAssigned: 'ViewModule',
    },
    {
      id: 2,
      roleMaster: 'Project Manager',
      ViewModulesAssigned: 'ViewModule',
    },
  ]; */
  const updateModuleState = (moduleId: number, newValue: boolean) => {
    const updateModulesRecursively = (moduleList: Module[]): Module[] => {
      return moduleList.map((module) => {
        const updatedModule = {
          ...module,
          is_active: module.module_id === moduleId ? newValue : module.is_active,
          sub_modules: module.sub_modules
            ? updateModulesRecursively(module.sub_modules)  // Update submodules recursively
            : [],
        };
        return updatedModule;
      });
    };
  
    setModules((prevModules) => updateModulesRecursively(prevModules));  // Update state
  };
  const renderModules = (moduleList: Module[], level = 0) => {
    return moduleList.map((module) => (
      <View key={module.module_id} style={[styles.moduleItem, { marginLeft: level * 20 }]}>
        <View style={styles.checkboxRow}>
          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => toggleExpand(module.module_id)}
          >
            <Text style={styles.expandButtonText}>
              {expandedModules.includes(module.module_id) ? '-' : '+'}
            </Text>
          </TouchableOpacity>
  
          <CheckBox
  value={module.is_active}
  disabled={!isEditable}
  onValueChange={(newValue: boolean) => {
    updateModuleState(module.module_id, newValue);
  }}
/>
          <Text style={styles.moduleText}>{module.module_name}</Text>
        </View>
  
        {/* Render submodules if expanded */}
        {expandedModules.includes(module.module_id) &&
          module.sub_modules &&
          renderModules(module.sub_modules, level + 1)}
      </View>
    ));
  };
  //const modules = ['Module 1', 'Module 2', 'Module 3', 'Module 4']; 

  const handleModuleChange = (moduleId: number) => {
    setSelectedModules((prevSelectedModules) =>
      prevSelectedModules.includes(moduleId)
        ? prevSelectedModules.filter((id) => id !== moduleId)
        : [...prevSelectedModules, moduleId]
    );
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedUsers([]); // Deselect all users
    } else {
      setSelectedUsers(users.map((user) => user.id)); // Select all users
    }
    setAllSelected(!allSelected);
  };

  const handleUserSelect = (userId: number) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter((id) => id !== userId)
        : [...prevSelectedUsers, userId]
    );
  };
  const toggleEditMode = async () => {
    if (isEditable) {
      console.log('Edit mode is active. Preparing to save data.');
      console.log('Modules State:', JSON.stringify(modules, null, 2)); // Log the current state of modules
      
      // Check if any modules or submodules are selected
      const activeModules = modules.filter(module => module.is_active);
      console.log('Active Modules:', JSON.stringify(activeModules, null, 2));
  
      // Include detailed logs for active submodules within each active module
      activeModules.forEach(module => {
        if (module.sub_modules?.length) {
          const activeSubmodules = module.sub_modules.filter(submodule => submodule.is_active);
          console.log(`Active Submodules for Module "${module.module_name}":`, JSON.stringify(activeSubmodules, null, 2));
        }

      });
  
      // Send the updated data
      await sendUpdatedData();
    } else {
      console.log('Edit mode is being activated. Modules can now be edited.');
    }
  
    setIsEditable((prev) => !prev); // Toggle the editable state
  };

  
  const closeModal = () => {
    setRoleInput('');
    setEditRoleIndex(null);
    setAddRoleModalVisible(false);
  };
 
  interface Role {
    is_active: any;
    role_level: ReactNode;
    role_name: ReactNode;
    role: string;
 
  }
  
  const handleAddOrEditRole = async () => {
    setLoading(true);
    const newRole = { 
      role_id: 0,  
      role_name:role_name,
      role_level: 0,  
      is_active: true, 
      // auditInfo: auditInfo,  
      // resourceCost: resourceCost  
  };
  console.log(newRole,"value1")
  const res = await AddAndEditRole(newRole);
  console.log(res)

  };


  const handleEditRole = async () => {
    setLoading(true);
    
    const payload = { 
      role_id: selectedUser ? selectedUser.role_id : 0,
      role_name:role_name,
      role_level: 0,  
      // is_active: true, 
      // auditInfo: auditInfo,  
      // resourceCost: resourceCost  
  };
  console.log("value2: ",payload)
  const res = await AddAndEditRole(payload);
  console.log(res)
  
  
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve the token from AsyncStorage
        const token = await AsyncStorage.getItem('Token');
        const uri = 'https://underbuiltapi.aadhidigital.com/master/get_roles';

        console.log('Fetching data from:', uri);

      
        const response = await fetch(uri, {
          method: 'GET',  
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
         
          throw new Error('Network response was not ok');
        }
       
        const result = await response.json();
        console.log(result.data.roles)
        setUsers(result.data.roles)

       
        console.log('API response:', response.status);
        

      
      } catch (err) {
        console.error('Error fetching data:', err);
      
      } finally {
        setLoading(false); 
      }
    };

    fetchData(); 

  }, []);  




 

// const handleDelete = async () => { setLoading(true); 
//   try { const token = await AsyncStorage.getItem('Token'); 
//   const response = await fetch( `https://underbuiltapi.aadhidigital.com/master/delete_roles/${selectedUser._id}`, 
//     { method: 'DELETE', headers: { Authorization: `Bearer ${token}`, }, } );
//      if (!response.ok) throw new Error('Failed to delete role'); 
//      setUsers(users.filter((user) => user._id !== selectedUser._id)); 
// console.log('Role deleted:', selectedUser._id); } 
// catch (err) { console.error('Error:', err); } 
// finally { setLoading(false); setIsActionModalVisible(false); } };






const handleAssign = () => { console.log('Assign action for user:', selectedUser); 
  setIsActionModalVisible(false); };  
  

  return (
    <>
    
      <View style={styles.manageUsersContainer}>
        <Text style={styles.heading}>Manage Role</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionButton, styles.leftAction]}>
          <IconButton icon="trash-can-outline" size={16} />
          <Text style={[styles.actionText, { color: '#344054' }]}>Delete</Text>
        </TouchableOpacity>
        <View style={styles.middleActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setAddRoleModalVisible(true)}>
            <IconButton icon="plus" size={16} />
            <Text style={[styles.actionText, { color: '#044086' }]}>
              Add Role
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <IconButton
              icon="table-column-plus-after"
              size={16}
            
            />
            <Text style={[styles.actionText, { color: '#044086' }]}>
              Set Columns
            </Text>
          
          </TouchableOpacity>
         
        </View>
        <TouchableOpacity style={[styles.actionButton, styles.rightAction]}>
          <IconButton icon="filter" size={16}  />
          <Text style={[styles.actionText, { color: '#344054' }]}>Filters</Text>
        </TouchableOpacity>
      </View>
     
      <DataTable style={styles.tableHeaderCell}>
      
        <DataTable.Header>
        
          <DataTable.Title>S. No.</DataTable.Title>
          <DataTable.Title>Role</DataTable.Title>
         {/*  <DataTable.Title>Assign module</DataTable.Title> */}
          <DataTable.Title>Action</DataTable.Title>
        </DataTable.Header>

        
        <ScrollView showsVerticalScrollIndicator={false}  style={{  maxHeight:'100%'}} >
        {users.map((user, index) => (
          <DataTable.Row style={styles.table} key={user.role_id}>
           
            <DataTable.Cell>{index + 1}</DataTable.Cell>
            <DataTable.Cell>{user.role_name}</DataTable.Cell>
        {/*     <DataTable.Cell>
            <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.viewModulesContainer}>
                  <IconButton  size={20} color="'#044086'" />
                  <Text style={styles.viewModulesText}>View Modules</Text>
                </TouchableOpacity>
                </DataTable.Cell> */}
            <DataTable.Cell> 
              <TouchableOpacity onPress={() => { setSelectedUser(user); setRoleInput(user.role_name); setIsActionModalVisible(true); }} >
                 <IconButton icon="dots-vertical" size={20} />
             </TouchableOpacity> 
             </DataTable.Cell>
          </DataTable.Row>
        ))}
        </ScrollView>
      </DataTable>
      <View style={styles.actions}>
      <Modal transparent visible={isActionModalVisible} animationType="fade" style={styles.modal}>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      {/* Edit Button */}
      <TouchableOpacity style={styles.modalButton} onPress={() => setIsEditModalVisible(true)}>
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>

      {/* Assign Modules Button */}
      <TouchableOpacity style={styles.modalButton} onPress={() => setIsModalVisible(true)}>
        <Text style={styles.buttonText}>Assign Modules</Text>
      </TouchableOpacity>

      {/* Cancel Button */}
      <TouchableOpacity
        style={[styles.modalButton]}  // Background removed
        onPress={() => setIsActionModalVisible(false)}
      >
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
  </View>
 
  <Modal transparent visible={isEditModalVisible}>
  {/* Detect taps outside the modal */}
  <TouchableWithoutFeedback onPress={() => setIsEditModalVisible(false)}>
    <View style={styles.modalOverlay}>
      {/* Prevent closing the modal when tapping inside */}
      <TouchableWithoutFeedback onPress={() => {}}>
        <View style={styles.modalContent1}>
          <Text style={styles.modalTitle}>Edit Role</Text>
          <TextInput
            style={styles.input}
            value={role_name}
            onChangeText={setRoleInput}
            placeholder="Role Name"
          />
          <View style={styles.buttonContainer}>
            <Pressable style={styles.modalButton} onPress={handleEditRole}>
              <Text style={styles.buttonText1}>Save</Text>
            </Pressable>
            <Pressable
              style={[styles.modalButton1]}
              onPress={() => setIsEditModalVisible(false)}>
              <Text style={styles.buttonText1}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  </TouchableWithoutFeedback>
</Modal>


      
      <View style={styles.container}>
     
    


    
     



   
      <Modal visible={isAddRoleModalVisible} transparent animationType="none">
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalHeader}>
        {editRoleIndex !== null ? 'Edit Role' : 'Add Role'}
      </Text>

      
      <View style={styles.inputWrapper}>
  <Text style={styles.label}>* Role</Text>
  <TextInput
    value={role_name}  
    onChangeText={setRoleInput}  
    placeholder="Enter role"
    style={styles.input}
  />
</View>
      <View style={styles.modalButtons}>
        <Button
          mode="contained"
          onPress={handleAddOrEditRole}
          style={styles.saveButton}
        >
          Save
        </Button>
        <Button
          mode="contained"
          onPress={closeModal}
          style={styles.cancelButton}
        >
          Cancel
        </Button>
      </View>
    </View>
  </View>
</Modal>
    </View>
    <Modal
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
        animationType="slide"
        transparent={true}>
        <ScrollView contentContainerStyle={styles.modalScrollContainer}>
          <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>View Assigned Modules</Text>
          <View style={styles.dropdownContainer}>
              </View>
      <View style={styles.expandableContainer}>
      <Text style={styles.expandableHeader}></Text>
            {loading ? (
              <Text>Loading...</Text>
            ) : (
              <ScrollView>{renderModules(modules)}</ScrollView>
            )}
             <View style={styles.buttonRow}>
 <TouchableOpacity style={styles.editButton} onPress={toggleEditMode}>
              <Text style={styles.editButtonText}>
                {isEditable ? 'Done' : 'Edit'}
              </Text>
            </TouchableOpacity>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            </View>
          </View>
          </View>
        </ScrollView>
      </Modal>


    </>


  );
};



const styles = StyleSheet.create({
  manageUsersContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'white',
    
    
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
  },
  
  actionText: {
    marginLeft: 5,
    fontSize: 14,
  },
  leftAction: {
    marginLeft: 0,
  },
  middleActions: {
    flexDirection: 'row',
  },
  rightAction: {
    marginRight: 0,
  },
  tableHeaderCell: {
    marginTop: 15,
  },
  table: {
    marginRight: 20,
   
  },
  modalButton1:{
    padding:20,
    marginTop:'-10px',
    width:'30%'

  },
  modalScrollContainer: {
    
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    flex: 1,
  },modalButtons: {
    flexDirection: 'row',
    
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#044086',
    flex: 1, 
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#044086',
   
    flex: 1,
  },
  modalContainer: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    padding: 20,
    borderRadius: 10,
    width:'40%'
   
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdownLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  dropdown: {
    backgroundColor: '#f4f4f4',
    padding: 10,
    borderRadius: 5,
  },
  dropdownText: {
    fontSize: 14,
  },
  expandableContainer: {
    marginBottom: 20,
  },
  expandableHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subItems: {
    marginLeft: 20,
  },
  subSubItems: {
    marginLeft: 40,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#044086',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  moduleText: {
    marginLeft: 10,
    fontSize: 16,
  },
 
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
   
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  
  roleList: {
    // marginTop: 20,
  },
  roleText: {
    fontSize: 16,
    marginVertical: 5,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
 
  inputWrapper: {
    marginBottom: 16, // Space between this input and the next one
    paddingHorizontal: 16, // Padding inside the wrapper for the inputs
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8, // Space between label and input field
    color: '#333', // Dark color for the text
  },  
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
 
 
  modalButton: {
 
    padding: 10,
  backgroundColor:'transparent',
  

    borderRadius: 5,
   
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 14,
  
  },
 
  buttonText1: {
    color: '#fff',
    fontSize: 14,
    backgroundColor:'#044086',
 padding:15,
 borderRadius:'10px',
 width:'50px',
 alignItems:'center',
 justifyContent:'center',
 display:'flex'
  
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
   
  },
  
  modalContent: {
    width: '18%', 
    padding: 20,     
    backgroundColor: '#f4f4f4',
    margin:'70px',
    borderRadius: 10,
    alignItems: 'center',
    maxHeight: 160,  
    
  },
  modalContent1: {
    width: '28%', 
    padding: 20,     
    backgroundColor: '#fff',
    margin:'70px',
    borderRadius: 10,
    alignItems: 'center',
    maxHeight: 250,  
    
  },
  buttonContainer: {
    flexDirection: 'row',  // Align buttons in a row
    justifyContent: 'space-between',  // Space out the buttons evenly
    width: '80%',  // Ensure it takes up full width
  },
 
  
 
});

export default RoleMaster;