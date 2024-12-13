import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  TextInput,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {DataTable, Icon, IconButton, Menu, Switch} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import {
  GetUsers,
  addUser,
  GetUserRole,
  GetUserPermission,
} from '../database/RestData';
import NestedDeptDropdown from '../modals/NestedDeptDropdown';
import {DeleteUser} from '../database/RestData';
import * as Yup from 'yup';

interface User {
  user_id: number; // Unique ID for the user
  username: string; // Username
  email: string; // User's email address
  first_name: string; // First name
  last_name: string; // Last name
  customer_id: number; // ID of the customer (default: 0)
  reporting_to: number; // Reporting manager's ID (default: 0)
  approval_limit: number; // Approval limit (default: 0)
  is_super_admin: boolean; // Flag to indicate if the user is a super admin
  created_at: string; // Timestamp when the user was created
  updated_at: string; // Timestamp when the user was last updated
  created_by: number | null; // ID of the user who created this record
  updated_by: number | null; // ID of the user who last updated this record
}

interface InsertOrEditUser {
  user_id: number; // ID of the user, 0 for new users
  username?: string; // Username of the user
  email: string; // Email address of the user
  password: string; // Password for the user
  first_name: string; // First name of the user
  last_name: string; // Last name of the user
  customer_id: number; // ID of the customer, 0 for default
  reporting_to: number; // ID of the manager/reporting person
  approval_limit: number; // Budget approval limit
  is_super_admin: boolean; // Whether the user is a super admin
  is_active: boolean; // Whether the user account is active
  role_id: number; // ID of the role assigned to the user
}

interface UserRole {
  role_id: number;
  role_name: string;
  role_level: string | number; // Depending on how the role_level is represented
  is_active: boolean;
}

const {height} = Dimensions.get('window');

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User>();

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
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  //For Confirm password field in Add User Modal
  const handlePasswordChange = value => {
    setPassword(value);
    if (value !== confirmPassword) {
      setErrorMessage('Password does not match');
    } else {
      setErrorMessage('');
    }
  };
  //For Confirm password field in Add User Modal
  const handleConfirmPasswordChange = value => {
    setConfirmPassword(value);
    if (value !== password) {
      setErrorMessage('Password does not match');
    } else {
      setErrorMessage('');
    }
  };

  //made independent visible menu state for each user on the basis of user_id
  const [visibleMenus, setVisibleMenus] = useState<{[key: number]: boolean}>(
    {},
  );

  //Toggle function for opening and closing ":" Menu inside actions table
  const toggleMenu = (userId: number) => {
    setVisibleMenus(prev => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const [permissions, setPermissions] = useState({});

  const togglePermission = (key: any) => {
    setPermissions(prev => ({...prev, [key]: !prev[key]}));
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
    console.log(selectedRole);
    const payload: InsertOrEditUser = {
      user_id: selectedUser ? selectedUser.user_id : 0,
      username: username || (selectedUser ? selectedUser.username : ''),
      email: email || (selectedUser ? selectedUser.email : ''),
      password: '',
      first_name: firstname || (selectedUser ? selectedUser.first_name : ''),
      last_name: lastname || (selectedUser ? selectedUser.last_name : ''),
      customer_id: 0,
      reporting_to: parseInt(manager),
      approval_limit: parseInt(budgetAmount),
      is_super_admin: true,
      is_active: true,
      role_id: selectedRole,
    };
    try {
      console.log(payload);
      const response = await addUser(payload);
      const parsedRes = JSON.parse(response);
      if (parsedRes.status === 'success')
        console.log(' User Added succesfully');
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
      } else {
        console.error('Failed to delete user:', parsedRes.message); // Handle failure
      }
    } catch (error) {
      console.error('Error deleting user:', error); // Handle any errors
    }
  };

  const [selectedRole, setSelectedRole] = useState<number>(-1);
  const [userRole, setUserRole] = useState<UserRole[]>([]);
  const fetchUserRole = async () => {
    try {
      const response = await GetUserRole('');
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

  const HandleGetUserPermission = async (user_id: string) => {
    try {
      const response = await GetUserPermission(user_id);
      const parsedRes = JSON.parse(response);
      if (parsedRes.status === 'success') {
        console.log(
          'Permission of' + {user_id} + 'fetched succesfully',
          parsedRes,
        );
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

  useEffect(() => {
    fetchUser();
    fetchUserRole();
  }, []);

  return (
    <>
      {/* Manage Users Section */}
      <View style={styles.manageUsersContainer}>
        <Text style={styles.heading}>Manage Users</Text>
      </View>

      {/* Action Bar */}
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionButton, styles.leftAction]}>
          <IconButton icon="trash-can-outline" size={16} color="#344054" />
          <Text style={[styles.actionText, {color: '#344054'}]}>Delete</Text>
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
          <TouchableOpacity style={styles.actionButton}>
            <IconButton icon="sync" size={16} color="#044086" />
            <Text style={[styles.actionText, {color: '#044086'}]}>Sync AD</Text>
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
          <DataTable.Title>S. No.</DataTable.Title>
          <DataTable.Title>Name</DataTable.Title>
          <DataTable.Title>Username</DataTable.Title>
          <DataTable.Title>Role</DataTable.Title>
          <DataTable.Title>Email ID</DataTable.Title>
          <DataTable.Title>Department</DataTable.Title>
          <DataTable.Title>Reporting Manager</DataTable.Title>
          <DataTable.Title>Projects Active</DataTable.Title>
          <DataTable.Title>Approval Limit</DataTable.Title>
          <DataTable.Title>Average Cost</DataTable.Title>
          <DataTable.Title>Active/ Inactive</DataTable.Title>
          <DataTable.Title>Actions</DataTable.Title>
        </DataTable.Header>

        {/* Table Rows */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{maxHeight: 4150}}>
          {users.map((user, index) => (
            <DataTable.Row style={styles.table} key={user.user_id}>
              <DataTable.Cell>{index + 1}</DataTable.Cell>
              <DataTable.Cell>{`${user.first_name} ${user.last_name}`}</DataTable.Cell>{' '}
              {/* Name: Concatenating first and last name */}
              <DataTable.Cell>{user.username}</DataTable.Cell>
              {/* Assuming username as designation */}
              <DataTable.Cell>
                {user.is_super_admin ? 'Super Admin' : 'User'}
              </DataTable.Cell>
              {/* Role: Based on is_super_admin */}
              <DataTable.Cell>{user.email}</DataTable.Cell>
              <DataTable.Cell>
                {user.customer_id ? 'Customer' : 'No Department'}
              </DataTable.Cell>
              {/* Placeholder for department */}
              <DataTable.Cell>{user.reporting_to}</DataTable.Cell>
              {/* Reporting Manager: Using reporting_to (ID) */}
              <DataTable.Cell>{'N/A'}</DataTable.Cell>
              {/* Placeholder for Projects Active */}
              <DataTable.Cell>{user.approval_limit}</DataTable.Cell>
              <DataTable.Cell>{'N/A'}</DataTable.Cell>
              {/* Placeholder for Average Cost */}
              <DataTable.Cell>{'Active'}</DataTable.Cell>
              {/* Placeholder for Active/Inactive */}
              {/* Placeholder for Permissions */}
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
              <NestedDeptDropdown />
              {/*User Role*/}
              <View style={styles.inputRow}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>* User Role</Text>
                  <Picker
                    selectedValue={selectedRole}
                    onValueChange={itemValue => setSelectedRole(itemValue)}
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
      <Modal
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
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
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
              <NestedDeptDropdown />

              {/*User Role*/}
              <View style={styles.inputRow}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>* User Role</Text>
                  <Picker
                    selectedValue={selectedRole}
                    onValueChange={itemValue => setSelectedRole(itemValue)}
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
                    placeholder={`${selectedUser?.first_name} ${selectedUser?.last_name}`}
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
                    placeholder={`${selectedUser?.customer_id}`}
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
    flex: 1,
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
});

export default ManageUsers;
