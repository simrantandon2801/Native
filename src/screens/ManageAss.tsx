import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  CheckBox,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { IconButton, Menu, DataTable } from 'react-native-paper';
import { decodeBase64,encodeBase64 } from '../core/securedata';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height } = Dimensions.get('window');

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

const ManageAss: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedModules, setSelectedModules] = useState<number[]>([]); // Store selected modules
  const [actionsVisible, setActionsvisible] = useState(false);
  const [allSelected, setAllSelected] = useState(false); // State to control "Select All" checkbox
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]); // State to track selected users
  const [modules, setModules] = useState<Module[]>([]);
  const [expandedModules, setExpandedModules] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const toggleMenu = () => setActionsvisible((prev) => !prev);
  const { height } = Dimensions.get('window');
  const [isEditable, setIsEditable] = useState(false);
  const [roleVsModules, setRoleVsModules] = useState<number[]>([]);

  const fetchModules = async () => {
    try {
      const response = await fetch(
        'https://underbuiltapi.aadhidigital.com/master/modules'
      );
      const data = await response.json();
      console.log('Fetched Modules:', JSON.stringify(data, null, 2)); 
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
    const moduleIds: number[] = [];  // Store selected module IDs
    const submoduleIds: number[] = [];  // Store selected submodule IDs
  
    // Loop through each module to collect IDs
    modules.forEach((module) => {
      if (module.is_active) {
        moduleIds.push(module.module_id);  // Add module ID if active
        module.sub_modules?.forEach((submodule) => {
          if (submodule.is_active) {
            submoduleIds.push(submodule.module_id);  // Add submodule ID if active
          }
        });
      }
    });
  
    // Log the selected module and submodule IDs
    console.log('Selected Module IDs:', JSON.stringify(moduleIds, null, 2));
    console.log('Selected Submodule IDs:', JSON.stringify(submoduleIds, null, 2));
  
    // Combine module IDs and submodule IDs
    const combinedModuleIds = [...moduleIds, ...submoduleIds];
  
    if (combinedModuleIds.length === 0) {
      
        const payload = {
          id: 0,
          modules: "",  // Empty string indicating no modules selected
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
    
        return;  // Exit early after sending the blank payload
      }
  
    try {
        const encodedRoleId = await AsyncStorage.getItem('UserType');
          const decodedRoleId = decodeBase64(encodedRoleId ?? ''); 
      const UserType = decodeBase64(await AsyncStorage.getItem('UserType') ?? '');
      console.log('Decoded UserType:', UserType);
  
      const payload = {
        id: 0,
        modules: combinedModuleIds.length > 0 ? combinedModuleIds.join(',') : "", 
        role_id: decodedRoleId ,
        created_by: UserType,  
      };
  
      console.log('Sending Combined Payload:', JSON.stringify(payload, null, 2));
  
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
  const users: User[] = [
    {
      id: 1,
      roleMaster: 'Marcus',
      ViewModulesAssigned: 'ViewModule',
    },
    {
      id: 2,
      roleMaster: 'John Wick',
      ViewModulesAssigned: 'ViewModule',
    },
  ];
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

  return (
    <>
      {/* Manage Users Section */}
      <View style={styles.manageUsersContainer}>
        <Text style={styles.heading}>Module Assignment</Text>
      </View>

      {/* Table Section */}
      <DataTable style={styles.tableHeaderCell}>
        {/* Table Header */}
        <DataTable.Header>
          {/* <DataTable.Title style={styles.checkboxTitle}>
            <CheckBox
              value={allSelected}
              onValueChange={handleSelectAll}
            />
          </DataTable.Title> */}
          <DataTable.Title>S. No.</DataTable.Title>
          <DataTable.Title>Role Master Data</DataTable.Title>
          <DataTable.Title>View Modules Assigned</DataTable.Title>
          <DataTable.Title>Actions</DataTable.Title>
        </DataTable.Header>

        {/* Table Rows */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {users.map((user, index) => (
            <DataTable.Row style={styles.table} key={user.id}>
              {/* <DataTable.Cell style={styles.checkboxCell}>
                <CheckBox
                  value={selectedUsers.includes(user.id)}
                  onValueChange={() => handleUserSelect(user.id)}
                />
              </DataTable.Cell> */}
              <DataTable.Cell>{index + 1}</DataTable.Cell>
              <DataTable.Cell>{user.roleMaster}</DataTable.Cell>
              <DataTable.Cell>
                <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.viewModulesContainer}>
                  <IconButton icon="eye-outline" size={20} color="'#044086'" />
                  <Text style={styles.viewModulesText}>View Modules</Text>
                </TouchableOpacity>
              </DataTable.Cell>

              <DataTable.Cell>
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
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </ScrollView>
      </DataTable>

      {/* Modal for selecting modules */}
      <Modal
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
        animationType="slide"
        transparent={true}>
        <ScrollView contentContainerStyle={styles.modalScrollContainer}>
          <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}> - Module Assignment</Text>
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
    backgroundColor: '#f4f4f4',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tableHeaderCell: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#757575',
  },
  table: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxCell: {
    alignItems: 'center', // Align checkbox in the center of the cell
  },
  checkboxTitle: {
    flexDirection: 'row',
    alignItems: 'center', // Ensure the checkbox aligns with the text
  },
  modalContainer: {
    width: '50%', 
    height: '60%', 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  moduleList: {
    marginBottom: 20,
    maxHeight: 200,
  },
  submitButton: {
    backgroundColor: '#044086',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
  },
  viewModulesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewModulesText: {
    marginLeft: 5,
    fontSize: 16,
    color:'#044086'
  },
  modalScrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    width: '100%',
    marginBottom: 20,
  },
  dropdownLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  expandableContainer: {
    width: '100%',
    marginBottom: 20,
  },
  expandableHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subItems: {
    marginLeft: 20,
    marginTop: 5,
  },
  subSubItems: {
    marginLeft: 40,
    marginTop: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  editButton: {
    backgroundColor: '#044086',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  expandButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  expandButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  moduleText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default ManageAss;
