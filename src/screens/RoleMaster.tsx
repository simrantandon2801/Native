import React, { ReactNode, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
  Dimensions,
  Alert,
  TouchableWithoutFeedback,
  ActivityIndicator
} from 'react-native';
import { CheckBox } from 'react-native';
import { IconButton, Menu, DataTable, Button, TextInput, Switch } from 'react-native-paper';
import { AddAndEditRole } from '../database/RoleMaster';
import { DeleteRole } from '../database/RoleMaster';
import { decodeBase64 } from '../core/securedata';
import DeleteConfirmationModal from './delete-confirmation-modal';

const { height } = Dimensions.get('window');
const adjustedHeight = height * 0.9;

interface User {
  id: number;
  roleMaster: string;
  ViewModulesAssigned: string;
  role_id: number;
  role_name: string;
  is_active: boolean;
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
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionsVisible, setActionsVisible] = useState(false);
  // const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
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
  // const [role, setRole] = useState([]);
  const [expandedModules, setExpandedModules] = useState<number[]>([]);
  const [role_name, setRoleInput] = useState('');
  const [isRoleActive, setIsRoleActive] = useState(true);
  const [isEditPermissionModalVisible, setIsEditPermissionModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);


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
      
      const roleModules = responseData.data?.role_vs_modules || [];
  
      if (response.ok) {
        const moduleStatusMap = roleModules.reduce((acc: Record<number, boolean>, module: any) => {
          acc[module.module_id] = module.is_active;
          return acc;
        }, {});
  
        const updateModules = (moduleList: Module[]): Module[] => {
          return moduleList.map((module) => ({
            ...module,
            is_active: !!moduleStatusMap[module.module_id],
            sub_modules: module.sub_modules
              ? updateModules(module.sub_modules)
              : [],
          }));
        };
  
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
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
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
  
    modules.forEach((module) => {
      if (module.is_active) {
        moduleIds.push(module.module_id);
      }
      module.sub_modules?.forEach((submodule) => {
        if (submodule.is_active) {
          submoduleIds.push(submodule.module_id);
        }
      });
    });
  
    const combinedModuleIds = [...moduleIds, ...submoduleIds];
  
    console.log('Selected Module IDs:', JSON.stringify(moduleIds, null, 2));
    console.log('Selected Submodule IDs:', JSON.stringify(submoduleIds, null, 2));
    console.log('Combined Module IDs:', JSON.stringify(combinedModuleIds, null, 2));
  
    if (combinedModuleIds.length === 0) {
      const payload = {
        id: 0,
        modules: "",
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
  
      return;
    }
  
    try {
      const encodedRoleId = await AsyncStorage.getItem('UserType');
      const decodedRoleId = decodeBase64(encodedRoleId ?? '');
      const UserType = decodeBase64(await AsyncStorage.getItem('UserType') ?? '');
  
      const payload = {
        id: 0,
        modules: combinedModuleIds.join(','),
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

  const updateModuleState = (moduleId: number, newValue: boolean) => {
    const updateModulesRecursively = (moduleList: Module[]): Module[] => {
      return moduleList.map((module) => {
        const updatedModule = {
          ...module,
          is_active: module.module_id === moduleId ? newValue : module.is_active,
          sub_modules: module.sub_modules
            ? updateModulesRecursively(module.sub_modules)
            : [],
        };
        return updatedModule;
      });
    };
  
    setModules((prevModules) => updateModulesRecursively(prevModules));
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
  
        {expandedModules.includes(module.module_id) &&
          module.sub_modules &&
          renderModules(module.sub_modules, level + 1)}
      </View>
    ));
  };

  const handleModuleChange = (moduleId: number) => {
    setSelectedModules((prevSelectedModules) =>
      prevSelectedModules.includes(moduleId)
        ? prevSelectedModules.filter((id) => id !== moduleId)
        : [...prevSelectedModules, moduleId]
    );
  };

  const toggleEditMode = async () => {
    if (isEditable) {
      console.log('Edit mode is active. Preparing to save data.');
      console.log('Modules State:', JSON.stringify(modules, null, 2));
      
      const activeModules = modules.filter(module => module.is_active);
      console.log('Active Modules:', JSON.stringify(activeModules, null, 2));
  
      activeModules.forEach(module => {
        if (module.sub_modules?.length) {
          const activeSubmodules = module.sub_modules.filter(submodule => submodule.is_active);
          console.log(`Active Submodules for Module "${module.module_name}":`, JSON.stringify(activeSubmodules, null, 2));
        }
      });
  
      await sendUpdatedData();
    } else {
      console.log('Edit mode is being activated. Modules can now be edited.');
    }
  
    setIsEditable((prev) => !prev);
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
  
  const handleAddRole = async () => {
    if (!role_name.trim()) {
      Alert.alert('Error', 'Role name cannot be empty');
      return;
    }
    setLoading(true);
    const newRole = { 
      role_id: 0,  
      role_name: role_name.trim(),
      role_level: 0,  
      is_active: true, 
    };
    console.log(newRole, "Adding new role");
    const res = await AddAndEditRole(newRole);
    console.log(res);
    setLoading(false);
    setAddRoleModalVisible(false);
    setRoleInput('');
    // Refresh the roles list here
    fetchData();
  };

  const handleEditRole = async () => {
    setLoading(true);
    
    const payload = { 
      role_id: selectedUser ? selectedUser.role_id : 0,
      role_name: role_name,
      role_level: 0,
      is_active: isRoleActive,
    };
    console.log("value2: ", payload)
    const res = await AddAndEditRole(payload);
    console.log(res);
    setIsEditModalVisible(false);
    fetchData();
    setLoading(false);
  };
  
  const fetchData = async () => {
    setLoading(true);
    try {
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
      console.log(result.data.roles);
      const sortedRoles = result.data.roles.sort((a, b) => {
        if (a.is_active === b.is_active) return 0;
        return a.is_active ? -1 : 1;
      });
      setUsers(sortedRoles);

      console.log('API response:', response.status);
    } catch (err) {
      console.error('Error fetching data:', err);
      Alert.alert("Error", "Failed to fetch roles. Please try again.");
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchData();
  }, []);  

  const handleDeleteRole = async (roleId: number) => {
    setSelectedUser(users.find(user => user.role_id === roleId) || null);
    setIsDeleteModalVisible(true);
  };
  
  const confirmDeleteRole = async () => {
    if (selectedUser && selectedUser.role_id) {
      setLoading(true);
      try {
        console.log("Attempting to delete role with ID:", selectedUser.role_id);
        const res = await DeleteRole(selectedUser.role_id);
        console.log("Delete API Response:", res);
        const parsedRes = JSON.parse(res);
        if (parsedRes.status === 'success') {
          setUsers(prevUsers => prevUsers.filter(user => user.role_id !== selectedUser.role_id));
          Alert.alert("Success", "Role deleted successfully");
        } else {
          throw new Error(parsedRes.message || 'Unknown error occurred');
        }
      } catch (error) {
        console.error("Error in confirmDeleteRole:", error);
        Alert.alert("Error", "Failed to delete role. Please try again.");
      } finally {
        setLoading(false);
        setIsDeleteModalVisible(false);
        setSelectedUser(null);
      }
    }
  };
  
  const handleStatusToggle = async (user: User) => {
    setSelectedUser(user);
    try {
      setLoading(true);
      const updatedUser = { ...user, is_active: !user.is_active };
      const res = await AddAndEditRole(updatedUser);
      const response = JSON.parse(res);
      if (response.status === 'success') {
        setUsers(prevUsers => 
          prevUsers.map(u => u.role_id === user.role_id ? updatedUser : u)
        );
      } else {
        throw new Error(response.message || 'Failed to update status');
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      Alert.alert("Error", "Failed to update status. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    console.log('RoleMaster component mounted');
  }, []);

  return (
    <View style={styles.container}>
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
            onPress={() => {
              setRoleInput('');
              setAddRoleModalVisible(true);
            }}>
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
          <DataTable.Title>Status</DataTable.Title>
          <DataTable.Title>Action</DataTable.Title>
        </DataTable.Header>

        <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: '100%' }}>
          {users.map((user, index) => (
            <DataTable.Row style={styles.table} key={user.role_id}>
              <DataTable.Cell>{index + 1}</DataTable.Cell>
              <DataTable.Cell>{user.role_name}</DataTable.Cell>
              <DataTable.Cell>
                {loading && selectedUser?.role_id === user.role_id ? (
                  <ActivityIndicator size="small" color="#044086" />
                ) : (
                  <TouchableOpacity onPress={() => handleStatusToggle(user)}>
                    <Text style={[styles.statusText, { color: user.is_active ? 'green' : 'red' }]}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Text>
                  </TouchableOpacity>
                )}
              </DataTable.Cell>
              <DataTable.Cell>
                <Menu
                  visible={isMenuVisible && selectedUser?.role_id === user.role_id}
                  onDismiss={() => setMenuVisible(false)}
                  anchor={
                    <TouchableOpacity onPress={() => {
                      setSelectedUser(user);
                      setRoleInput(user.role_name);
                      setIsRoleActive(user.is_active);
                      setMenuVisible(true);
                    }}>
                      <IconButton icon="dots-vertical" size={20} />
                    </TouchableOpacity>
                  }
                >
                  <Menu.Item onPress={() => {
                    setIsEditModalVisible(true);
                    setMenuVisible(false);
                  }} title="Edit" />
                  <Menu.Item 
                    onPress={() => handleDeleteRole(user.role_id)} 
                    title="Delete" 
                  />
                  <Menu.Item onPress={() => {
                    setIsModalVisible(true);
                    setMenuVisible(false);
                  }} title="Assign Modules" />
                  <Menu.Item onPress={() => {
                    setIsEditPermissionModalVisible(true);
                    setMenuVisible(false);
                  }} title="Edit Permission" />
                </Menu>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </ScrollView>
      </DataTable>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#044086" />
        </View>
      )}

      <Modal transparent visible={isEditModalVisible}>
        <TouchableWithoutFeedback onPress={() => setIsEditModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Edit Role</Text>
                <TextInput
                  style={styles.input}
                  value={role_name}
                  onChangeText={setRoleInput}
                  placeholder="Role Name"
                  mode="outlined"
                  outlineColor="#ccc"
                  // activeOutlineColor="#044086"
                />
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>Active/Inactive</Text>
                  <Switch
                    value={isRoleActive}
                    onValueChange={setIsRoleActive}
                    color="#044086"
                  />
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.cancelButton]} 
                    onPress={() => setIsEditModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.saveButton]} 
                    onPress={handleEditRole}
                  >
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal 
        visible={isAddRoleModalVisible} 
        transparent 
        animationType="fade"
        onRequestClose={() => {
          setAddRoleModalVisible(false);
          setRoleInput('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Role</Text>
            
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>* Role</Text>
              <TextInput
                value={role_name}  
                onChangeText={setRoleInput}  
                placeholder="Enter role"
                style={styles.input}
                mode="outlined"
                outlineColor="#ccc"
                activeOutlineColor="#044086"
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={closeModal}
                style={[styles.modalButton, styles.cancelButton]}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddRole}
                style={[styles.modalButton, styles.saveButton]}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
      <Modal
        visible={isEditPermissionModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditPermissionModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Permission</Text>
            <View style={styles.permissionContainer}>
              {['Viewing', 'Editing', 'Deleting', 'Get Notification'].map((permission, index) => (
                <View key={index} style={styles.permissionItem}>
                  <Text>{permission}</Text>
                  <Switch value={false} onValueChange={() => {}} />
                </View>
              ))}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsEditPermissionModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={() => {
                  // Handle submit logic here
                  setIsEditPermissionModalVisible(false);
                }}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={isDeleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Delete</Text>
            <Text style={styles.modalText}>Are you sure you want to delete this role?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsDeleteModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={confirmDeleteRole}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
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
    flex: 1,
    backgroundColor: 'white',
  },
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
  modalButton1: {
    padding: 20,
    marginTop: -10,
    width: 30
  },
  modalScrollContainer: {
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    flex: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#044086',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    flex: 1,
    minWidth: 50,
  },
  modalContainer: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    padding: 20,
    borderRadius: 10,
    width: '30%',
    alignSelf: 'center'
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    padding: 10,
    width: '100%',
    fontSize: 14,
    height: 40,
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
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },  
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    minWidth: 60,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white'
  },
  
  buttonTextSave: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    width: '80%',
    maxWidth: 300,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 14,
    color: '#333',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
    

  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContent1: {
    width: '30%', 
    padding: 20,     
    backgroundColor: '#fff',
    margin: 70,
    borderRadius: 10,
    alignItems: 'center',
    maxHeight: 250,  
  },
  moduleItem: {
    marginBottom: 10,
  },
  expandButton: {
    marginRight: 10,
  },
  expandButtonText: {
    fontSize: 18,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  statusCell: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusText: {
    fontWeight: 'bold',
  },
  permissionContainer: {
    borderWidth: 1,
    borderColor: '#044086',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  permissionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#044086',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default RoleMaster;

