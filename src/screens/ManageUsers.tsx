import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {
  DataTable,
  Icon,
  IconButton,
  Menu,
  Switch,
  Checkbox,
} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import {
  GetUsers,
  addUser,
  GetAllRoles,
  GetUserRole,
  updateMultipleUsersDepartment,
  updateMultipleUsersRole,
  DeleteMultipleUsers,
  GetUserPermission,
  GetAdIntegration,
} from '../database/RestData';
import NestedDeptDropdown from '../modals/NestedDeptDropdown';
import {DeleteUser} from '../database/RestData';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {decodeBase64} from '../core/securedata';
import AdComponent from './Adcomponent';
import { navigate } from '../navigations/RootNavigation';

interface User {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  customer_id: number | null;
  reporting_to: number | null;
  approval_limit: number | null;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number | null;
  is_active: boolean;
  is_deleted: boolean;
  department_id: number | null;
  average_cost: number | null;
  phone: string | null;
  source: string | null;
  designation: string | null;
  manager_name: string | null;
  department_name: string | null;
  role_name: string | null;
}

interface InsertOrEditUser {
  user_id: number; // ID of the user, 0 for new users
  username?: string; // Username of the user
  email: string; // Email address of the user

  first_name: string; // First name of the user
  last_name: string; // Last name of the user
  customer_id: number; // ID of the customer, 0 for default
  reporting_to: number; // ID of the manager/reporting person
  approval_limit: number; // Budget approval limit
  is_super_admin: boolean; // Whether the user is a super admin
  is_active: boolean; // Whether the user account is active
  role_id: number; // ID of the role assigned to the user
  department_id: number;
  average_cost: number;
  phone: string;
  designation: string;
}

interface UserRole {
  role_id: number;
  role_name: string;
  role_level: string | number; // Depending on how the role_level is represented
  is_active: boolean;
}

interface UserPermission {
  user_permission_id: number;
  permission_id: number;
  permission_name: string;
  user_id: number;
  role_id: number;
  is_active: boolean;
}

const {height} = Dimensions.get('window');

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User>();
  const [customerID, setCustomerID] = useState('');
  const [isAddUserModalVisible, setisAddUserModalVisible] = useState(false);
  const [isEditPermissionModalVisible, setisEditPermissionModalVisible] =
    useState(false);
  const [isDeleteModalVisible, setisDeleteModalVisible] = useState(false);
  const [isEditModalVisible, setisEditModalVisible] = useState(false);
  const [firstname, setFirstName] = useState<string>(
    selectedUser ? selectedUser?.first_name : '',
  );
  const [lastname, setLastName] = useState<string>(
    selectedUser ? selectedUser?.last_name : '',
  );
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [manager, setManager] = useState<string>('');
  const [budgetAmount, setBudgetAmount] = useState<string>('');
  const [avgbudgetAmount, setAvgBudgetAmount] = useState<string>('');
  const [Designation, setDesignation] = useState<string>('');
  const [approvalCurrency, setApprovalCurrency] = useState<string>('');
  const [avgCurrency, setAvgCurrency] = useState<string>('');

  const [isMultipleDeleteModalVisible, setisMultipleDeleteModalVisible] =
    useState(false);
  const [
    isMultipleAssignDeptModalVisible,
    setisMultipleAssignDeptModalVisible,
  ] = useState(false);
  const [
    isMultipleRoleAssignModalVisible,
    setisMultipleRoleAssignModalVisible,
  ] = useState(false);

  // const [selectedDeptID, setSelectedDeptID] = useState<number>(0);
  const [selectedDeptPath, setSelectedDeptPath] = useState<string>('');
  const [selectedDeptID, setSelectedDeptID] = useState<number>(-1);
  const handleDeptSelect = (deptID: number) => {
    setSelectedDeptID(deptID); // Update the parent state with the selected department ID
    console.log(`Selected Department ID: ${deptID}`);
  };
  const [isADModalVisible, setIsADModalVisible] = useState(false);
  const toggleModal = () => {
    setIsADModalVisible(!isADModalVisible); // Toggle the modal visibility
  };
  const [isLoading, setIsLoading] = useState(false);
  const loadAdComponent = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false); // Simulate loading completion after 2 seconds
    }, 2000);
  };
  //----------------commented the confirm password field in AddUser Modal-----------------
  // const [password, setPassword] = useState<string>('');
  // const [confirmPassword, setConfirmPassword] = useState<string>('');
  // const [errorMessage, setErrorMessage] = useState<string>('');
  //For Confirm password field in Add User Modal
  // const handlePasswordChange = value => {
  //   setPassword(value);
  //   if (value !== confirmPassword) {
  //     setErrorMessage('Password does not match');
  //   } else {
  //     setErrorMessage('');
  //   }
  // };
  //For Confirm password field in Add User Modal
  // const handleConfirmPasswordChange = value => {
  //   setConfirmPassword(value);
  //   if (value !== password) {
  //     setErrorMessage('Password does not match');
  //   } else {
  //     setErrorMessage('');
  //   }
  // };

  //made independent visible menu state for each user on the basis of user_id

  const [visibleMenus, setVisibleMenus] = useState<{[key: number]: boolean}>(
    {},
  );

  const getCustomerId = async () => {
    try {
      const localcustomerID = await AsyncStorage.getItem('Customer_ID');
      const decodedCustomerID = decodeBase64(localcustomerID || '');
      console.log('Your Customer ID is ', decodedCustomerID);
      setCustomerID(decodedCustomerID);
    } catch (err) {
      console.log('Error fetching the customerID', err);
    }
  };
  //Toggle function for opening and closing ":" Menu inside actions table
  // ------------------------VERY IMPORTANT-------------------------------------------------------
  const toggleMenu = (userId: number) => {
    setVisibleMenus(prev => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const [permissions, setPermissions] = useState<UserPermission[]>([]);
  const [loading, setLoading] = useState(false);

  // const togglePermission = (key: any) => {
  //   setPermissions(prev => ({...prev, [key]: !prev[key]}));
  // };

  const HandleGetUserPermission = async (user_id: string) => {
    // Start loading
    try {
      setLoading(true);
      setPermissions([]);

      const response = await GetUserPermission(user_id);
      const parsedRes = JSON.parse(response);
      if (parsedRes.status === 'success') {
        console.log(
          `Permissions of ${user_id} fetched successfully`,
          parsedRes,
        );
        // Corrected the path to match the response structure
        setPermissions(parsedRes.data.user_permissions); // Use the correct path
      } else {
        console.error(
          'Failed to fetch user roles:',
          parsedRes.message || 'Unknown error',
        );
      }
    } catch (err) {
      console.error('Error fetching user permissions:', err);
    } finally {
      setLoading(false); // End loading
    }
  };

  const fetchUser = async () => {
    try {
      const response = await GetUsers('');
      const parsedRes = JSON.parse(response);
      if (parsedRes.status === 'success') setUsers(parsedRes.data.users);
      else
        console.error(
          'Failed to fetch users:',
          parsedRes.message || 'Unknown error',
        );
    } catch (err) {
      console.log('Error Fetching Users', err);
    }
  };

  const handleAddorEditUser = async () => {
    console.log(selectedRoleID);
    const payload: InsertOrEditUser = {
      user_id: selectedUser ? selectedUser.user_id : 0, //
      username: username || (selectedUser ? selectedUser.username : ''), //agar username hai then add hoga, if not then jo slected user ka email hai vo hoga
      email: email || (selectedUser ? selectedUser.email : ''),
      first_name: firstname || (selectedUser ? selectedUser.first_name : ''),
      last_name: lastname || (selectedUser ? selectedUser.last_name : ''),
      customer_id: parseInt(customerID),
      reporting_to: parseInt(manager),
      approval_limit: parseInt(budgetAmount),
      is_super_admin: true,
      is_active: true,
      role_id: selectedRoleID,
      department_id: selectedDeptID, //by default it will give -1
      average_cost: parseInt(avgbudgetAmount),
      phone: '',
      designation: Designation,
    };
    try {
      console.log(payload);
      const response = await addUser(payload);
      const parsedRes = JSON.parse(response);
      if (parsedRes.status === 'success'){
        console.log(' User Added succesfully');
        fetchUser();
      }
      else
        console.error(
          'Failed to fetch users:',
          parsedRes.message || 'Unknown error',
        );
    } catch (err) {
      console.log('Error Fetching Users', err);
    }
  };

  const handleDelete = async (user_id: number) => {
    console.log(user_id);
    const payload = {
      user_id: user_id,
    };
    try {
      const response = await DeleteUser(payload); // API call to delete user
      const parsedRes = JSON.parse(response);
      if (parsedRes.status === 'success') {
        setisDeleteModalVisible(false); // Close the modal after successful deletion
        fetchUser();
      } else {
        console.error('Failed to delete user:', parsedRes.message); // Handle failure
      }
    } catch (error) {
      console.error('Error deleting user:', error); // Handle any errors
    }
  };

  const [selectedRoleID, setSelectedRoleID] = useState<number>(-1);
  const [userRole, setUserRole] = useState<UserRole[]>([]);

  const fetchAllRole = async () => {
    try {
      const response = await GetAllRoles('');
      const parsedRes =
        typeof response === 'string' ? JSON.parse(response) : response;
      if (parsedRes.status === 'success') {
        setUserRole(parsedRes.data.roles);
      } else {
        console.error(
          'Failed to fetch user roles:',
          parsedRes.message || 'Unknown error',
        );
      }
    } catch (err) {
      console.error('Error Fetching User Roles:', err);
    }
  };

  const handleSyncAD = async () => {
    try {
      const response = await GetAdIntegration('');
      const parsedRes = JSON.parse(response);
      if (parsedRes.status === 'success') {
        console.log('fetched succesfully');
        // setUserRole(parsedRes.data.roles);
      } else {
        console.error(
          'Failed to fetch user roles:',
          parsedRes.message || 'Unknown error',
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Checkbox Logic
  const [allSelectedUsersID, setAllSelectedUsersID] = useState<number[]>([]); // Store selected user IDs
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false); // State for Select All checkbox

  useEffect(() => {
    fetchUser();
    fetchAllRole();
    getCustomerId();
  }, []);

  // Handle "Select All" checkbox
  const handleSelectAll = () => {
    if (selectAllChecked) {
      setAllSelectedUsersID([]); // Deselect all users
    } else {
      const selectedUserIds = users.map(user => user.user_id); // Select all users
      setAllSelectedUsersID(selectedUserIds);
      console.log('Selected Users ID:', selectedUserIds); // Log the array
    }
    setSelectAllChecked(!selectAllChecked); // Toggle "Select All" checkbox state
  };

  // Handle individual user selection
  const handleUserSelection = (user_id: number) => {
    const isSelected = allSelectedUsersID.includes(user_id);

    if (isSelected) {
      // Deselect user
      setAllSelectedUsersID(allSelectedUsersID.filter(id => id !== user_id));
    } else {
      // Select user
      setAllSelectedUsersID([...allSelectedUsersID, user_id]);
    }

    // Log the current state of allSelectedUsersID to check if it's being updated
    console.log('Selected User IDs:', allSelectedUsersID);
  };




  const handleUpdateMultipleUsersDepartment = async () => {
    const payload = {
      department_id: selectedDeptID,
      user_ids: allSelectedUsersID,
    };
    console.log('Multiple User Department Payload', payload);
    try {
      const response = await updateMultipleUsersDepartment(payload); // API call to delete user
      const parsedRes = JSON.parse(response);
      if (parsedRes.status === 'success') {
        console.log(
          'All the users you selected are now assigned the selected Department',
        );
        //set
        setisMultipleAssignDeptModalVisible(false); // Close the modal after successful deletion
        fetchUser();
      } else {
        console.error(
          'Failed to assign this Department to user:',
          parsedRes.message,
        ); // Handle failure
      }
    } catch (err) {
      console.log('There is something wrong', err);
    }
  };

  const handleUpdateMultipleUsersRole = async () => {
    const payload = {
      role_id: selectedRoleID,
      user_ids: allSelectedUsersID,
    };
    console.log('Multiple User Role Assigning Payload', payload);
    try {
      const response = await updateMultipleUsersRole(payload); // API call to delete user
      const parsedRes = JSON.parse(response);
      if (parsedRes.status === 'success') {
        console.log(
          'All the users you selected are now assigned the selected Role',
        );
        setisMultipleRoleAssignModalVisible(false); // Close the modal after successful deletion
        fetchUser();
      } else {
        console.error('Failed to assign this role to user:', parsedRes.message); // Handle failure
      }
    } catch (err) {
      console.log('There is something wrong', err);
    }
  };

  const handleDeleteMultipleUsers = async () => {
    const payload = {
      user_ids: allSelectedUsersID,
    };
    console.log('Multiple User Department Payload', payload);
    try {
      const response = await DeleteMultipleUsers(payload); // API call to delete user
      const parsedRes = JSON.parse(response);
      if (parsedRes.status === 'success') {
        console.log('All the users you slected are now succesfully deleted');
        //set
        setisMultipleDeleteModalVisible(false); // Close the modal after successful deletion
        fetchUser();
      } else {
        console.error('Failed to delete user:', parsedRes.message); // Handle failure
      }
    } catch (err) {
      console.log('There is something wrong', err);
    }
  };

  return (
    <>
      {/* Manage Users Section */}
      <View style={styles.manageUsersContainer}>
        <Text style={styles.heading}>Manage Users</Text>
      </View>

      {/* Action Bar */}

      <View style={styles.actions}>
        {/*Delete Button in Action Bar */}
        <TouchableOpacity
          style={[styles.actionButton, styles.leftAction]}
          onPress={() => setisMultipleDeleteModalVisible(true)}>
          <IconButton icon="trash-can-outline" size={16} color="#344054" />
          <Text style={[styles.actionText, {color: '#344054'}]}>Delete</Text>
        </TouchableOpacity>
        {/*Assign Department Button in Action Bar */}
        <TouchableOpacity
          style={[styles.actionButton, styles.leftAction]}
          onPress={() => setisMultipleAssignDeptModalVisible(true)}>
          <IconButton icon="briefcase-outline" size={16} color="#344054" />
          <Text style={[styles.actionText, {color: '#344054'}]}>
            Assign Department
          </Text>
        </TouchableOpacity>

        {/*Assign Role Button in Action Bar  */}
        <TouchableOpacity
          style={[styles.actionButton, styles.leftAction]}
          onPress={() => setisMultipleRoleAssignModalVisible(true)}>
          <IconButton icon="briefcase-outline" size={16} color="#344054" />
          <Text style={[styles.actionText, {color: '#344054'}]}>
            Assign Roles
          </Text>
        </TouchableOpacity>

        <View style={styles.middleActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setisAddUserModalVisible(true)}>
            <IconButton icon="plus" size={16} color="#044086" />
            <Text style={[styles.actionText, {color: '#044086'}]}>
              Add User
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <IconButton
              icon="table-column-plus-after"
              size={16}
              color="#044086"
            />
            <Text style={[styles.actionText, {color: '#044086'}]}>
              Set Columns
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={toggleModal}>
            <IconButton icon="sync" size={16} color="#044086" />
            <Text style={[styles.actionText, {color: '#044086'}]}>Sync AD</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}onPress={() => navigate('Excel')}>
            <IconButton icon="sync" size={16} color="#044086" />
            <Text style={[styles.actionText, {color: '#044086'}]}>Import Excel</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.actionButton, styles.rightAction]}>
          <IconButton icon="filter" size={16} color="#344054" />
          <Text style={[styles.actionText, {color: '#344054'}]}>Filters</Text>
        </TouchableOpacity>
      </View>

      {/* Table Section */}
      <DataTable style={styles.tableHeaderCell}>
        {/* Table Header */}
        <DataTable.Header>
          <Checkbox
            status={selectAllChecked ? 'checked' : 'unchecked'}
            onPress={handleSelectAll}
          />

          <DataTable.Title style={{justifyContent: 'center'}}>
            S. No.
          </DataTable.Title>
          <DataTable.Title style={{justifyContent: 'center'}}>
            Name
          </DataTable.Title>
          <DataTable.Title style={{justifyContent: 'center'}}>
            Username
          </DataTable.Title>
          <DataTable.Title style={{justifyContent: 'center'}}>
            Role
          </DataTable.Title>
          <DataTable.Title style={[{flex: 2, justifyContent: 'center'}]}>
            Email ID
          </DataTable.Title>
          <DataTable.Title style={{justifyContent: 'center'}}>
            Department
          </DataTable.Title>
          <DataTable.Title style={{justifyContent: 'center'}}>
            Reporting Manager
          </DataTable.Title>
          <DataTable.Title style={{justifyContent: 'center'}}>
            Projects Active
          </DataTable.Title>
          <DataTable.Title style={{justifyContent: 'center'}}>
            Approval Limit
          </DataTable.Title>
          <DataTable.Title style={{justifyContent: 'center'}}>
            Average Cost
          </DataTable.Title>
          <DataTable.Title style={{justifyContent: 'center'}}>
            Status
          </DataTable.Title>
          <DataTable.Title style={{justifyContent: 'center'}}>
            Actions
          </DataTable.Title>
        </DataTable.Header>

        {/* Table Rows */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{maxHeight: 4150}}>
          {users.map((user, index) => (
            <DataTable.Row style={styles.table} key={user.user_id}>
              <Checkbox
                status={
                  allSelectedUsersID.includes(user.user_id)
                    ? 'checked'
                    : 'unchecked'
                }
                onPress={() => handleUserSelection(user.user_id)}
              />
              <DataTable.Cell style={{justifyContent: 'center'}}>
                {index + 1}
              </DataTable.Cell>
              {/* Name: Concatenating first and last name */}
              <DataTable.Cell
                style={{
                  justifyContent: 'center',
                }}>{`${user.first_name} ${user.last_name}`}</DataTable.Cell>{' '}
              {/*Username*/}
              <DataTable.Cell style={{justifyContent: 'center'}}>
                {user.username}
              </DataTable.Cell>
              {/* Assuming username as designation */}
              <DataTable.Cell style={{justifyContent: 'center'}}>
                {user.role_name}
              </DataTable.Cell>
              {/* Email*/}
              <DataTable.Cell style={[{flex: 2, justifyContent: 'center'}]}>
                {user.email}
              </DataTable.Cell>
              {/* Placeholder for department */}
              <DataTable.Cell style={{justifyContent: 'center'}}>
                {user.department_name}
              </DataTable.Cell>
              {/* Reporting Manager: Using reporting_to (ID) */}
              <DataTable.Cell style={{justifyContent: 'center'}}>
                {user?.manager_name}
              </DataTable.Cell>
              {/* Placeholder for Projects Active */}
              <DataTable.Cell style={{justifyContent: 'center'}}>
                {0}
              </DataTable.Cell>
              {/* Placeholder for Approval Limit*/}
              <DataTable.Cell style={{justifyContent: 'center'}}>
                {user.approval_limit}
              </DataTable.Cell>
              {/* Placeholder for Average Cost */}
              <DataTable.Cell style={{justifyContent: 'center'}}>
                {user.average_cost}
              </DataTable.Cell>
              {/* Placeholder for Status */}
              <DataTable.Cell>
                {user.is_active ? 'Active' : 'Inactive'}
              </DataTable.Cell>
              {/* Placeholder for Actions */}
              <DataTable.Cell>
                <Menu
                  visible={visibleMenus[user.user_id] || false}
                  onDismiss={() => toggleMenu(user.user_id)}
                  anchor={
                    <TouchableOpacity
                      onPress={() => {
                        toggleMenu(user.user_id);
                        setSelectedUser(user);
                      }}>
                      <IconButton icon="dots-vertical" size={20} />
                    </TouchableOpacity>
                  }>
                  <Menu.Item
                    onPress={() => {
                      console.log('Edit Details');
                      toggleMenu(user.user_id); // Close menu after selection
                      setisEditModalVisible(true);
                    }}
                    title="Edit Details"
                  />
                  <Menu.Item
                    onPress={() => {
                      toggleMenu(user.user_id); // Close menu after selection
                      setisEditPermissionModalVisible(true);
                      HandleGetUserPermission(user.user_id.toString());
                    }}
                    title="Edit Permissions"
                  />
                  <Menu.Item
                    onPress={() => {
                      console.log('Activate/Deactivate');
                      toggleMenu(user.user_id); // Close menu after selection
                    }}
                    title="Activate/Deactivate"
                  />
                  <Menu.Item
                    onPress={() => {
                      console.log('Delete');
                      toggleMenu(user.user_id); // Close menu after selection

                      setisDeleteModalVisible(true);
                    }}
                    title="Delete"
                  />
                </Menu>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </ScrollView>
      </DataTable>

      {/* Add user Modal */}
      <Modal
        visible={isAddUserModalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={() => setisAddUserModalVisible(false)}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.modalScrollContainer}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalHeader}>Add New User</Text>
              {/* Input Fields for Name and Email */}
              <View style={styles.inputRow}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>* First Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter first name"
                    value={firstname}
                    onChangeText={setFirstName}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>* Last Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter last name"
                    value={lastname}
                    onChangeText={setLastName}
                  />
                </View>
              </View>
              <View style={styles.inputRow}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>* Email ID</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter email"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>
              {/* Designation Dropdown */}
              {/* Reporting Manager Dropdown &&  */}
              <View style={styles.inputRow}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>* Designation</Text>
                  <Picker
                    selectedValue={Designation}
                    onValueChange={itemValue => setDesignation(itemValue)}
                    style={styles.input}>
                    <Picker.Item label="UI/UX" value="UI/UX" />
                    <Picker.Item label="Developer" value="Developer" />
                    <Picker.Item
                      label="Project Manager"
                      value="Project Manager"
                    />
                  </Picker>
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>* Reporting Manager</Text>
                  <Picker
                    selectedValue={manager}
                    onValueChange={itemValue => setManager(itemValue)}
                    style={styles.input}>
                    {users.map((user, index) => (
                      <Picker.Item
                        key={index}
                        label={`${user.first_name} ${user.last_name}`}
                        value={user.user_id}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
              {/*Nested Dropdown */}
              <NestedDeptDropdown onSelect={handleDeptSelect} />
              {/*User Role*/}
              <View style={styles.inputRow}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>* User Role</Text>
                  <Picker
                    selectedValue={selectedRoleID}
                    onValueChange={itemValue => setSelectedRoleID(itemValue)}
                    style={styles.input}>
                    {userRole.map(
                      (
                        role, // Use `userRole` here instead of `userRoles`
                      ) => (
                        <Picker.Item
                          key={role.role_id}
                          label={role.role_name}
                          value={role.role_id}
                        />
                      ),
                    )}
                  </Picker>
                </View>
              </View>
              {/*User Role*/}
              <Text
                style={{
                  color: '#044086',
                  fontFamily: 'Source Sans Pro',
                  fontSize: 14,
                  fontStyle: 'normal',
                  fontWeight: '600',
                  lineHeight: 22,
                  paddingBottom: 5,
                }}>
                Approval Limit
              </Text>
              <View style={styles.inputRow}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>* Currency Selection</Text>
                  <Picker
                    selectedValue={approvalCurrency}
                    onValueChange={itemValue => setApprovalCurrency(itemValue)}
                    style={styles.input}>
                    <Picker.Item label="$ US Dollar" value="Dollar" />
                    <Picker.Item label="₹ Rupees" value="Rupees" />
                    <Picker.Item label="€ Euro" value="Euro" />
                  </Picker>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>* Budget Amount</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Budget Amount"
                    value={budgetAmount}
                    onChangeText={setBudgetAmount}
                  />
                </View>
              </View>
              {/*Average Costing*/}
              <Text
                style={{
                  color: '#044086',
                  fontFamily: 'Source Sans Pro',
                  fontSize: 14,
                  fontStyle: 'normal',
                  fontWeight: '600',
                  lineHeight: 22,
                  paddingBottom: 5,
                }}>
                Average Costing
              </Text>
              <View style={styles.inputRow}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>* Currency Selection</Text>
                  <Picker
                    selectedValue={avgCurrency}
                    onValueChange={itemValue => setAvgCurrency(itemValue)}
                    style={styles.input}>
                    <Picker.Item label="$ US Dollar" value="Dollar" />
                    <Picker.Item label="₹ Rupees" value="Rupees" />
                    <Picker.Item label="€ Euro" value="Euro" />
                  </Picker>
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>* Budget Amount</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Budget Amount"
                    value={avgbudgetAmount}
                    onChangeText={setAvgBudgetAmount}
                  />
                </View>
              </View>
              {/*Username */}
              {/* Password Enter + Confirmation */}
              {/* <View style={styles.inputRow}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>* Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={handlePasswordChange}
                    secureTextEntry={true} // To hide the password input
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>* Confirm Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                    secureTextEntry={true} // To hide the confirm password input
                  />
                </View>
                {errorMessage ? (
                  <Text style={styles.errorText}>{errorMessage}</Text>
                ) : null}
              </View> */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 14,
                }}>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => {
                    setisAddUserModalVisible(false);
                    // Handle form submission logic here (e.g., save user details)
                    handleAddorEditUser();
                  }}>
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>

                {/* Close Button */}
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => setisAddUserModalVisible(false)}>
                  <Text style={styles.submitButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </Modal>

  
    {/* Sync AD */}
    <Modal
        animationType="slide"
        transparent={true}
        visible={isADModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer1}>
            {/* ScrollView to make content scrollable */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              {/* Show loading spinner while AdComponent is loading */}
              {isLoading ? (
                <ActivityIndicator size="large" color="#044086" />
              ) : (
                <AdComponent closeModal={toggleModal} fetchUser={fetchUser} /> 
              )}
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/*Delete User Modal */}
      <Modal
        visible={isDeleteModalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={() => setisDeleteModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>
              Are you sure you want to delete
              {` ${selectedUser?.first_name} ${selectedUser?.last_name}`}
            </Text>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() =>
                  selectedUser?.user_id && handleDelete(selectedUser.user_id)
                }>
                <Text style={styles.submitButtonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => setisDeleteModalVisible(false)}>
                <Text style={styles.submitButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/*Permissions Modal */}
      {/* <Modal
        visible={isEditPermissionModalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={() => setisEditPermissionModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>Edit Permissions</Text>
            <View style={styles.permissionsList}>
              {Object.entries(permissions).map(([key, value]) => (
                <View key={key} style={styles.permissionRow}>
                  <Text style={styles.permissionLabel}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Text>
                  <Switch
                    value={value}
                    onValueChange={() => togglePermission(key)}
                  />
                </View>
              ))}
            </View> */}

      {/* Buttons */}
      {/* <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => setisEditPermissionModalVisible(false)}>
                <Text style={styles.submitButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => setisEditPermissionModalVisible(false)}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}

      {/* Updated Permission User Modal */}
      <Modal
        visible={isEditPermissionModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setisEditPermissionModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, {width: '90%', maxWidth: 400}]}>
            <Text style={styles.modalTitle}>Edit Permissions</Text>
            <ScrollView style={{maxHeight: 300}}>
              <View style={styles.permissionContainer}>
                {permissions.map(permission => (
                  <View
                    key={permission.permission_id}
                    style={styles.permissionItem}>
                    <Text>{permission.permission_name}</Text>
                    <Switch
                      value={permission.is_active}
                      onValueChange={value => {
                        setPermissions(
                          permissions.map(p =>
                            p.permission_id === permission.permission_id
                              ? {...p, is_active: value}
                              : p,
                          ),
                        );
                      }}
                      disabled={loading}
                    />
                  </View>
                ))}
              </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setisEditPermissionModalVisible(false)}
                disabled={loading}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                // onPress={handlePermissionSubmit}
                disabled={loading}>
                <Text style={styles.submitButtonText}>
                  {loading ? 'Updating...' : 'Submit'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/*Edit User Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={() => setisEditModalVisible(false)}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.modalScrollContainer}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalHeader}>
                Edit {`${selectedUser?.first_name} ${selectedUser?.last_name}`}
              </Text>

              {/* Input Fields for Name and Email */}
              <View style={styles.inputRow}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>* First Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={`${selectedUser?.first_name}`}
                    value={firstname}
                    onChangeText={setFirstName}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>* Last Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={`${selectedUser?.last_name}`}
                    value={lastname}
                    onChangeText={setLastName}
                  />
                </View>
              </View>

              {/* Email Section */}
              <View style={styles.inputRow}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>* Email ID</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={`${selectedUser?.email}`}
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    editable={false}
                  />
                </View>
              </View>

              {/* Reporting Manager Dropdown &&  */}
              <View style={styles.inputRow}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>* Designation</Text>
                  <Picker
                    selectedValue={Designation}
                    onValueChange={itemValue => setDesignation(itemValue)}
                    style={styles.input}>
                    <Picker.Item label="UI/UX" value="UI/UX" />
                    <Picker.Item label="Developer" value="Developer" />
                    <Picker.Item
                      label="Project Manager"
                      value="Project Manager"
                    />
                  </Picker>
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>* Reporting Manager</Text>
                  <Picker
                    selectedValue={manager}
                    onValueChange={itemValue => setManager(itemValue)}
                    style={styles.input}>
                    {users.map((user, index) => (
                      <Picker.Item
                        key={index}
                        label={`${user.first_name} ${user.last_name}`}
                        value={user.user_id}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
              {/*Nested Dropdown */}
              <NestedDeptDropdown onSelect={handleDeptSelect} />

              {/*User Role*/}
              <View style={styles.inputRow}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>* User Role</Text>
                  <Picker
                    selectedValue={selectedRoleID}
                    onValueChange={itemValue => setSelectedRoleID(itemValue)}
                    style={styles.input}>
                    {userRole.map(
                      (
                        role, // Use `userRole` here instead of `userRoles`
                      ) => (
                        <Picker.Item
                          key={role.role_id}
                          label={role.role_name}
                          value={role.role_id}
                        />
                      ),
                    )}
                  </Picker>
                </View>
              </View>
              {/*User Role*/}
              <Text
                style={{
                  color: '#044086',
                  fontFamily: 'Source Sans Pro',
                  fontSize: 14,
                  fontStyle: 'normal',
                  fontWeight: '600',
                  lineHeight: 22,
                  paddingBottom: 5,
                }}>
                Approval Limit
              </Text>
              <View style={styles.inputRow}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>* Currency Selection</Text>
                  <Picker
                    selectedValue={approvalCurrency}
                    onValueChange={itemValue => setApprovalCurrency(itemValue)}
                    style={styles.input}>
                    <Picker.Item label="$ US Dollar" value="Dollar" />
                    <Picker.Item label="₹ Rupees" value="Rupees" />
                    <Picker.Item label="€ Euro" value="Euro" />
                  </Picker>
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>* Budget Amount</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={`${selectedUser?.approval_limit}`}
                    value={budgetAmount}
                    onChangeText={setBudgetAmount}
                  />
                </View>
              </View>
              {/*Average Costing*/}
              <Text
                style={{
                  color: '#044086',
                  fontFamily: 'Source Sans Pro',
                  fontSize: 14,
                  fontStyle: 'normal',
                  fontWeight: '600',
                  lineHeight: 22,
                  paddingBottom: 5,
                }}>
                Average Costing
              </Text>
              <View style={styles.inputRow}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>* Currency Selection</Text>
                  <Picker
                    selectedValue={avgCurrency}
                    onValueChange={itemValue => setAvgCurrency(itemValue)}
                    style={styles.input}>
                    <Picker.Item label="$ US Dollar" value="Dollar" />
                    <Picker.Item label="₹ Rupees" value="Rupees" />
                    <Picker.Item label="€ Euro" value="Euro" />
                  </Picker>
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>* Budget Amount</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={`${selectedUser?.average_cost}`}
                    value={avgbudgetAmount}
                    onChangeText={setAvgBudgetAmount}
                  />
                </View>
              </View>
              {/*Username */}
              {/* <View style={styles.inputRow}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>* Username</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                  />
                </View>
              </View> */}
              {/* Password Enter + Confirmation */}
              {/* <View style={styles.inputRow}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>* Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={handlePasswordChange}
                    secureTextEntry={true} // To hide the password input
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>* Confirm Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                    secureTextEntry={true} // To hide the confirm password input
                  />
                </View>
                {errorMessage ? (
                  <Text style={styles.errorText}>{errorMessage}</Text>
                ) : null}
              </View> */}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 14,
                }}>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => {
                    setisEditModalVisible(false);
                    // Handle form submission logic here (e.g., save user details)
                    handleAddorEditUser();
                  }}>
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>

                {/* Close Button */}
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => setisEditModalVisible(false)}>
                  <Text style={styles.submitButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </Modal>

      {/* Multiple Delete User Modal */}
      <Modal
        visible={isMultipleDeleteModalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={() => setisMultipleDeleteModalVisible(false)}>
        <ScrollView>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalHeader}>
                Are you sure you want to delete
                {` ${allSelectedUsersID.length} users`}
              </Text>

              {/* Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleDeleteMultipleUsers}>
                  <Text style={styles.submitButtonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => setisMultipleDeleteModalVisible(false)}>
                  <Text style={styles.submitButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </Modal>

      {/*Assign Department Modal */}
      <Modal
        visible={isMultipleAssignDeptModalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={() => setisMultipleAssignDeptModalVisible(false)}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.modalScrollContainer}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalHeader}>
                Assign the Department to all
                {` ${allSelectedUsersID.length} users`}
              </Text>

              <NestedDeptDropdown onSelect={handleDeptSelect} />

              {/* Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleUpdateMultipleUsersDepartment}>
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => setisMultipleAssignDeptModalVisible(false)}>
                  <Text style={styles.submitButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </Modal>

      {/*Assign Role Modal */}
      <Modal
        visible={isMultipleRoleAssignModalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={() => setisMultipleRoleAssignModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>
              Assign the Role to all
              {` ${allSelectedUsersID.length} users`}
            </Text>

            {/* <NestedDeptDropdown onSelect={handleDeptSelect} /> */}
            <Picker
              selectedValue={selectedRoleID}
              onValueChange={itemValue => setSelectedRoleID(itemValue)}
              style={styles.input}>
              {userRole.map(
                (
                  role, // Use `userRole` here instead of `userRoles`
                ) => (
                  <Picker.Item
                    key={role.role_id}
                    label={role.role_name}
                    value={role.role_id}
                  />
                ),
              )}
            </Picker>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleUpdateMultipleUsersRole}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => setisMultipleRoleAssignModalVisible(false)}>
                <Text style={styles.submitButtonText}>Cancel</Text>
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
    // maxHeight: 1000000,
  },
  tableRow: {
    flexDirection: 'row',
    //paddingVertical: 10,
  },
  tableHeaderCell: {
    flex: 2,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#757575',
    //maxHeight: 10000,
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
  modalScrollContainer: {
    maxHeight: 800,
    paddingBottom: 40,
    flexGrow: 1,
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
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
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
  permissionsList: {
    marginBottom: 20,
  },
  permissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  permissionLabel: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  //for Edit Permission Modal styles
  modalButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    minWidth: 60,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalContainer1: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '70%', 
    height: '70%', 
    justifyContent: 'space-between',

  },
  closeButton: {
    backgroundColor: '#044086',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 15,
    marginRight: 10,
    paddingHorizontal: 16,
    
    alignSelf: 'flex-end',
   
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  scrollContainer: {
    paddingBottom: 20,
    flexGrow: 1,
  },
});

export default ManageUsers;