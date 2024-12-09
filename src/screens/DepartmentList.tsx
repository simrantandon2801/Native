/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  DataTable,
  Text,
  Button,
  Appbar,
  IconButton,
  TextInput,
} from 'react-native-paper';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import { GetDepartments } from '../database/Departments';
import {useIsFocused} from '@react-navigation/native';
import Tree from './Tree';

// Recursive Component
const ExpandableRow = ({
  sno,
  item,
  level,
  isTopLevel,
  onEdit,
}: {
  sno: any;
  item: any;
  level: number;
  isTopLevel: boolean;
  onEdit: (item: any) => void; // Callback to handle edit
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(true);
  const toggleExpand = () => setIsExpanded(!isExpanded);
  //   const handleEdit = () => {
  //     console.log(`Edit row: ${item.name}`);
  //     // Add your edit logic here
  //   };

  const handleDelete = () => {
    console.log(`Delete row: ${item.name}`);
    // Add your delete logic here
  };
  return (
    <View>
      {/* Main Row */}
      <DataTable.Row onPress={toggleExpand} style={styles.row}>
        <DataTable.Cell style={[styles.cell, {paddingLeft: level * 10}]}>
          {sno}
        </DataTable.Cell>
        <DataTable.Cell>{item.name || '-'}</DataTable.Cell>
        <DataTable.Cell>
          {isHovered && isTopLevel && (
            <View style={styles.actions}>
              <IconButton
                icon="pencil" // Edit icon
                size={20}
                onPress={() => onEdit(item)}
              />
              <IconButton
                icon="delete" // Delete icon
                size={20}
                onPress={handleDelete}
              />
            </View>
          )}
        </DataTable.Cell>
      </DataTable.Row>

      {/* Expanded Content */}
      {isExpanded && item.children && (
        <View style={styles.expandedContent}>
          {item.children.map((child: any, index: any) => (
            <ExpandableRow
              sno={index + 1}
              key={child.key}
              item={child}
              level={level + 1}
              isTopLevel={false}
              onEdit={onEdit}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const DepartmentList = () => {
  const [editingItem, setEditingItem] = React.useState<any>(null);
  const [departmentName, setDepartmentName] = React.useState<string>('');
  const [departmentId, setDepartmentId] = React.useState<string>('');
  const isFocused = useIsFocused();
  const handleEdit = (item: any) => {
    setEditingItem(item); // Set the item being edited
    setDepartmentName(item.name);
    setDepartmentId(item.department_id);
  };
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
    console.log(isCollapsed ? 'Expand All' : 'Collapse All');
  };
  const handleSave = () => {
    console.log('Save data for:', editingItem);
    // Implement save logic here (e.g., updating the data array)
    setEditingItem(null); // Close the editing view
  };
  const [data, setData] = useState<any[]>([]); // Initialize state as empty array
  //   const [data] = React.useState([
  //     {
  //       key: 1,
  //       name: 'Cupcake',
  //       calories: 356,
  //       fat: 16,
  //       children: [
  //         {
  //           key: 11,
  //           name: 'Cupcake - Ingredients',
  //           children: [
  //             {key: 111, name: 'Flour', calories: 100, fat: 2},
  //             {key: 112, name: 'Sugar', calories: 200, fat: 0},
  //           ],
  //         },
  //         {
  //           key: 12,
  //           name: 'Cupcake - History',
  //           children: [
  //             {key: 121, name: 'Origin', calories: 50, fat: 0},
  //             {key: 122, name: 'Popularity', calories: 60, fat: 1},
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       key: 2,
  //       name: 'Eclair',
  //       calories: 262,
  //       fat: 16,
  //       children: [
  //         {
  //           key: 21,
  //           name: 'Eclair - Ingredients',
  //           children: [
  //             {key: 211, name: 'Chocolate', calories: 150, fat: 8},
  //             {key: 212, name: 'Cream', calories: 100, fat: 10},
  //           ],
  //         },
  //       ],
  //     },
  //   ]);
  const fetchDepartments = async (parent_id: string) => {
    const departmentData = await GetDepartments(parent_id); // Assuming GetZoneData fetches the zone information
    const departments = JSON.parse(departmentData);

    const newData = departments?.data?.departments?.map((element: any) => ({
      key: element.department_id ?? '',
      name: element.department_name ?? '',
      parent_department_id: element.parent_department_id ?? '',
      description: element.description ?? '',
    }));

    setData(newData || []); // Properly set the new data
  };
  const fetchDepartmentJSONChilds = async (parent_id: string) => {
    const departmentData = await GetDepartments(parent_id); // Assuming GetZoneData fetches the zone information
    const departments = JSON.parse(departmentData);

    const newData = departments?.data?.departments?.map((element: any) => ({
      key: element.department_id ?? '',
      name: element.department_name ?? '',
      parent_department_id: element.parent_department_id ?? '',
      description: element.description ?? '',
    }));

    setData(newData || []); // Properly set the new data
  };
  useEffect(() => {
    console.log('1');
    fetchDepartments('0');
  }, []);
  useEffect(() => {
    console.log('1');
    fetchDepartmentJSONChilds('0');
  }, [departmentId]);
  // useEffect(() => {
  //   if (isFocused) {
  //     (async function () {
  //       await fetchDepartments('0');
  //     })();
  //     return () => {};
  //   }
  // }, [isFocused]);
  // React.useEffect(() => {
  //   if (isFocused) {
  //     (async function () {
  //       await fetchDepartments('0');
  //     })();
  //     return () => {};
  //   }
  // }, [isFocused]);
  return (
    <View>
      <Appbar.Header>
        <View style={styles.homeIconContainer}>
          <IconButton
            icon="home" // Home icon
            onPress={() => {}} // Define your home navigation logic here
            size={24}
          />
        </View>
        <Appbar.Content
          title="Manage Departments"
          titleStyle={{fontWeight: 'bold'}}
        />
        <Appbar.Action
          icon="refresh" // Refresh icon
          onPress={() => {}}
        />
      </Appbar.Header>
      <View style={styles.container}>
        <View style={styles.column}>
          <View style={styles.toolbar}>
            <Button
              icon="plus"
              mode="contained"
              onPress={() => console.log('Pressed')}>
              Add New Department
            </Button>
          </View>
          <DataTable>
            <DataTable.Header style={styles.header}>
              <DataTable.Title>
                <Text variant="labelLarge"> S No.</Text>
              </DataTable.Title>
              <DataTable.Title>
                <Text variant="labelLarge"> Department</Text>
              </DataTable.Title>
              <DataTable.Title>
                <Text variant="labelLarge"> Actions</Text>
              </DataTable.Title>
            </DataTable.Header>

            {data.map((item: any, index: any) => (
              <ExpandableRow
                sno={index + 1}
                key={item.key}
                item={item}
                level={0}
                isTopLevel={true}
                onEdit={handleEdit}
              />
            ))}
          </DataTable>
        </View>
        <View style={styles.column}>
          {/* Column 2: Show editable data table if an item is being edited */}
          <View style={styles.container}>
            <View style={styles.column}>
              <Button
                icon="delete"
                mode="text"
                onPress={() => console.log('Pressed')}>
                Delete Department
              </Button>
            </View>
            <View style={styles.column}>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Button
                  icon="content-save"
                  mode="contained"
                  onPress={() => console.log('Pressed')}>
                  Apply Changes
                </Button>
                <Button
                  icon="cancel"
                  mode="text"
                  onPress={() => console.log('Pressed')}>
                  Discard Changes
                </Button>
              </View>
            </View>
          </View>
          {editingItem && (
            <View style={styles.column}>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                {/* <Text style={{fontWeight: 'bold', fontSize: 16}}>
                  Department Name :{' '}
                </Text> */}
                <TextInput
                  label="Department Name"
                  value={departmentName}
                  onChangeText={text => setDepartmentName(text)}
                  style={{
                    minWidth: '100%',
                    backgroundColor: 'white',
                    color: 'black',
                    borderWidth: 1,

                    shadowColor: 'black',
                  }}
                />
              </View>
              <View
                style={{
                  padding: 15,
                  //borderColor: 'blue',
                  // borderWidth: 1,
                  // backgroundColor: '#f5f5f5',
                  borderRadius: 8,
                  //margin: 10,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={styles.buttonContainer}>
                  <Text variant="titleSmall" style={{alignSelf: 'center'}}>
                    Department Sub Levels
                  </Text>
                </View>

                <View style={styles.buttonContainer}>
                  {/* Icon */}
                  <IconButton
                    icon={isCollapsed ? 'chevron-down' : 'chevron-up'} // Icon based on state
                    size={24}
                    onPress={handleToggle}
                  />
                  {/* Text */}
                  <TouchableOpacity
                    onPress={handleToggle}
                    style={{alignSelf: 'center'}}>
                    <Text style={styles.buttonTextCl}>
                      {isCollapsed ? 'Expand All' : 'Collapse All'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.treeContainer}>
                <Tree
                  department_id={departmentId}
                  department_name={departmentName}
                />
              </View>

              {/* <Text>Edit {editingItem.name}</Text>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Name</DataTable.Title>
                  <DataTable.Title>Calories</DataTable.Title>
                  <DataTable.Title>Fat</DataTable.Title>
                </DataTable.Header>
                <DataTable.Row>
                  <DataTable.Cell>
                    <Text>{editingItem.name}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Text>{editingItem.calories}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Text>{editingItem.fat}</Text>
                  </DataTable.Cell>
                </DataTable.Row>
              </DataTable>
              <Button onPress={handleSave}>Save</Button> */}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Arrange children in a row
    justifyContent: 'space-between', // Space between columns
    padding: 16, // Optional: padding for the container
  },
  buttonContainer: {
    flexDirection: 'row', // Align icon and text horizontally
    //alignItems: 'center', // Vertically center items
    //padding: 8, // Add some padding for better touch handling
  },
  treeContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderStyle: 'solid',
    backgroundColor: '#fff', // Optional background color
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Adds a subtle 3D shadow
    transform: 'translateZ(0)', // Forces GPU rendering for smoother effects
    padding: 10, // Optional padding inside the container
    borderRadius: 8, // Optional rounded corners
    marginBottom: 25,
  },
  buttonText: {
    fontSize: 16,
    marginLeft: 8, // Space between icon and text
    color: '#007BFF', // Blue color for clickable text
    fontWeight: '500',
  },
  buttonIcon: {
    color: '#007BFF', // Match text color
  },
  homeIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto', // Align to the right
    marginRight: 16, // Add some margin on the right
  },
  column: {
    flex: 1, // Columns take equal space
    marginHorizontal: 8, // Add spacing between columns
    //padding: 16, // Padding inside each column
    backgroundColor: 'white', // Optional: background color
    borderRadius: 8, // Optional: rounded corners
  },

  row: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    flex: 1,
  },
  expandedContent: {
    paddingLeft: 10,
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: '#93b3e6', // Light gray background for the header
    borderBottomWidth: 1, // Border below the header
    borderBottomColor: 'black', // Light gray border color
  },
  headerCell: {
    fontWeight: 'bold', // Bold text
    textAlign: 'center', // Center alignment for cells
    fontSize: 18,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16, // Adds spacing below the toolbar
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  buttonTextCl: {
    // color: '#fff',
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default DepartmentList;