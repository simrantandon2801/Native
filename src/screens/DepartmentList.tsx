import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert, Modal, Button, Dimensions, ScrollView } from 'react-native';
import { Menu, Provider } from 'react-native-paper';
import MenuItem from 'react-native-paper/lib/typescript/components/Menu/MenuItem';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Picker } from '@react-native-picker/picker';
import BinaryTree from './Tree/BinaryTree';


const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [newDepartmentDetails, setNewDepartmentDetails] = useState({});
  const [menuVisible, setMenuVisible] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [headingDepartment, setHeadingDepartment] = useState(null);
  const [expandedDepartments, setExpandedDepartments] = useState<{ [key: string]: boolean }>({});

  const [isMenuVisible, setIsMenuVisible] = useState(null);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newDepartment, setNewDepartment] = useState({
    department_id: null,
    customer_id: 1,
    parent_department_id: null,
    department_name: '',
    description: '',
    department_head: selectedUser ? selectedUser : null,
    department_level: 1,
    is_active: true,
  });
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          'https://underbuiltapi.aadhidigital.com/master/get_users',
        );
        const data = await response.json();
        if (data.status === 'success' && data.data && Array.isArray(data.data.users)) {
          setUsers(data.data.users);
        } else {
          console.error('Unexpected data format', data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserSelect = user => {
    setSelectedUser(user);
    setNewDepartment(prev => ({...prev, user_id: user.user_id}));
    setIsMenuVisible(false);
  };
  // Fetch active parent departments from the API
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const result = await GetUserDept('');
        const parsedResult = JSON.parse(result);
        // Filter active parent departments
        const activeParentDepartments = parsedResult.data.departments.filter(
          dept => dept.is_active === true && dept.parent_department_id === null,
        );
        // Update the state with filtered departments
        setDepartments(activeParentDepartments);
      } catch (error) {
        console.error('Error fetching departments:', error);
        Alert.alert('Error', 'Failed to fetch departments');
      }
    };
    fetchDepartments();
  }, []);
  const fetchDepartments = async () => {
    try {
      const response = await fetch('https://underbuiltapi.aadhidigital.com/master/get_department');
      const result = await response.json();
      const activeParentDepartments = result.data.departments.filter(
        (dept) => dept.is_active === true && dept.parent_department_id === null
      );
      setDepartments(activeParentDepartments);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch departments');
    }
  };
  const fetchSubDepartmentsHierarchy = async (parentId) => {
    try {
      const response = await fetch(
        'https://underbuiltapi.aadhidigital.com/master/get_department',
      );
      const result = await response.json();
      const departments = result.data.departments;

      // Recursive function to build hierarchy
      const buildHierarchy = parentId => {
        return departments
          .filter(
            dept => dept.parent_department_id === parentId && dept.is_active,
          )
          .map(dept => ({
            ...dept,
            children: buildHierarchy(dept.department_id),
          }));
      };

      const hierarchy = buildHierarchy(parentId);
      setSubDepartments(hierarchy);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch department hierarchy');
    }
  };
  // Fetch sub-departments based on parent department ID
  const fetchSubDepartments = async parentId => {
    try {
      const response = await fetch(
        'https://underbuiltapi.aadhidigital.com/master/get_department',
      );
      const result = await response.json();
      const subDepts = result.data.departments.filter(
        dept =>
          dept.is_active === true && dept.parent_department_id === parentId,
      );
      setSubDepartments(subDepts);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch sub-departments');
    }
  };
  const handleDelete = async departmentId => {
    try {
      const response = await fetch(
        'https://underbuiltapi.aadhidigital.com/master/delete_department',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({department_id: departmentId}),
        },
      );

    if (response.ok) {
      Alert.alert('Success', 'Department deleted successfully');
      setMenuVisible(null);
      fetchSubDepartments(null); 
      fetchDepartments();
      setShouldFetch(true);
    } else {
      Alert.alert('Error', 'Failed to delete department');
    }
  };
  const handleEdit = department => {
    setEditingDepartment(department);
    setNewDepartmentDetails({...department});
    setMenuVisible(null);
  };
  const [expanded, setExpanded] = useState({});
  const [shouldFetch, setShouldFetch] = useState(false);
  const handleUpdate = async () => {
    if (!newDepartmentDetails.department_name.trim()) {
      Alert.alert('Validation Error', 'Department name cannot be empty');
      return;
    }

    try {
      const response = await fetch(
        'https://underbuiltapi.aadhidigital.com/master/insert_department',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newDepartmentDetails),
        },
      );

      if (response.ok) {
        Alert.alert('Success', 'Department updated successfully');
        setEditingDepartment(null);
        setNewDepartmentDetails({});
        fetchSubDepartments(newDepartmentDetails.parent_department_id || null);
        fetchDepartments();
        
      } else {
        Alert.alert('Error', 'Failed to update department');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update department');
    }
  };

  const toggleMenuUser = () => {
    console.log('Menu toggled:', !isMenuVisible); // Debug log
    setIsMenuVisible(!isMenuVisible);
  };

  const toggleMenu = departmentId => {
    setIsMenuVisible(prev => (prev === departmentId ? null : departmentId));
  };
  const handleAddDepartment = async () => {
    console.log('Selected Department Head:', selectedUser);
    if (!newDepartment.department_name.trim()) {
      Alert.alert('Validation Error', 'Department name cannot be empty');
      return;
    }
    if (selectedUser) {
      console.log('Selected user for department head:', selectedUser);
      // Directly set the department_head field with selected user ID
      setNewDepartment(prev => ({
        ...prev,
        department_head: selectedUser, // Make sure to directly set the ID
      }));
    } else {
      Alert.alert('Validation Error', 'Please select a department head');
      return;
    }

    try {
      console.log('Department to be sent: ', newDepartment);
      const response = await fetch(
        'https://underbuiltapi.aadhidigital.com/master/insert_department',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newDepartment),
        },
      );

      if (response.ok) {
        Alert.alert('Success', 'New department added successfully');
        setIsModalVisible(false);
        setNewDepartment({
          department_id: null,
          customer_id: 1,
          parent_department_id: null,
          department_name: '',
          description: '',
          department_head: null,
          department_level: 1,
          is_active: true,
        });
        fetchSubDepartments(null);
        fetchDepartments();
        setShouldFetch(true);
       
      } else {
        Alert.alert('Error', 'Failed to add department');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add department');
    }
  };
  const [menuPosition, setMenuPosition] = useState({top: 0, left: 0});
  const handleMenuLayout = event => {
    const {x, y, width} = event.nativeEvent.layout;
    const screenWidth = Dimensions.get('window').width;

    const leftPosition = x - width / 2;
    setMenuPosition({top: y + 25, left: Math.max(0, leftPosition)});
  };
  const renderDropdown = department => {
    if (
      editingDepartment &&
      editingDepartment.department_id === department.department_id
    ) {
      return (
        <TouchableOpacity style={styles.actionContainer} onPress={handleUpdate}>
          <Ionicons name="save" size={20} color="#000" />
        </TouchableOpacity>
      );
    }

    return (
      <Menu
        visible={isMenuVisible === department.department_id}
        onDismiss={() => setIsMenuVisible(null)}
        anchor={
          <TouchableOpacity
            style={styles.actionContainer}
            onPress={() => toggleMenu(department.department_id)}>
            <Ionicons name="ellipsis-vertical" size={20} color="#000" />
          </TouchableOpacity>
        }>
        <Menu.Item title="Edit" onPress={() => handleEdit(department)} />
        <Menu.Item
          title="Delete"
          onPress={() => handleDelete(department.department_id)}
        />
        <Menu.Item
          title="Add Sub-Department"
          onPress={() => handleAddSubDepartment(department.department_id)}
        />
      </Menu>
    );
  };
  const handleAddSubDepartment = (parentId) => {
    setNewDepartment({ ...newDepartment, parent_department_id: parentId,department_head: selectedUser ? selectedUser: null });
    setIsModalVisible(true);
  };

  /*   const renderSubDepartments = (department, level = 0) => (
    <View key={department.department_id} style={{ marginLeft: level * 20 }}>
      <View style={styles.row}>
        <Text style={styles.cell}>{department.department_name}</Text>
        <TouchableOpacity
          style={styles.actionContainer}
          onPress={() => toggleMenu(department.department_id)}
        >
          <Icon name="more-vert" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {menuVisible === department.department_id && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity onPress={() => handleAddSubDepartment(department.department_id)}>
            <Text>Create Sub-Department</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert('Feature', 'Delete Department feature coming soon!')}>
            <Text>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert('Feature', 'Add Submodule feature coming soon!')}>
            <Text>Add Submodule</Text>
          </TouchableOpacity>
        </View>
      )}

      {expanded[department.department_id] &&
        department.children?.map((child) => renderSubDepartments(child, level + 1))}

      {department.children?.length > 0 && (
        <TouchableOpacity onPress={() => toggleExpand(department.department_id)}>
          <Text style={styles.expandToggle}>
            {expanded[department.department_id] ? 'Collapse' : 'Expand'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  ); */
  const toggleExpand = (departmentId: string) => {
    setExpandedDepartments((prev) => ({
      ...prev,
      [departmentId]: !prev[departmentId], 
    }));
  };

  const renderSubDepartments = (department, level = 0) => {
    const isExpanded = expandedDepartments[department.department_id];
    const renderHierarchyLines = (level, isChild = false) => {
      if (level === 0) return null; // No line for the root level
  
      const verticalLineHeight = 20;
      const horizontalLineHeight = 1;
      const horizontalLineWidth = 50;
      return (
        <View
          style={{
            position: 'absolute',
          top: isChild ? verticalLineHeight : 0, // For child, position the line horizontally
          left: -2, // Position to connect the line to the department (on the left side)
          height: isChild ? horizontalLineHeight : '100%', // Horizontal line height for child, vertical for parent
          width: isChild ? horizontalLineWidth : 2, // Horizontal line width for child, vertical for parent
          backgroundColor: '#000', // Line color
          zIndex: -1, // Ensure the line is behind the department content
          }}
        />
      );
    };
    return (
      <View key={department.department_id} style={{ position: 'relative' }}>
         {renderHierarchyLines(level, false)}
        <View
          style={{
            marginLeft: level * 50, // Indent based on hierarchy level
            flexDirection: 'row', // Align elements in a row
            alignItems: 'center',
            marginVertical: 5, // Spacing between items
            position: 'relative', // To allow lines to be placed behind it
            zIndex: 1, // Ensure it's above the lines
          }}
        >
          {editingDepartment && editingDepartment.department_id === department.department_id ? (
            <>
              <TextInput
                style={styles.editInput}
                value={newDepartmentDetails.department_name}
                onChangeText={text =>
                  setNewDepartmentDetails(prev => ({
                    ...prev,
                    department_name: text,
                  }))
                }
              />
              <Picker
              selectedValue={newDepartmentDetails.department_head}
              onValueChange={(itemValue) => {
                setNewDepartmentDetails((prev) => ({ ...prev, department_head: itemValue }));
              }}
              style={styles.picker}
            >
              <Picker.Item label="Select a user" value="" />
              {users.map((user) => (
                <Picker.Item
                  key={user.user_id}
                  label={`${user.first_name} ${user.last_name}`}
                  value={user.user_id}
                />
              ))}
            </Picker>
              <TouchableOpacity style={styles.actionContainer} onPress={handleUpdate}>
                <Ionicons name="save" size={20} color="#000" />
              </TouchableOpacity>
            </>
          ) : (
            <>
            {/* Expand/Collapse Arrow */}
            {department.children?.length > 0 && (
              <TouchableOpacity onPress={() => toggleExpand(department.department_id)}>
                <Ionicons
                  name={isExpanded ? 'chevron-down' : 'chevron-forward'}
                  size={20}
                  color="#000"
                  style={{ marginRight: 10 }}
                />
              </TouchableOpacity>
            )}

            {/* Department Name */}
            <Text style={[styles.cell, { fontWeight: 'bold', flex: 1 }]}>{department.department_name}</Text>

            {/* Department Head (If Not Editable) */}
            <Text style={[styles.cell, { flex: 1, textAlign: 'right' }]}>
              {department.department_head
                ? `${users.find((user) => user.user_id === department.department_head)?.first_name} ${users.find((user) => user.user_id === department.department_head)?.last_name}`
                : 'Not Assigned'}
            </Text>

            {/* Action Menu */}
            <TouchableOpacity style={styles.actionContainer} onPress={() => toggleMenu(department.department_id)}>
              {renderDropdown(department)}
            </TouchableOpacity>
            
          </>
        )}

      </View>

      {/* Recursively render children if expanded */}
      {isExpanded && department.children?.length > 0 && (
        <View style={{ marginLeft: 20, position: 'relative' }}>
          {department.children.map((child) => (
            <View key={child.department_id} style={{ position: 'relative', marginLeft: 20 }}>
              {/* Render line connecting child to the parent */}
              {renderHierarchyLines(level + 1, true)} {/* Horizontal line for child */}
              
              {/* Render the child department */}
              {renderSubDepartments(child, level + 1)}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const renderTree = (department, level = 0, users) => {
  // Function to render hierarchy lines
  const renderHierarchyLines = (level, isChild = false) => {
    if (level === 0) return null; // No line for the root level

    const verticalLineHeight = 20;
    const horizontalLineHeight = 1;
    const horizontalLineWidth = 50;
    return (
      <View
        style={{
          position: 'absolute',
          top: isChild ? verticalLineHeight : 0, // For child, position the line horizontally
          left: -2, // Position to connect the line to the department (on the left side)
          height: isChild ? horizontalLineHeight : '100%', // Horizontal line height for child, vertical for parent
          width: isChild ? horizontalLineWidth : 2, // Horizontal line width for child, vertical for parent
          backgroundColor: '#000', // Line color
          zIndex: -1, // Ensure the line is behind the department content
        }}
      />
    );
  };

  return (
    <View key={department.department_id} style={{ position: 'relative' }}>
      {/* Render hierarchy lines */}
      {renderHierarchyLines(level, false)}

      {/* Department Box */}
      <View
        style={{
          marginLeft: level * 50, // Indent based on hierarchy level
          flexDirection: 'column', // Column layout to stack the content inside the box
          alignItems: 'center',
          position: 'relative', // To allow lines to be placed behind it
          zIndex: 1, // Ensure it's above the lines
        }}
      >
        <View style={styles.departmentBox}>
          {/* Department Name */}
          <Text style={[styles.cell, { fontWeight: 'bold' }]}>{department.department_name}</Text>

          {/* Department Head */}
          <Text style={[styles.cell]}>
            {department.department_head
              ? `${users.find((user) => user.user_id === department.department_head)?.first_name} ${users.find((user) => user.user_id === department.department_head)?.last_name}`
              : 'Not Assigned'}
          </Text>
        </View>
      </View>

      {/* Recursively render children */}
      {department.children && department.children.length > 0 && (
        <View style={{ marginLeft: 20, position: 'relative' }}>
          {department.children.map((child) => (
            <View key={child.department_id} style={{ position: 'relative', marginLeft: 20 }}>
              {/* Render line connecting child to the parent */}
              {renderHierarchyLines(level + 1, true)} {/* Horizontal line for child */}

              {/* Render the child department */}
              {renderTree(child, level + 1, users)}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
  return (
    <Provider>
    <View style={styles.container}>
      {/* Left Table */}
      <View style={styles.leftPanel}>
        <Text style={styles.header}>Departments</Text>
        <View style={[styles.row, styles.headingRow]}>
      <Text style={styles.cell}>S.No</Text>
      <Text style={styles.cell}>Name</Text>
      <Text style={styles.cell}>Unit Head</Text>
      <Text style={styles.cell}>Action</Text>
    </View>
    <FlatList
  data={departments}
  keyExtractor={(item) => item.department_id.toString()}
  renderItem={({ item, index }) => {
    const isExpanded = headingDepartment && headingDepartment.department_id === item.department_id;
    return (
      <>
        <TouchableOpacity
          style={styles.row}
          onPress={() => {
            setHeadingDepartment(item); 
            fetchSubDepartmentsHierarchy(item.department_id); // Fetch its hierarchy
          }}
        >
          <Text style={styles.cell}>{index + 1}</Text>

          {editingDepartment && editingDepartment.department_id === item.department_id ? (
            <TextInput
              style={styles.editInput}
              value={newDepartmentDetails.department_name}
              onChangeText={(text) =>
                setNewDepartmentDetails((prev) => ({ ...prev, department_name: text }))
              }
            />
          ) : (
            <Text style={styles.cell}>{item.department_name}</Text>
          )}

          {editingDepartment && editingDepartment.department_id === item.department_id ? (
            <Picker
              selectedValue={newDepartmentDetails.department_head}
              onValueChange={(itemValue) => {
                setNewDepartmentDetails((prev) => ({ ...prev, department_head: itemValue }));
              }}
              style={styles.picker}
            >
              <Picker.Item label="Select a user" value="" />
              {users.map((user) => (
                <Picker.Item
                  key={user.user_id}
                  label={`${user.first_name} ${user.last_name}`}
                  value={user.user_id}
                />
              ))}
            </Picker>
          ) : (
            <Text style={styles.cell}>
              {users.find((user) => user.user_id === item.department_head)?.first_name || 'Not Assigned'}
            </Text>
          )}

          <TouchableOpacity style={styles.actionContainer} onPress={() => toggleMenu(item.department_id)}>
            {renderDropdown(item)}
          </TouchableOpacity>
        </TouchableOpacity>

        {isExpanded && subDepartments && subDepartments.length > 0 && (
            <View style={styles.subDepartmentsContainer}>
              <Text style={styles.subDeptHeader}>Sub-Departments</Text>
              {subDepartments.map((subDept, subIndex) => (
                <View key={subDept.department_id} style={styles.row}>
                  <Text style={styles.cell}>{subIndex + 1}</Text>
                  <Text style={styles.cell}>{subDept.department_name}</Text>
                  <Text style={styles.cell}>
                    {users.find((user) => user.user_id === subDept.department_head)?.first_name || 'Not Assigned'}
                  </Text>
                  <TouchableOpacity style={styles.actionContainer}>
                    {renderDropdown(subDept)}
                  </TouchableOpacity>
          </View>
        ))}
        </View>
        )}
      </>
    );
  }}
/>

        <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
          <Text style={styles.addText}>+ Add New Department</Text>
        </TouchableOpacity>
      </View>

      {/* Right Panel */}
      <View style={styles.rightPanel}>
      <ScrollView contentContainerStyle={styles.scrollViewContent} horizontal={true}>
      <BinaryTree shouldFetch={shouldFetch} setShouldFetch={setShouldFetch} />
      </ScrollView>
      {/* Heading */}
    {/*   {headingDepartment && (
        <Text style={styles.header}>{headingDepartment.department_name}</Text>
      )} */}

      {/* Table-like Header */}
      {/* <View style={[styles.row, styles.header]}>
        <Text style={[styles.cell, { flex: 1 }]}>Name</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', flex: 1 }}>
          <Text style={[styles.cell, { textAlign: 'right', paddingLeft: 250 }]}>Unit Head</Text>
          <Text style={[styles.cell, { textAlign: 'right' }]}>Action</Text>
        </View>
      </View> */}

      {/* Department Tree */}
      {/* {subDepartments.map((department) => renderTree(department, 0, users))} */}
       {/*  <FlatList
          data={subDepartments}
          keyExtractor={(item) => item.department_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.row}>
              {editingDepartment && editingDepartment.department_id === item.department_id ? (
                <TextInput
                  style={styles.editInput}
                  value={newDepartmentDetails.department_name}
                  onChangeText={(text) =>
                    setNewDepartmentDetails((prev) => ({ ...prev, department_name: text }))
                  }
                />
              ) : (
                <Text style={styles.cell}>{item.department_name}</Text>
              )}
              <TouchableOpacity style={styles.actionContainer} onPress={() => toggleMenu(item.department_id)}>
                {menuVisible === item.department_id ? (
                  editingDepartment && editingDepartment.department_id === item.department_id ? (
                    <TouchableOpacity onPress={handleUpdate}>
                      <Ionicons name="save" size={20} color="#000" />
                    </TouchableOpacity>
                  ) : (
                    renderDropdown(item)
                  )
                ) : (
                  <Ionicons name="more-vert" size={20} color="#000" />
                )}
              </TouchableOpacity>
            </View>
          )}
        /> */}
        </View>

        {/* Add Department Modal */}
        <Modal visible={isModalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Add New Department</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Department Name"
                value={newDepartment.department_name}
                onChangeText={text =>
                  setNewDepartment(prev => ({...prev, department_name: text}))
                }
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Description"
                value={newDepartment.description}
                onChangeText={text =>
                  setNewDepartment(prev => ({...prev, description: text}))
                }
              />
              {users.length > 0 ? (
                <Picker
                  selectedValue={
                    selectedUser?.user_id ? String(selectedUser.user_id) : ''
                  }
                  onValueChange={itemValue => {
                    console.log('Selected Value: ', itemValue);
                    const user = users.find(
                      user => user.user_id === Number(itemValue),
                    );
                    if (user) {
                      setSelectedUser(user);
                    } else {
                      console.log('User not found');
                    }
                  }}
                  style={styles.picker}>
                  <Picker.Item label="Select a user" value="" />
                  {users.map(user => (
                    <Picker.Item
                      key={user.user_id}
                      label={user.first_name} // Show first_name instead of username
                      value={String(user.user_id)} // Ensure the value is a string
                    />
                  ))}
                </Picker>
              ) : (
                <Text>Loading users...</Text>
              )}

              {selectedUser && (
                <Text style={styles.selectedUserText}>
                  Selected Department Head: {selectedUser.first_name}{' '}
                  {selectedUser.last_name}
                </Text>
              )}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddDepartment}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#f0f0f0',
  },
  leftPanel: {
    flex: 1,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderColor: '#ddd',
    padding: 10,
  },
  rightPanel: {
    flex: 2,
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginLeft: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  departmentBox: {
    width: 200,
    padding: 10,
    backgroundColor: '#e3e3e3',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  cell: {
    flex: 1,
    fontSize: 14,
  },
  actionContainer: {
    padding: 5,
  },
  selectedUserText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 30,
    right: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    zIndex: 10,
  },
  addButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007bff',
    alignItems: 'center',
    borderRadius: 5,
  },
  addText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  editInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#007bff',
    paddingVertical: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  scrollViewContent: {
    alignItems: 'center', 
    paddingBottom: 20, 
    overflow: 'hidden',
    justifyContent:'center'
  },
});

export default DepartmentList;
