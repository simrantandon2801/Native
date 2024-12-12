import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { GetUserDept } from '../database/RestData';

// Define TypeScript types
type Department = {
  department_id: number;
  customer_id: number;
  parent_department_id: number | null;
  department_name: string;
  description: string | null;
  department_head: number | null;
  department_level: number | null;
  created_at: string;
  updated_at: string;
  created_by: number | null;
  updated_by: number | null;
  is_active: boolean;
  children?: Department[];
};

type DepartmentDropdownProps = {
  data: Department[];
  level?: number;
  onSelect: (departmentPath: string) => void;
  parentPath?: string;
};

// Helper Function to Create Hierarchy
const createHierarchy = (departments: Department[]): Department[] => {
  const departmentMap: {[key: number]: Department} = {};

  // Map departments by ID for easy lookup
  departments.forEach(dept => {
    departmentMap[dept.department_id] = {...dept, children: []};
  });

  const root: Department[] = [];

  // Build hierarchy
  departments.forEach(dept => {
    if (dept.parent_department_id === null) {
      root.push(departmentMap[dept.department_id]);
    } else {
      const parent = departmentMap[dept.parent_department_id];
      if (parent) {
        parent.children!.push(departmentMap[dept.department_id]);
      }
    }
  });

  return root;
};

// Recursive Dropdown Component
const DepartmentDropdown: React.FC<DepartmentDropdownProps> = ({
  data,
  level = 0,
  onSelect,
  parentPath = '',
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={{marginLeft: level * 15}}>
      {data.map(dept => {
        const currentPath = parentPath
          ? `${parentPath} > ${dept.department_name}`
          : dept.department_name;

        return (
          <View key={dept.department_id}>
            {/* Department Item */}
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                onSelect(currentPath);
                setExpanded(!expanded);
              }}>
              <Text style={styles.text}>{dept.department_name}</Text>
            </TouchableOpacity>

            {/* Render Children */}
            {expanded && dept.children && dept.children.length > 0 && (
              <DepartmentDropdown
                data={dept.children}
                level={level + 1}
                onSelect={onSelect}
                parentPath={currentPath}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};

// Main App Component
const App: React.FC = () => {
  const [departments, setDepartments] = useState([]);
  const [hierarchy, setHierarchy] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedPath, setSelectedPath] = useState('');



  const handleDeptFetching = async () =>{
    try {
      const response = await GetUserDept('');
      const parsedRes = JSON.parse(response);
      if (parsedRes.status === 'success') {
        console.log("Dept Fetched Succesfully", parsedRes);
        //setDepartments(apiResponse.data.departments);  
        setDepartments(parsedRes.data.departments);
      } else {
        console.error(
          'Failed to fetch Departments',
          parsedRes.message || 'Unknown error',
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // Simulate API Call
    const apiResponse = {
      status: 'success',
      data: {
        departments: [
          {
            department_id: 6,
            customer_id: 1,
            parent_department_id: null,
            department_name: 'IT',
            description: null,
            department_head: 3,
            department_level: null,
            created_at: '2024-12-05T10:30:25.245Z',
            updated_at: '2024-12-05T10:30:25.245Z',
            created_by: null,
            updated_by: null,
            is_active: true,
          },
          {
            department_id: 7,
            customer_id: 1,
            parent_department_id: 6,
            department_name: 'Microsoft',
            description: null,
            department_head: 4,
            department_level: null,
            created_at: '2024-12-05T10:30:25.245Z',
            updated_at: '2024-12-05T10:30:25.245Z',
            created_by: null,
            updated_by: null,
            is_active: true,
          },
          {
            department_id: 8,
            customer_id: 1,
            parent_department_id: 6,
            department_name: 'Oracle',
            description: null,
            department_head: 5,
            department_level: null,
            created_at: '2024-12-05T10:30:25.245Z',
            updated_at: '2024-12-05T10:30:25.245Z',
            created_by: null,
            updated_by: null,
            is_active: true,
          },
          {
            department_id: 9,
            customer_id: 1,
            parent_department_id: null,
            department_name: 'Infra',
            description: null,
            department_head: 6,
            department_level: null,
            created_at: '2024-12-05T10:30:25.245Z',
            updated_at: '2024-12-05T10:30:25.245Z',
            created_by: null,
            updated_by: null,
            is_active: true,
          },
        ],
      },
    };

    const hierarchy = createHierarchy(apiResponse.data.departments);
    setDepartments(apiResponse.data.departments);
    setHierarchy(hierarchy);
  }, []);

  const handleSelect = (departmentPath: string) => {
    setSelectedPath(departmentPath);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>* Department</Text>

        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => setDropdownVisible(!dropdownVisible)} // Toggle dropdown visibility
          >
            <View style={{flexDirection: 'row', width: 550}}>
              <TextInput
                style={[styles.textInput, {cursor: 'pointer'}]} // Correct way to combine styles
                value={selectedPath}
                editable={false} // Non-editable for dropdown behavior
                placeholder="Select a department"
              />

              <Icon name="chevron-down" size={20} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Conditionally render the dropdown based on state */}
        {dropdownVisible && (
          <DepartmentDropdown data={hierarchy} onSelect={handleSelect} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    marginBottom: 5,
  },
  textInput: {
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

  dropdownItem: {
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#000',

    borderBottomColor: '#044086',
    borderWidth: 0,
    outlineStyle: 'none',
    width: '100%', // Ensures input takes up the full width of the container
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});

export default App;
