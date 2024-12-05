import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  CheckBox,
  Dimensions,
} from 'react-native';
import { IconButton, Menu, DataTable } from 'react-native-paper';

const { height } = Dimensions.get('window');

interface User {
  id: number;
  roleMaster: string;
  ViewModulesAssigned: string;
}

const ManageAss: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedModules, setSelectedModules] = useState<number[]>([]); // Store selected modules
  const [actionsVisible, setActionsvisible] = useState(false);
  const [allSelected, setAllSelected] = useState(false); // State to control "Select All" checkbox
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]); // State to track selected users

  const toggleMenu = () => setActionsvisible((prev) => !prev);

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

  const modules = ['Module 1', 'Module 2', 'Module 3', 'Module 4']; // Example modules

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
          <DataTable.Title style={styles.checkboxTitle}>
            <CheckBox
              value={allSelected}
              onValueChange={handleSelectAll}
            />
          </DataTable.Title>
          <DataTable.Title>S. No.</DataTable.Title>
          <DataTable.Title>Role Master Data</DataTable.Title>
          <DataTable.Title>View Modules Assigned</DataTable.Title>
          <DataTable.Title>Actions</DataTable.Title>
        </DataTable.Header>

        {/* Table Rows */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {users.map((user, index) => (
            <DataTable.Row style={styles.table} key={user.id}>
              <DataTable.Cell style={styles.checkboxCell}>
                <CheckBox
                  value={selectedUsers.includes(user.id)}
                  onValueChange={() => handleUserSelect(user.id)}
                />
              </DataTable.Cell>
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
  transparent={true} >
  <ScrollView contentContainerStyle={styles.modalScrollContainer}>
    <View style={styles.modalContainer}>
      {/* Header */}
      <Text style={styles.modalHeader}>View Modules - Project Manager</Text>

      {/* Role Master Data Dropdown */}
      <View style={styles.dropdownContainer}>
        <Text style={styles.dropdownLabel}>Select Role Master Data:</Text>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>-- Select --</Text>
        </TouchableOpacity>
      </View>

      {/* Expandable Integration Columns */}
      <View style={styles.expandableContainer}>
        <Text style={styles.expandableHeader}>Integration</Text>
        <TouchableOpacity>
          <View style={styles.checkboxRow}>
            <CheckBox value={false} />
            <Text>Top-Level Integration</Text>
          </View>
        </TouchableOpacity>

        {/* Example Hierarchy */}
        <View style={styles.subItems}>
          <TouchableOpacity>
            <View style={styles.checkboxRow}>
              <CheckBox value={false} />
              <Text>Sub-Integration 1</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.subSubItems}>
            <TouchableOpacity>
              <View style={styles.checkboxRow}>
                <CheckBox value={false} />
                <Text>Child-Integration 1.1</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.editButton} onPress={() => console.log('Edit')}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
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
});

export default ManageAss;
