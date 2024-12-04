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
import {DataTable, Icon, IconButton, Menu} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import { GetUsers } from '../database/RestData';
// Define the User type to ensure type safety
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

const {height} = Dimensions.get('window');
const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [manager, setManager] = useState('');
  const [Designation, setDesignation] = useState('');
  const [actionsVisible, setActionsvisible] = useState(false); // State to control menu visibility

  const toggleMenu = () => setActionsvisible(prev => !prev);
  


  const fetchUser = async ()=>{
    try{
      const response = await GetUsers("");
      const parsedRes = JSON.parse(response);
      if(parsedRes.status === 'success') setUsers(parsedRes.data.users);
      else console.error("Failed to fetch users:", parsedRes.message || "Unknown error");
      
    }catch(err){
      console.log('Error Fetching Users', err)
    }
  }

  useEffect(()=>{
    fetchUser();
  },[])

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
            onPress={() => setIsModalVisible(true)}>
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
    <DataTable.Title>Designation</DataTable.Title>
    <DataTable.Title>Role</DataTable.Title>
    <DataTable.Title>Email ID</DataTable.Title>
    <DataTable.Title>Department</DataTable.Title>
    <DataTable.Title>Reporting Manager</DataTable.Title>
    <DataTable.Title>Projects Active</DataTable.Title>
    <DataTable.Title>Approval Limit</DataTable.Title>
    <DataTable.Title>Average Cost</DataTable.Title>
    <DataTable.Title>Active/ Inactive</DataTable.Title>
    <DataTable.Title>Permissions</DataTable.Title>
    <DataTable.Title>Actions</DataTable.Title>
  </DataTable.Header>

  {/* Table Rows */}
  <ScrollView showsVerticalScrollIndicator={false}>
    {users.map((user, index) => (
      <DataTable.Row style={styles.table} key={user.user_id}>
        <DataTable.Cell>{index + 1}</DataTable.Cell>
        <DataTable.Cell>{`${user.first_name} ${user.last_name}`}</DataTable.Cell> {/* Name: Concatenating first and last name */}
        <DataTable.Cell>{user.username}</DataTable.Cell> {/* Assuming username as designation */}
        <DataTable.Cell>{user.is_super_admin ? "Super Admin" : "User"}</DataTable.Cell> {/* Role: Based on is_super_admin */}
        <DataTable.Cell>{user.email}</DataTable.Cell>
        <DataTable.Cell>{user.customer_id ? "Customer" : "No Department"}</DataTable.Cell> {/* Placeholder for department */}
        <DataTable.Cell>{user.reporting_to}</DataTable.Cell> {/* Reporting Manager: Using reporting_to (ID) */}
        <DataTable.Cell>{'N/A'}</DataTable.Cell> {/* Placeholder for Projects Active */}
        <DataTable.Cell>{user.approval_limit}</DataTable.Cell>
        <DataTable.Cell>{'N/A'}</DataTable.Cell> {/* Placeholder for Average Cost */}
        <DataTable.Cell>{'Active'}</DataTable.Cell> {/* Placeholder for Active/Inactive */}
        <DataTable.Cell>{'N/A'}</DataTable.Cell> {/* Placeholder for Permissions */}
        <DataTable.Cell>
          {/* Wrapping Menu and IconButton */}
          <Menu
            visible={actionsVisible}
            onDismiss={toggleMenu}
            anchor={
              <TouchableOpacity onPress={toggleMenu}>
                <IconButton icon="dots-vertical" size={20} />
              </TouchableOpacity>
            }>
            {/* Menu items */}
            <Menu.Item onPress={() => console.log("Edit Permissions")} title="Edit Permissions" />
            <Menu.Item onPress={() => console.log("Activate/Deactivate")} title="Activate/Deactivate" />
            <Menu.Item onPress={() => console.log("Delete")} title="Delete" />
          </Menu>
        </DataTable.Cell>
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
            <Text style={styles.modalHeader}>Add New User</Text>

            {/* Input Fields for Name and Email */}
            <View style={styles.inputRow}>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>* Name/Title</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter name"
                  value={name}
                  onChangeText={setName}
                />
              </View>
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
            <View style={styles.inputRow}>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>* Designation</Text>
                <Picker
                  selectedValue={Designation}
                  onValueChange={itemValue => setDesignation(itemValue)}
                  style={styles.picker}>
                  <Picker.Item label="UX Designing" value="UX Designing" />
                  <Picker.Item
                    label="Web Development"
                    value="Web Development"
                  />
                  <Picker.Item
                    label="Project Management"
                    value="Project Management"
                  />
                </Picker>
              </View>
            </View>

            {/* Reporting Manager Dropdown */}
            <View style={styles.inputRow}>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>* Reporting Manager</Text>
                <Picker
                  selectedValue={manager}
                  onValueChange={itemValue => setManager(itemValue)}
                  style={styles.picker}>
                  <Picker.Item label="Rachel" value="Rachel" />
                  <Picker.Item label="John" value="John" />
                  <Picker.Item label="Sophia" value="Sophia" />
                </Picker>
              </View>
            </View>
            <Text style={styles.label}>* Reporting Manager</Text>
            <Picker
              selectedValue={manager}
              onValueChange={itemValue => setManager(itemValue)}
              style={styles.picker}>
              <Picker.Item label="Rachel" value="Rachel" />
              <Picker.Item label="John" value="John" />
              <Picker.Item label="Sophia" value="Sophia" />
            </Picker>
            <View
              style={{flexDirection: 'row', justifyContent: 'center', gap: 14}}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  setIsModalVisible(false);
                  // Handle form submission logic here (e.g., save user details)
                }}>
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

export default ManageUsers;
