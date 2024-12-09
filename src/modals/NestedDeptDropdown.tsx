import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

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
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedPath, setSelectedPath] = useState("");

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
      <Text style={styles.label}>* Department</Text>

      <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
        <TextInput
          style={styles.textInput}
          value={selectedPath}
          editable={false} // Non-editable for dropdown behavior
          placeholder="Select a department"
        />
        <TouchableOpacity
          onPress={() => setDropdownVisible(!dropdownVisible)} // Toggle dropdown visibility
        >
          <Icon name="chevron-down" size={20} />
        </TouchableOpacity>
      </View>

      {/* Conditionally render the dropdown based on state */}
      {dropdownVisible && (
        <DepartmentDropdown data={hierarchy} onSelect={handleSelect} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  textInput: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#f8f9fa",
    fontSize: 16,
  },
  dropdownItem: {
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 5,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
});

export default App;