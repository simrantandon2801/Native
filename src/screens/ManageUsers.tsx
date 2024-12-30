import React, {useEffect, useState, useMemo} from 'react';
import {Formik, useFormikContext} from 'formik'; // Formik import
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
  updateUserPermissions,
} from '../database/Users';
import NestedDeptDropdown from '../modals/NestedDeptDropdown';
import {DeleteUser} from '../database/Users';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {decodeBase64} from '../core/securedata';
import AdComponent from './Adcomponent';
import NestedMultSelect from '../modals/NestedMultSelect';

interface FormValues {
  firstname: string;
  lastname: string;
  email: string;
  designation: string;
  reporting_to: string;
  selectedRoleID: string;
  approvalCurrency: string;
  budgetAmount: string;
}
interface User {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  customer_id: number;
  reporting_to: number;
  approval_limit: number;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
  is_active: boolean;
  is_deleted: boolean;
  department_id: number;
  average_cost: number;
  phone: string;
  source: string;
  designation: string;
  manager_name: string;
  department_name: string;
  role_name: string;
  role_id: number;
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
  // average_cost: number;
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
  // const { setFieldValue } = useFormikContext();

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User>();
  const [customerID, setCustomerID] = useState('');
  const [isAddUserModalVisible, setisAddUserModalVisible] = useState(false);
  const [isEditPermissionModalVisible, setisEditPermissionModalVisible] =
    useState(false);
  const [isDeleteModalVisible, setisDeleteModalVisible] = useState(false);
  const [isEditModalVisible, setisEditModalVisible] = useState(false);
  const [isFilterModalVisible, setFilterModalVisible] =
    useState<boolean>(false);
  const [firstname, setFirstName] = useState<string>(
    selectedUser ? selectedUser?.first_name : '',
  );
  const [lastname, setLastName] = useState<string>(
    selectedUser ? selectedUser?.last_name : '',
  );
  // const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [reporting_to, setReportingTo] = useState<number>(-1);
  const [budgetAmount, setBudgetAmount] = useState<string>('');
  // const [avgbudgetAmount, setAvgBudgetAmount] = useState<string>('');
  const [Designation, setDesignation] = useState<string>('');
  const [approvalCurrency, setApprovalCurrency] = useState<string>('');
  // const [avgCurrency, setAvgCurrency] = useState<string>('');

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
  // const [selectedDeptPath, setSelectedDeptPath] = useState<string>('');
  const [selectedDeptID, setSelectedDeptID] = useState<number>(-1);
  //made independent visible menu state for each user on the basis of user_id
  const [visibleMenus, setVisibleMenus] = useState<{[key: number]: boolean}>(
    {},
  );
  const [permissions, setPermissions] = useState<UserPermission[]>([]);
  // const [activePermissionIds, setActivePermissionIds] = useState<number[]>([]);
  const [selectedRoleID, setSelectedRoleID] = useState<number>(-1);
  const [userRole, setUserRole] = useState<UserRole[]>([]);
  // Checkbox Logic
  const [allSelectedUsersID, setAllSelectedUsersID] = useState<number[]>([]); // Store selected user IDs
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false); // State for Select All checkbox
  //callback function here the "selectedDeptID state" is being "lift up"

  const handleDeptSelect = (deptID: number) => {
    setSelectedDeptID(deptID); // Update the parent state with the selected department ID
    console.log(`Selected Department ID: ${deptID}`);
    // setFieldValue("selectedDeptID", deptID);
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
  let decodedCustomerID = '';
  const getCustomerId = async () => {
    try {
      const localcustomerID = await AsyncStorage.getItem('Customer_ID');
      decodedCustomerID = decodeBase64(localcustomerID || '');
      console.log('Your Customer ID is ', decodedCustomerID);
      setCustomerID(decodedCustomerID);
      console.log('Your Customer ID is ', customerID);
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

  const [loading, setLoading] = useState(false);

  // const togglePermission = (key: any) => {
  //   setPermissions(prev => ({...prev, [key]: !prev[key]}));
  // };

  const HandleGetUserPermission = async (user_id: string) => {
    // Start loading
    try {
      setLoading(true);
      setPermissions([]);
      // setActivePermissionIds([]);

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

  //used useMemo in activePermissionsIds to avoid extra rerendering
  //as permisison state was already having user_permission_id so no need
  const activePermissionIds = useMemo(
    () =>
      permissions
        .filter(permission => permission.is_active)
        .map(permission => permission.user_permission_id),
    [permissions], //jab bhi permission state change hogi 2 condition ->on togging ->on fetching tab tab activePermisisonIds me jaega code
  );

  const fetchUser = async () => {
    try {
      console.log('my customer ID is ', decodedCustomerID);
      const response = await GetUsers(decodedCustomerID);
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

  const handleAddorEditUser = async (values: FormValues) => {
    const payload: InsertOrEditUser = {
      user_id: selectedUser ? selectedUser.user_id : 0, // Keep the same logic for user_id
      email: values.email || (selectedUser ? selectedUser.email : ''), //4
      first_name:
        values.firstname || (selectedUser ? selectedUser.first_name : ''), //1
      last_name:
        values.lastname || (selectedUser ? selectedUser.last_name : ''), //2
      customer_id: parseInt(customerID),
      reporting_to: parseInt(values.reporting_to), // Use Formik values for reporting_to //5
      approval_limit: parseInt(values.budgetAmount), //6
      is_super_admin: true,
      is_active: true,
      role_id: parseInt(values.selectedRoleID),
      department_id: selectedDeptID, // Extract selectedDeptID from Formik
      // average_cost: parseInt(values.avgbudgetAmount), // Use Formik values for average cost
      phone: '', // Assuming this remains static
      designation: values.designation, // Extract from Formik //3
    };

    try {
      console.log(payload);
      const response = await addUser(payload); // Call the API with the payload
      const parsedRes = JSON.parse(response);
      if (parsedRes.status === 'success') {
        console.log('User Added Successfully');
        fetchUser(); // Refresh the user list
      } else {
        console.error(
          'Failed to add user:',
          parsedRes.message || 'Unknown error',
        );
      }
    } catch (err) {
      console.error('Error Adding User:', err);
    }
  };

  const handleDelete = async (user_id: number) => {
    console.log(user_id);
    const payload = {
      user_ids: [user_id],
    };
    try {
      const response = await DeleteUser(payload); 
      const parsedRes = JSON.parse(response);
      if (parsedRes.status === 'success') {
        setisDeleteModalVisible(false); 
        fetchUser();
      } else {
        console.error('Failed to delete user:', parsedRes.message); 
      }
    } catch (error) {
      console.error('Error deleting user:', error); 
    }
  };

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
  // Handle "Select All" checkbox
  const handleSelectAllCheckbox = () => {
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
  const handleEditPermission = async () => {
    const payload = {
      user_id: selectedUser?.user_id,
      role_id: selectedUser?.role_id,
      user_permission_ids: activePermissionIds,
    };
    console.log('payload of inserting user permissions', payload);
    try {
      const response = await updateUserPermissions(payload); // API call to delete user
      const parsedRes = JSON.parse(response);
      if (parsedRes.status === 'success') {
        console.log(
          'All the permissions you selected are now assigned the selected user',
        );
        //set
        setisEditPermissionModalVisible(false); // Close the modal after successful deletion
        fetchUser();
      } else {
        console.error(
          'Failed to assign permission to user:',
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
  const handleFilterSubmit = async () => {
    try {
      // Initialize the query parameter (if needed)
      let query = ''; // Use this if you have a search term for the query

      // Initialize variables for the parameters to pass into GetUsers
      let reporting_toParam: number | undefined = undefined;
      let department_idParam: number | undefined = undefined;
      let role_idParam: number | undefined = undefined;

      // Check if reporting_to has been set and is not the default value (-1)
      if (reporting_to !== -1) {
        reporting_toParam = reporting_to; // Convert number to
      }

      // Check if department_id has been set and is not the default value (-1)
      if (selectedDeptID !== -1) {
        department_idParam = selectedDeptID; // Convert number to
      }

      // Check if role_id has been set and is not the default value (-1)
      if (selectedRoleID !== -1) {
        role_idParam = selectedRoleID; // Convert number to string
      }

      const result = await GetUsers(
        customerID,
        query,
        reporting_toParam,
        department_idParam,
        role_idParam,
      );

      // Log or handle the result if needed
      console.log('Filtered Users: ', result);

      const parsedResult = JSON.parse(result);
      if (parsedResult.status === 'success') {
        setUsers(parsedResult.data.users);
        setFilterModalVisible(false);
      }
    } catch (err) {
      console.error('Error in handleFilterSubmit:', err);
      // Optionally, handle any error notifications or UI updates
    }
  };

  const handleActiveStatusToggle = async (user: User) => {
    setSelectedUser(user);
    try {
      setLoading(true);
      const updatedUser = {...user, is_active: !user.is_active};
      const res = await addUser(updatedUser);
      const response = JSON.parse(res);
      if (response.status === 'success') {
        setUsers(prevUsers =>
          prevUsers.map(u => (u.role_id === user.role_id ? updatedUser : u)),
        );
      } else {
        throw new Error(response.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object({
    firstname: Yup.string().required('First name is required'),
    lastname: Yup.string().required('Last name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    designation: Yup.string(),
    reporting_to: Yup.string().required('Reporting manager is required'),
    selectedRoleID: Yup.string().required('User role is required'),
    approvalCurrency: Yup.string(),
    budgetAmount: Yup.number()
    .typeError('Budget Amount must be a number') // Ensure it's a number
    .positive('Budget amount must be positive'), // Ensure it's positive
    selectedDeptID: Yup.number()
      .required('Department is required') // Make sure it is required
      .notOneOf([-1], 'Please select a valid department'),
  });

  useEffect(() => {
    const fetchData = async () => {
      await getCustomerId(); // Wait for the customer ID to be fetched
      fetchUser(); // Then, fetch users after the customer ID is ready
      fetchAllRole(); // Fetch roles after fetching users (if needed)
    };
    fetchData(); // Call the async function
  }, []);
  const {width: screenWidth} = Dimensions.get('window');
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
          onPress={() => {
            setisMultipleDeleteModalVisible(true);
          }}>
          <IconButton icon="trash-can-outline" size={16} color="#344054" />
          <Text style={[styles.actionText, {color: '#344054'}]}>Delete</Text>
        </TouchableOpacity>
        {/*Assign Department Button in Action Bar */}
        <TouchableOpacity
          style={[styles.actionButton, styles.leftAction]}
          onPress={() => {
            setisMultipleAssignDeptModalVisible(true);
            setSelectedDeptID(-1);
          }}>
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

          {/* <TouchableOpacity style={styles.actionButton}>
            <IconButton
              icon="table-column-plus-after"
              size={16}
              color="#044086"
            />
            <Text style={[styles.actionText, {color: '#044086'}]}>
              Set Columns
            </Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.actionButton} onPress={toggleModal}>
            <IconButton icon="sync" size={16} color="#044086" />
            <Text style={[styles.actionText, {color: '#044086'}]}>Sync AD</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.actionButton, styles.rightAction]}
          onPress={() => {
            setFilterModalVisible(true);
            setSelectedRoleID(-1);
            setReportingTo(-1);
            setSelectedDeptID(-1); // Reset department_id state to -1
          }}>
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
            onPress={handleSelectAllCheckbox}
          />

          <DataTable.Title>S. No.</DataTable.Title>
          <DataTable.Title>Name</DataTable.Title>
          {/* <DataTable.Title >
            Username
          </DataTable.Title> */}
          <DataTable.Title>Role</DataTable.Title>
          <DataTable.Title style={[{flex: 2}]}>Email ID</DataTable.Title>
          <DataTable.Title>Department</DataTable.Title>
          <DataTable.Title>Reporting Manager</DataTable.Title>
          {/* <DataTable.Title>Projects Active</DataTable.Title> */}
          <DataTable.Title>Approval Limit($)</DataTable.Title>
          {/* <DataTable.Title >
            Average Cost
          </DataTable.Title> */}
          <DataTable.Title>Status</DataTable.Title>
          <DataTable.Title>Actions</DataTable.Title>
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
              <DataTable.Cell>{index + 1}</DataTable.Cell>
              {/* Name: Concatenating first and last name */}
              <DataTable.Cell>
                {`${user.first_name} ${user.last_name}`}
              </DataTable.Cell>{' '}
              {/*Username*/}
              {/* <DataTable.Cell >
                {user.username}
              </DataTable.Cell> */}
              {/* Assuming username as designation */}
              <DataTable.Cell>{user.role_name}</DataTable.Cell>
              {/* Email*/}
              <DataTable.Cell style={[{flex: 2}]}>{user.email}</DataTable.Cell>
              {/* Placeholder for department */}
              <DataTable.Cell>{user.department_name}</DataTable.Cell>
              {/* Reporting Manager: Using reporting_to (ID) */}
              <DataTable.Cell>{user?.manager_name}</DataTable.Cell>
              {/* Placeholder for Projects Active */}
              {/* <DataTable.Cell>{0}</DataTable.Cell> */}
              {/* Placeholder for Approval Limit*/}
              <DataTable.Cell>{user.approval_limit}</DataTable.Cell>
              {/* Placeholder for Average Cost */}
              {/* <DataTable.Cell >
                {user.average_cost}
              </DataTable.Cell> */}
              {/* Placeholder for Status */}
              <DataTable.Cell>
                {loading && selectedUser?.user_id === user.user_id ? (
                  <ActivityIndicator size="small" color="#044086" />
                ) : (
                  <TouchableOpacity
                    onPress={() => handleActiveStatusToggle(user)}>
                    <Text
                      style={[
                        {
                          color: user.is_active ? 'green' : 'red',
                          fontWeight: 'bold',
                        },
                      ]}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Text>
                  </TouchableOpacity>
                )}
              </DataTable.Cell>
              {/* Placeholder for Actions */}
              <DataTable.Cell>
                <Menu
                  visible={visibleMenus[user.user_id] || false}
                  style={{
                    left: screenWidth - 265,
                  }}
                  onDismiss={() => toggleMenu(user.user_id)}
                  anchor={
                    <TouchableOpacity
                      onPress={() => {
                        console.log('Selected User:', user); // Log the user for debugging
                        toggleMenu(user.user_id);
                        setSelectedUser(user);
                        setFirstName(user.first_name);
                        setLastName(user.last_name);
                        setEmail(user.email);
                        setDesignation(user.designation);
                        setReportingTo(user.reporting_to);
                        setSelectedDeptID(user.department_id);
                        setSelectedRoleID(user.role_id);
                        // setAvgBudgetAmount(user.average_cost.toString());  //removed this field from the add user form
                        // setBudgetAmount(user.approval_limit.toString());
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
              {/* Formik Form */}
              <Formik
                initialValues={{
                  firstname: '',
                  lastname: '',
                  email: '',
                  designation: '',
                  reporting_to: '',
                  selectedRoleID: '',
                  approvalCurrency: '',
                  budgetAmount: '',
                  selectedDeptID: -2,
                }}
                validationSchema={validationSchema} // Use validation schema if needed
                onSubmit={values => {
                  setisAddUserModalVisible(false);
                  handleAddorEditUser(values); // Pass form values to handleAddorEditUser
                }}>
                {({
                  values,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  setFieldValue,
                  errors,
                  touched,
                }) => (
                  <View>
                    {/* Input Fields for Name and Email */}
                    <View style={styles.inputRow}>
                      <View style={styles.inputWrapper}>
                        <Text style={styles.label}>
                          <Text style={{color: 'red'}}>
                            <Text style={{color: 'red'}}>*</Text>
                          </Text>{' '}
                          First Name
                        </Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Enter first name"
                          value={values.firstname}
                          onChangeText={handleChange('firstname')}
                          onBlur={handleBlur('firstname')}
                        />
                        {touched.firstname && errors.firstname && (
                          <Text style={styles.errorText}>
                            {errors.firstname}
                          </Text>
                        )}
                      </View>
                      <View style={styles.inputWrapper}>
                        <Text style={styles.label}>
                          <Text style={{color: 'red'}}>
                            <Text style={{color: 'red'}}>*</Text>
                          </Text>{' '}
                          Last Name
                        </Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Enter last name"
                          value={values.lastname}
                          onChangeText={handleChange('lastname')}
                          onBlur={handleBlur('lastname')}
                        />
                        {touched.lastname && errors.lastname && (
                          <Text style={styles.errorText}>
                            {errors.lastname}
                          </Text>
                        )}
                      </View>
                    </View>

                    <View style={styles.inputRow}>
                      <View style={styles.inputWrapper}>
                        <Text style={styles.label}>
                          <Text style={{color: 'red'}}>
                            <Text style={{color: 'red'}}>*</Text>
                          </Text>{' '}
                          Email ID
                        </Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Enter email"
                          keyboardType="email-address"
                          value={values.email}
                          onChangeText={handleChange('email')}
                          onBlur={handleBlur('email')}
                        />
                        {touched.email && errors.email && (
                          <Text style={styles.errorText}>{errors.email}</Text>
                        )}
                      </View>
                    </View>

                    {/* Designation Dropdown */}
                    <View style={styles.inputRow}>
                      <View style={styles.inputWrapper}>
                        <Text style={styles.label}>
                          <Text style={{color: 'red'}}>
                          </Text>{' '}
                          Designation
                        </Text>
                        <Picker
                          selectedValue={values.designation}
                          onValueChange={handleChange('designation')}
                          onBlur={handleBlur('designation')}
                          style={styles.input}>
                          <Picker.Item
                            label="Select Designation"
                            value=""
                            color="#aaa"
                          />
                          <Picker.Item label="UI/UX" value="UI/UX" />
                          <Picker.Item label="Developer" value="Developer" />
                          <Picker.Item
                            label="Project Manager"
                            value="Project Manager"
                          />
                        </Picker>
                        {touched.designation && errors.designation && (
                          <Text style={styles.errorText}>
                            {errors.designation}
                          </Text>
                        )}
                      </View>
                      <View style={styles.inputWrapper}>
                        <Text style={styles.label}>
                          <Text style={{color: 'red'}}>
                            <Text style={{color: 'red'}}>*</Text>
                          </Text>{' '}
                          Reporting Manager
                        </Text>
                        <Picker
                          selectedValue={values.reporting_to}
                          onValueChange={value => {
                            if (value !== '') {
                              handleChange('reporting_to')(value);
                            }
                          }}
                          onBlur={handleBlur('reporting_to')}
                          style={styles.input}>
                          <Picker.Item
                            label="Select a user"
                            value=""
                            color="#aaa"
                          />
                          {users.map((user, index) => (
                            <Picker.Item
                              key={index}
                              label={`${user.first_name} ${user.last_name}`}
                              value={user.user_id}
                            />
                          ))}
                        </Picker>
                        {touched.reporting_to && errors.reporting_to && (
                          <Text style={styles.errorText}>
                            {errors.reporting_to}
                          </Text>
                        )}
                      </View>
                    </View>

                    <View style={{paddingVertical: 15}}>
                    <Text style={styles.label}>
                          <Text style={{color: 'red'}}>
                            <Text style={{color: 'red'}}>*</Text>
                          </Text>{' '}
                           Department
                        </Text>
                      <NestedDeptDropdown
                        onSelect={handleDeptSelect}
                        selectedValue={selectedDeptID.toString()} // Pass current value from Formik
                        placeholder={'Select a department'}
                      />
                      {/* <NestedMultSelect/> */}
                      {touched.selectedDeptID && errors.selectedDeptID && (
                        <Text style={styles.errorText}>
                          {errors.selectedDeptID}
                        </Text> // Show error if touched and invalid
                      )}
                    </View>

                    {/* User Role Picker */}
                    <View style={styles.inputRow}>
                      <View style={styles.inputWrapper}>
                        <Text style={styles.label}>
                          <Text style={{color: 'red'}}>
                            <Text style={{color: 'red'}}>*</Text>
                          </Text>{' '}
                          User Role
                        </Text>
                        <Picker
                          selectedValue={values.selectedRoleID}
                          onValueChange={value => {
                            if (value !== '') {
                              handleChange('selectedRoleID')(value);
                            }
                          }}
                          onBlur={handleBlur('selectedRoleID')}
                          style={styles.input}>
                          {/* Placeholder Option */}
                          <Picker.Item
                            label="Select a role"
                            value=""
                            color="#aaa"
                          />

                          {/* Actual Options */}
                          {userRole.map(role => (
                            <Picker.Item
                              key={role.role_id}
                              label={role.role_name}
                              value={role.role_id}
                            />
                          ))}
                        </Picker>

                        {touched.selectedRoleID && errors.selectedRoleID && (
                          <Text style={styles.errorText}>
                            {errors.selectedRoleID}
                          </Text>
                        )}
                      </View>
                    </View>
                    {/* Approval Limit */}
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
                        <Text style={styles.label}>
                          <Text style={{color: 'red'}}>
                            
                          </Text>{' '}
                          Currency Selection
                        </Text>
                        <Picker
                          selectedValue={values.approvalCurrency || 'Dollar'}
                          onValueChange={value => {
                            if (value !== '') {
                              handleChange('approvalCurrency')(value);
                            }
                          }}
                          onBlur={handleBlur('approvalCurrency')}
                          style={styles.input}>
                          <Picker.Item
                            label="Select Currency"
                            value=""
                            color="#aaa"
                          />

                          <Picker.Item label="$ US Dollar" value="Dollar" />
                          <Picker.Item label="₹ Rupees" value="Rupees" />
                          <Picker.Item label="€ Euro" value="Euro" />
                        </Picker>

                        {touched.approvalCurrency &&
                          errors.approvalCurrency && (
                            <Text style={styles.errorText}>
                              {errors.approvalCurrency}
                            </Text>
                          )}
                      </View>
                      <View style={styles.inputWrapper}>
                        <Text style={styles.label}>
                          <Text style={{color: 'red'}}>
                            
                          </Text>{' '}
                          Budget Amount
                        </Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Budget Amount"
                          value={values.budgetAmount}
                          onChangeText={handleChange('budgetAmount')}
                          onBlur={handleBlur('budgetAmount')}
                        />
                        {touched.budgetAmount && errors.budgetAmount && (
                          <Text style={styles.errorText}>
                            {errors.budgetAmount}
                          </Text>
                        )}
                      </View>
                    </View>

                    {/* Submit and Close Buttons */}
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: 14,
                      }}>
                      {/* Close Button */}
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setisAddUserModalVisible(false)}>
                        <Text style={styles.closeButtonText}>Close</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit} // Formik submit function
                      >
                        <Text style={styles.submitButtonText}>Submit</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </Formik>
            </View>
          </View>
        </ScrollView>
      </Modal>

      {/* Sync AD */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isADModalVisible}
        onRequestClose={toggleModal}>
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
                style={styles.closeButton}
                onPress={() => setisDeleteModalVisible(false)}>
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={() =>
                  selectedUser?.user_id && handleDelete(selectedUser.user_id)
                }>
                <Text style={styles.submitButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit User Permission  Modal */}
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
                        console.log(
                          `Permission Name: ${permission.permission_name} is ${value}`,
                        );
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
                style={[styles.modalButton, styles.closeButton]}
                onPress={() => setisEditPermissionModalVisible(false)}
                disabled={loading}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleEditPermission}
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

              <Formik
                initialValues={{
                  firstname: selectedUser?.first_name || '',
                  lastname: selectedUser?.last_name || '',
                  email: selectedUser?.email || '',
                  designation: '',
                  reporting_to: selectedUser?.reporting_to ? selectedUser?.reporting_to : 'No Mangager',
                  selectedRoleID: selectedRoleID || '',
                  approvalCurrency: '',
                  budgetAmount: selectedUser?.approval_limit ? selectedUser?.approval_limit  : 'No budget',
                  selectedDeptID: selectedUser?.department_id ,
                }}
                validationSchema={validationSchema}
                onSubmit={values => {
                  handleAddorEditUser(values);
                  setisEditModalVisible(false);
                }}>
                {({
                  handleChange,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                  setFieldValue,
                }) => (
                  <>
                    {/* Input Fields for Name and Email */}
                    <View style={styles.inputRow}>
                      <View style={styles.inputWrapper}>
                        <Text style={styles.label}>
                          <Text style={{color: 'red'}}>* </Text>First Name
                        </Text>
                        <TextInput
                          style={styles.input}
                          value={values.firstname}
                          onChangeText={handleChange('firstname')}
                        />
                        {touched.firstname && errors.firstname && (
                          <Text style={styles.errorText}>
                            {errors.firstname}
                          </Text>
                        )}
                      </View>
                      <View style={styles.inputWrapper}>
                        <Text style={styles.label}>
                          <Text style={{color: 'red'}}>* </Text>Last Name
                        </Text>
                        <TextInput
                          style={styles.input}
                          value={values.lastname}
                          onChangeText={handleChange('lastname')}
                        />
                        {touched.lastname && errors.lastname && (
                          <Text style={styles.errorText}>
                            {errors.lastname}
                          </Text>
                        )}
                      </View>
                    </View>

                    {/* Email Section */}
                    <View style={styles.inputRow}>
                      <View style={styles.inputWrapper}>
                        <Text style={styles.label}>
                          <Text style={{color: 'red'}}>* </Text>Email ID
                        </Text>
                        <TextInput
                          style={styles.input}
                          value={values.email}
                          editable={false}
                        />
                        {touched.email && errors.email && (
                          <Text style={styles.errorText}>{errors.email}</Text>
                        )}
                      </View>
                    </View>

                    {/* Designation and Reporting Manager */}
                    <View style={styles.inputRow}>
                      <View style={styles.inputWrapper}>
                        <Text style={styles.label}>
                          <Text style={{color: 'red'}}>* </Text>Designation
                        </Text>
                        <Picker
                          selectedValue={values.designation}
                          onValueChange={value => {
                            if (value !== '') {
                              setFieldValue('designation', value);
                            }
                          }}
                          style={styles.input}>
                          <Picker.Item
                            label="Select a designation"
                            value=""
                            color="#aaa"
                          />
                          <Picker.Item label="UI/UX" value="UI/UX" />
                          <Picker.Item label="Developer" value="Developer" />
                          <Picker.Item
                            label="Project Manager"
                            value="Project Manager"
                          />
                        </Picker>
                        {touched.designation && errors.designation && (
                          <Text style={styles.errorText}>
                            {errors.designation}
                          </Text>
                        )}
                      </View>
                      <View style={styles.inputWrapper}>
                        <Text style={styles.label}>
                          <Text style={{color: 'red'}}>* </Text>Reporting
                          Manager
                        </Text>
                        <Picker
                          selectedValue={values.reporting_to}
                          onValueChange={value => {
                            if (value !== '') {
                              setFieldValue('reporting_to', value);
                            }
                          }}
                          style={styles.input}>
                          <Picker.Item
                            label="Select a manager"
                            value=""
                            color="#aaa"
                          />
                          {users.map((user, index) => (
                            <Picker.Item
                              key={index}
                              label={`${user.first_name} ${user.last_name}`}
                              value={user.user_id}
                            />
                          ))}
                        </Picker>
                        {touched.reporting_to && errors.reporting_to && (
                          <Text style={styles.errorText}>
                            {errors.reporting_to}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={{paddingVertical: 15}}>
                    <Text style={styles.label}>
                          <Text style={{color: 'red'}}>
                            <Text style={{color: 'red'}}>*</Text>
                          </Text>{' '}
                           Department
                        </Text>
                      <NestedDeptDropdown
                        onSelect={handleDeptSelect}
                        // selectedValue={values?.selectedDeptID?.toString()}
                        placeholder={
                          selectedUser
                            ? selectedUser.department_name
                            : 'Select a department'
                        }
                      />
                      {touched.selectedDeptID && errors.selectedDeptID && (
                        <Text style={styles.errorText}>
                          {errors.selectedDeptID}
                        </Text> // Show error if touched and invalid
                      )}
                    </View>
                    {/* User Role */}
                    <View style={styles.inputRow}>
                      <View style={styles.inputWrapper}>
                        <Text style={styles.label}>
                          <Text style={{color: 'red'}}>* </Text>User Role
                        </Text>
                        <Picker
                          selectedValue={values.selectedRoleID}
                          onValueChange={value => {
                            if (value !== '') {
                              setFieldValue('selectedRoleID', value);
                            }
                          }}
                          style={styles.input}>
                          <Picker.Item
                            label="Select a role"
                            value=""
                            color="#aaa"
                          />
                          {userRole.map(role => (
                            <Picker.Item
                              key={role.role_id}
                              label={role.role_name}
                              value={role.role_id}
                            />
                          ))}
                        </Picker>
                        {touched.selectedRoleID && errors.selectedRoleID && (
                          <Text style={styles.errorText}>
                            {errors.selectedRoleID}
                          </Text>
                        )}
                      </View>
                    </View>

                    {/* Approval Limit */}
                    <Text style={styles.sectionHeader}>Approval Limit</Text>
                    <View style={styles.inputRow}>
                      <View style={styles.inputWrapper}>
                        <Text style={styles.label}>
                          <Text style={{color: 'red'}}>* </Text>Currency
                          Selection
                        </Text>
                        <Picker
                          selectedValue={values.approvalCurrency || 'Dollar'}
                          onValueChange={value => {
                            if (value !== '') {
                              setFieldValue('approvalCurrency', value);
                            }
                          }}
                          style={styles.input}>
                          <Picker.Item
                            label="Select a currency"
                            value=""
                            color="#aaa"
                          />
                          <Picker.Item label="$ US Dollar" value="Dollar" />
                          <Picker.Item label="₹ Rupees" value="Rupees" />
                          <Picker.Item label="€ Euro" value="Euro" />
                        </Picker>
                        {touched.approvalCurrency &&
                          errors.approvalCurrency && (
                            <Text style={styles.errorText}>
                              {errors.approvalCurrency}
                            </Text>
                          )}
                      </View>
                      <View style={styles.inputWrapper}>
                        <Text style={styles.label}>
                          <Text style={{color: 'red'}}>* </Text>Budget Amount
                        </Text>
                        <TextInput
                          style={styles.input}
                          value={values.budgetAmount}
                          onChangeText={handleChange('budgetAmount')}
                        />
                        {touched.budgetAmount && errors.budgetAmount && (
                          <Text style={styles.errorText}>
                            {errors.budgetAmount}
                          </Text>
                        )}
                      </View>
                    </View>

                    {/* Buttons */}
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: 14,
                      }}>
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setisEditModalVisible(false)}>
                        <Text style={styles.closeButtonText}>Close</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Submit</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </Formik>
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.modalScrollContainer}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalHeader}>
                Are you sure you want to delete
                {` ${allSelectedUsersID.length} users`}
              </Text>

              {/* Buttons */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 14,
                }}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setisMultipleDeleteModalVisible(false)}>
                  <Text style={styles.closeButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleDeleteMultipleUsers}>
                  <Text style={styles.submitButtonText}>Delete</Text>
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

              <NestedDeptDropdown
                onSelect={handleDeptSelect} // Set value to Formik
                placeholder={
                  selectedUser
                    ? selectedUser.department_name
                    : 'Select a department'
                }
              />

              {/* Buttons */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 14,
                }}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setisMultipleAssignDeptModalVisible(false)}>
                  <Text style={styles.closeButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleUpdateMultipleUsersDepartment}>
                  <Text style={styles.submitButtonText}>Submit</Text>
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
              Assign the Role to
              {` ${allSelectedUsersID.length} user(s)`}
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
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 14,
              }}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setisMultipleRoleAssignModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleUpdateMultipleUsersRole}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/*Filter Modal */}
      <Modal
        visible={isFilterModalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={() => setFilterModalVisible(false)}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.modalScrollContainer}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainerRight}>
              <Text style={styles.modalHeader}>Filter Options</Text>

              {/*User Role*/}
              <View style={styles.inputRow}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>
                    <Text style={{color: 'red'}}>
                      <Text style={{color: 'red'}}>*</Text>{' '}
                    </Text>{' '}
                    User Role
                  </Text>
                  <Picker
                    selectedValue={selectedRoleID}
                    onValueChange={itemValue => {
                      setSelectedRoleID(itemValue);
                      console.log('Selected Role ID:', itemValue); // Log the selected value
                    }}
                    style={styles.input}>
                    <Picker.Item label="Select a user" value="" color="#aaa" />
                    {userRole.map(role => (
                      <Picker.Item
                        key={role.role_id}
                        label={role.role_name}
                        value={role.role_id}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
              {/* Reporting Manager Dropdown &&  */}
              <View style={styles.inputRow}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>
                    <Text style={{color: 'red'}}>
                      <Text style={{color: 'red'}}>*</Text>{' '}
                    </Text>{' '}
                    Reporting Manager
                  </Text>
                  <Picker
                    selectedValue={reporting_to}
                    onValueChange={itemValue => {
                      setReportingTo(itemValue);
                      console.log('Selected Reporting Manager ID:', itemValue); // Log the selected value
                    }}
                    style={styles.input}>
                    <Picker.Item label="Select a user" value="" color="#aaa" />
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
              <View style={styles.nestedDropDownContainer}>
                <NestedDeptDropdown
                  onSelect={handleDeptSelect} // Set value to Formik
                  placeholder={
                    selectedUser
                      ? selectedUser.department_name
                      : 'Select a department'
                  }
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 14,
                }}>
                {/* Close Button */}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    // Reset all the states here
                    setSelectedRoleID(-1);
                    setReportingTo(-1);
                    setSelectedDeptID(-1); // Reset department_id state to -1
                    fetchUser(); // Call fetchUser to refresh the data
                    setFilterModalVisible(false); // Close the filter modal
                  }}>
                  <Text style={styles.closeButtonText}>Clear Filter</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => {
                    // setFilterModalVisible(false);
                    handleFilterSubmit();
                  }}>
                  <Text style={styles.submitButtonText}>Submit</Text>
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
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    //padding: 7,
    backgroundColor: '#f4f4f4',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  actionText: {
    fontSize: 14,
  },
  middleActions: {
    flexDirection: 'row',
    justifyContent:'center'
  },
  leftAction: {
    marginRight: 2,
    // paddingLeft:10
  },
  rightAction: {
    marginLeft: 'auto', // To push the element to the right
    justifyContent: 'center', // Center content vertically if needed
    alignItems: 'center', // Aligns items horizontally if necessary
    padding: 10, // Padding for better spacing
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
    backgroundColor:'#fff'
    //maxHeight: 10000,
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
     backgroundColor:'#fff'
  },
  center: {
    textAlign: 'center',
  },
  modalContainerSmall: {
    width: '25%', // Adjust this width to be even smaller (25% of the screen width)
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15, // Reduced padding to make the modal smaller and compact
    position: 'absolute',
    top: '20%', // Position it below the desired section
    right: 0, // Keep it on the right side
    zIndex: 100, // Ensure it's above other content
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
  modalContainerRight: {
    width: '25%', // Adjust width if needed
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 40,
    position: 'absolute',
    top: '20%', // Adjust to make the modal appear below a specific section (like "Filter Options")
    right: 10, // Position it on the right side
    zIndex: 100, // Ensure it's above other content
    flexGrow: 1,
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 20,
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
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 15,
    marginRight: 10,
    paddingHorizontal: 16,
    color: '#232323',
    alignSelf: 'flex-end',
  },

  closeButtonText: {
    color: '#232323',
    fontSize: 16,
    textAlign: 'center',
  },
  scrollContainer: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  filterModalOverlay: {
    flex: 1, // Ensures the overlay takes up the full screen height
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center', // Centers the modal vertically
    alignItems: 'flex-end', // Aligns modal content to the right of the screen
  },

  // Modal Content
  filterModalContent: {
    width: 200, // Define the width of the modal
    height: '50%', // Define the height of the modal (adjust as needed)
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10, // Add bottom left radius to make it look smoother
    elevation: 5, // Add some shadow if needed
  },

  // Title style inside the modal
  filterModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    justifyContent: 'center',
  },
  nestedDropDownContainer: {
    width: '80%', // or you can use any fixed value like 350
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
  },
});

export default ManageUsers;
