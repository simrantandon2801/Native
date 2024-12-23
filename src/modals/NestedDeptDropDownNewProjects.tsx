import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {GetUserDept, GetUsers} from '../database/Users'; // Assuming this is a custom function to fetch data



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
  buisnessPersonId: any 
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
    path.unshift(
      `${currentDept.department_name}`,
    ); // Add to the start of the path
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
const NestedDeptDropdownNewProjects: React.FC<NestedDeptDropdownProps > = ({ onSelect, buisnessPersonId }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [hierarchy, setHierarchy] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [User, setUser] = useState<[]>([]);


  const mapUserIdToDeptName = (id: number) => {
    console.log(id);
    const ChosenUser = User.find(item => item.user_id === id);
    console.log(ChosenUser);
    return ChosenUser ? ChosenUser.department_name : ' ';
  };


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
  const fetchUser = async () => {
    try {
        const response = await GetUsers('');
        console.log('Raw Response:', response); 
        const result = JSON.parse(response);
        
        if (result?.status === 'success' && Array.isArray(result?.data?.users)) {
            setUser(result.data.users);
            console.log('Fetched Business Owners:', result.data.users);
        } else {
            console.error("Invalid users data structure");
        }
    } catch (error) {
        console.error('Error fetching Business Owners:', error);
    }
};

  useEffect(() => {
    handleDeptFetching();
    fetchUser()
  }, []); // Only run once when the component mounts


 

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
    <View>
      <View style={styles.inputWrapper}>
        <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              style={[styles.textInput, { cursor: 'pointer' }]}
              value={selectedDepartment}
              editable={false}
              placeholder={buisnessPersonId ?  mapUserIdToDeptName(buisnessPersonId): 'Select a department'}  // Change placeholder based on editGoal
            />
            <Icon name="chevron-down" size={20} />
          </View>
        </TouchableOpacity>

        {/* Conditionally render the dropdown based on visibility */}
        {dropdownVisible && (
          <DepartmentDropdown data={hierarchy} onSelect={handleSelect} />
        )}
      </View>
    </View>
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
});

export default NestedDeptDropdownNewProjects;