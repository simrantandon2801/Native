import React, {useState} from 'react';
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
import { HomeStackNavigatorParamList } from '../../type';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { navigate } from '../navigations/RootNavigation';
// Define the User type to ensure type safety
interface User {
  id: number;
  name: string;
  designation: string;
  role: string;
  email: string;
  department: string;
  manager: string;
  projects: number;
  approval: string;
  avg_cost: string;
  status: string;
  permission: string;
}

 
type NavigationProp = NativeStackNavigationProp<HomeStackNavigatorParamList, 'ManageUsers'>;
const {height} = Dimensions.get('window');
const ManageUsers: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [manager, setManager] = useState('');
  const [Designation, setDesignation] = useState('');
  const [actionsVisible, setActionsvisible] = useState(false); // State to control menu visibility
  const navigation = useNavigation<NavigationProp>();
  const toggleMenu = () => setActionsvisible(prev => !prev);
  const users: User[] = [
    {
      id: 1,
      name: 'Marcus',
      designation: 'CEO',
      role: 'Project Mgr',
      email: 'xyz@corporate.com',
      department: 'US Projects > Development',
      manager: 'John Doe',
      projects: 1,
      approval: '$100,000',
      avg_cost: '$1000',
      status: 'Active',
      permission: 'yes',
    },
    {
      id: 2,
      name: 'John Wick',
      designation: 'Director',
      role: 'Project Member',
      email: 'xyz@corporate.com',
      department: 'US Projects > Development',
      manager: 'John Doe',
      projects: 5,
      approval: '$100,000',
      avg_cost: '$1000',
      status: 'Active',
      permission: 'yes',
    },
  ];

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
          <DataTable.Title> Permissions</DataTable.Title>
          <DataTable.Title> Actions </DataTable.Title>
        </DataTable.Header>

        {/* Table Rows */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {users.map((user, index) => (
            <DataTable.Row style={styles.table} key={user.id}>
              <DataTable.Cell>{index + 1}</DataTable.Cell>
              <DataTable.Cell>{user.name}</DataTable.Cell>
              <DataTable.Cell>{user.designation}</DataTable.Cell>
              <DataTable.Cell>{user.role}</DataTable.Cell>
              <DataTable.Cell>{user.email}</DataTable.Cell>
              <DataTable.Cell>{user.department}</DataTable.Cell>
              <DataTable.Cell>{user.manager}</DataTable.Cell>
              <DataTable.Cell>{user.projects}</DataTable.Cell>
              <DataTable.Cell>{user.approval}</DataTable.Cell>
              <DataTable.Cell>{user.avg_cost}</DataTable.Cell>
              <DataTable.Cell>{user.status}</DataTable.Cell>
              <DataTable.Cell>{user.permission}</DataTable.Cell>
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
                  <Menu.Item
                    onPress={() => console.log('Edit Permissions')}
                    title="Edit Permissions"
                  />
                  <Menu.Item
                    onPress={() => console.log('Activate/Deactivate')}
                    title="Activate/Deactivate"
                  />
                  <Menu.Item
                    onPress={() => console.log('Delete')}
                    title="Delete"
                  />
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
