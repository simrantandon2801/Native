import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {GetUserDept} from '../database/Users'; // Assuming this is a custom function to fetch data
import { Portal } from 'react-native-paper';

// TypeScript types
type Department = {
  department_id: number;
  department_name: string;
  parent_department_id: number | null;
  children?: Department[];
};

type DepartmentDropdownProps = {
  data: Department[];
  onSelect: (departmentID: number) => void; // Pass department ID instead of path
  level?: number;
  parentPath?: string;
};

type NestedDeptDropdownProps = {
  onSelect: (departmentID: number) => void;
};

// Function to build Heiarchy
const createHierarchy = (departments: Department[]): Department[] => {
  const departmentMap: {[key: number]: Department} = {};

  departments.forEach(dept => {
    departmentMap[dept.department_id] = {...dept, children: []};
  });

  const root: Department[] = [];

  departments.forEach(dept => {
    if (dept.parent_department_id === null) {
      root.push(departmentMap[dept.department_id]);
    } else {
      const parent = departmentMap[dept.parent_department_id];
      if (parent) {
        parent.children?.push(departmentMap[dept.department_id]);
      }
    }
  });

  return root;
};

// Helper function to build the hierarchy path (IT > Microsoft > vsCode)
const buildHierarchyPath = (
  departmentID: number,
  departments: Department[],
): string => {
  const path: string[] = [];
  let currentDept = departments.find(
    dept => dept.department_id === departmentID,
  );

  while (currentDept) {
    path.unshift(`${currentDept.department_name}`); // Add to the start of the path
    currentDept = departments.find(
      dept => dept.department_id === currentDept.parent_department_id,
    );
  }

  return path.join(' > '); // Join the parts of the path with " > "
};

// DepartmentDropdown Component
const DepartmentDropdown: React.FC<DepartmentDropdownProps> = ({
  data,
  onSelect,
  level = 0,
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
              style={{
                borderRadius: 5,
                padding: 10,
                fontSize: 16,
                backgroundColor: 'white',
                color: '#000',
                borderBottomColor: '#044086',
                width: '100%',
              }}
              onPress={() => {
                onSelect(dept.department_id); // Pass department ID
                setExpanded(!expanded);
              }}>
              <View style={{flexDirection: 'row'}}>
                {/* Add > Icon */}
                <Icon
                  name="chevron-forward-outline"
                  size={20}
                  color="#044086"
                />
                <Text style={styles.text}>{dept.department_name}</Text>
              </View>
            </TouchableOpacity>

            {/* Render Children */}
            {expanded && dept.children && dept.children.length > 0 && (
              <DepartmentDropdown
                data={dept.children}
                onSelect={onSelect}
                level={level + 1}
                parentPath={currentPath}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};

// Main Component
const NestedDeptDropdownGoals: React.FC<
  NestedDeptDropdownProps & {editGoal: any}
> = ({onSelect, editGoal}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [hierarchy, setHierarchy] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);

  const handleDeptFetching = async () => {
    try {
      const response = await GetUserDept(''); // Assuming this function fetches the department data
      const parsedRes = JSON.parse(response);

      if (parsedRes.status === 'success') {
        setDepartments(parsedRes.data.departments);
        const hierarchy = createHierarchy(parsedRes.data.departments);
        setHierarchy(hierarchy);
      } else {
        console.error(
          'Failed to fetch Departments',
          parsedRes.message || 'Unknown error',
        );
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  useEffect(() => {
    handleDeptFetching();
  }, []); // Only run once when the component mounts

  // Function to map department ID to name
  const mapDepartmentIdToName = (id: number) => {
    console.log('mapping');
    const department = departments.find(dept => dept.department_id === id);
    return department ? department.department_name : ' ';
  };

  const handleSelect = (departmentID: number) => {
    const selectedDept = departments.find(
      dept => dept.department_id === departmentID,
    );
    if (selectedDept) {
      const hierarchyPath = buildHierarchyPath(departmentID, departments);
      setSelectedDepartment(hierarchyPath); // Display the hierarchy in the format "ID - Name > ID - Name ..."
      onSelect(departmentID); // Notify parent with the selected department ID
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
              style={styles.textInput}
              value={selectedDepartment}
              editable={false}
              placeholder={
                editGoal
                  ? buildHierarchyPath(parseInt(editGoal.stakeholders), departments)
                  : 'Select a department'
              }
            />
            <Icon name="chevron-down" size={20} color="#000" />
          </View>
        </TouchableOpacity>

        {dropdownVisible && (
          <View style={styles.dropdownContainer}>
            <DepartmentDropdown data={hierarchy} onSelect={handleSelect} />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    flex: 1,
    alignItems: 'flex-start',
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
    minWidth: 'auto',
  },
  dropdownItem: {
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#000',
    borderBottomColor: '#044086',
    width: '100%',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  dropdownContainer: {
    position: 'absolute',
    bottom: '100%',  // Position dropdown above the input
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    zIndex: 1,  // Ensure it is on top of other components
    maxHeight: 250, // Optional: Limit the height of the dropdown
    overflow: 'auto', // Optional: Allow scrolling if content exceeds maxHeight
  },container: {
    flex: 1,
  }
});

export default NestedDeptDropdownGoals;
