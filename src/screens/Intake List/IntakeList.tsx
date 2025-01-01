import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  Checkbox,
  Menu,
  Provider as PaperProvider,
  IconButton,
  Button,
  DataTable,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Picker} from '@react-native-picker/picker';
import {AppImages} from '../../assets';
import {DeleteGoal, GetGoals, InsertGoal} from '../../database/Goals';
import NestedDeptDropdown from '../../modals/NestedDeptDropdown';
import NestedDeptDropdownGoals from '../../modals/NestedDropdownGoals';
import {GetDept, GetUsers} from '../../database/Departments';
import {GetProjects, GetProjectsWithFilters} from '../../database/Intake';
import {ScrollView} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {navigate} from '../../navigations/RootNavigation';
// import {useNavigation} from '@react-navigation/native';
// import ProjectIntakeDetails from './ProjectIntakeDetails';
import { useFocusEffect } from '@react-navigation/native';
interface CreateNewIntakeModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (newGoal: any) => void;
  editGoal?: any;
}

const CreateNewIntakeModal: React.FC<CreateNewIntakeModalProps> = ({
  visible,
  onClose,
  onSubmit,
  editGoal,
}) => {
  const navigation = useNavigation();
  const [selectedStakeholder, setSelectedStakeholder] = useState<number>(-1);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedGoalOwner, setSelectedGoalOwner] = useState<number>(-1);
  const [goalName, setGoalName] = useState('');
  const [description, setDescription] = useState('');
  const [goalId, setGoalId] = useState<string | undefined>(undefined);

  useEffect(() => {
    console.log('Edit Goal:', editGoal);
    if (editGoal) {
      setGoalId(editGoal.goal_id);
      setGoalName(editGoal.goal_name || '');
      setDescription(editGoal.description || '');
      setSelectedStakeholder(editGoal.stakeholders);
      setSelectedYear(editGoal.target_year || '');
      setSelectedStatus(editGoal.status || '');
      setSelectedGoalOwner(editGoal.goal_owner);
    } else {
      setGoalId(undefined);
      setGoalName('');
      setDescription('');
      setSelectedStakeholder(-1);
      setSelectedYear('');
      setSelectedStatus('');
      setSelectedGoalOwner(-1);
    }
  }, [editGoal]);

  const handleSubmit = async () => {
    if (
      goalName &&
      selectedStatus &&
      selectedGoalOwner &&
      description &&
      selectedStakeholder &&
      selectedYear
    ) {
      const newGoal = {
        goal_id: goalId,
        goal_name: goalName,
        description: description,
        stakeholders: selectedStakeholder,
        goal_owner: selectedGoalOwner,
        target_year: selectedYear,
        start_date: new Date().toISOString(),
        end_date: new Date().toISOString(),
        status: selectedStatus,
      };
      console.log(newGoal);
      try {
        const response = await InsertGoal(newGoal);
        const parsedResponse = JSON.parse(response);

        if (parsedResponse.status === 'success') {
          Alert.alert('Goal created successfully');
          onSubmit(newGoal);
          onClose();
        } else {
          Alert.alert('Failed to create goal. Please try again.');
          onClose();
        }
      } catch (error) {
        console.error('Error creating goal:', error);
        Alert.alert('An error occurred. Please try again.');
      }
    } else {
      Alert.alert('Please fill in all required fields.');
    }
  };

  const handleDeptSelect = (deptID: number) => {
    setSelectedGoalOwner(deptID);
    console.log(`Selected GoalOwner: ${deptID}`);
  };

  const handleStakeSelect = (deptID: number) => {
    setSelectedStakeholder(deptID);
    console.log(`Selected Stakeholder: ${deptID}`);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Add New Strategic Goal</Text>
          <View style={styles.modalContent}>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  Name/Title <Text style={styles.asterisk}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={goalName}
                  onChangeText={setGoalName}
                />
              </View>
            </View>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  Status <Text style={styles.asterisk}>*</Text>
                </Text>
                <Picker
                  selectedValue={selectedStatus}
                  onValueChange={itemValue => setSelectedStatus(itemValue)}
                  style={styles.input}>
                  <Picker.Item label="Select Status" value="" />
                  <Picker.Item label="Active" value="active" />
                  <Picker.Item label="Inactive" value="inactive" />
                  <Picker.Item label="Pending" value="pending" />
                </Picker>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  Goal Owner <Text style={styles.asterisk}>*</Text>
                </Text>

                <NestedDeptDropdownGoals
                  onSelect={handleDeptSelect}
                  editGoal={editGoal}
                />
              </View>
            </View>
            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, styles.fullWidth]}>
                <Text style={styles.inputLabel}>
                  Description <Text style={styles.asterisk}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                />
              </View>
            </View>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  Impacted Stakeholders <Text style={styles.asterisk}>*</Text>
                </Text>
                <NestedDeptDropdownGoals
                  onSelect={handleDeptSelect}
                  editGoal={editGoal}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  Target Year <Text style={styles.asterisk}>*</Text>
                </Text>
                <Picker
                  selectedValue={selectedYear}
                  onValueChange={itemValue => setSelectedYear(itemValue)}
                  style={styles.input}>
                  <Picker.Item label="Select Year" value="" />
                  <Picker.Item label="2024" value="2024" />
                  <Picker.Item label="2025" value="2025" />
                  <Picker.Item label="2026" value="2026" />
                  <Picker.Item label="2027" value="2027" />
                  <Picker.Item label="2028" value="2028" />
                  <Picker.Item label="2029" value="2029" />
                  <Picker.Item label="2030" value="2030" />
                </Picker>
              </View>
            </View>
          </View>
          <View style={{alignItems: 'center'}}>
            <View
              style={[
                styles.buttonContainer,
                {flexDirection: 'row', justifyContent: 'space-between'},
              ]}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}>
                <Text style={styles.buttonText2}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleSubmit}>
                <Text style={styles.buttonText1}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

interface Project {
  project_id: number;
  program_id: number;
  goal_id: number;
  portfolio_id: number;
  department_id: number;
  project_manager_id: number;
  project_name: string;
  project_short_name: string;
  description: string;
  start_date: string;
  end_date: string;
  golive_date: string;
  priority: number;
  phase: string;
  classification: string;
  initial_budget: number;
  initial_budget_unit: string;
  project_owner_user: number;
  project_owner_dept: number;
  business_stakeholder_user: number;
  business_stakeholder_dept: number;
  impacted_stakeholder_user: number;
  impacted_stakeholder_dept: number;
  impacted_applications: number;
  resource_deployed_percentage: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  customer_id: number;
  impacted_function: number;
  project_size: string;
  budget_size: string;
  business_desc: string;
  scope_definition: string;
  key_assumption: string;
  benefit_roi: string;
  risk: string;
  roi: string;
  created_by: number;
  updated_by: number;
  status: number;
  status_name: string;
}

// const navigation = useNavigation();

const IntakeList: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [sortColumn, setSortColumn] = useState('');
  const [isAscending, setIsAscending] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [editGoal, setEditGoal] = useState<any | null>(null);
  const [headerChecked, setHeaderChecked] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [status, setStatus] = useState('');
  const [budget, setBudget] = useState('');
  const [projectManager, setProjectManager] = useState('');
  const [visibleMenu, setVisibleMenu] = useState(null); // Track which menu is visible

  const toggleFilter = () => setFilterVisible(!filterVisible);

   // Function to handle filter submit
   const handleFilterSubmit = async () => {
    setIsLoading(true);
    try {
      const filterData = {
        status,
        budget,
        project_manager: projectManager,
      };
      const data = await GetProjectsWithFilters(filterData);
      const result = JSON.parse(data);
      if (result?.data?.projects && Array.isArray(result.data.projects) && result.data.projects.length > 0) {
        setProjects(result.data.projects); // Set the projects data
      } else {
        setProjects([]); // If no projects found, clear the table
        Alert.alert('No Projects Found', 'No projects match the selected filters.');
      }
      //setProjects(result.data.projects);
      setFilterVisible(false);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setHeaderChecked(checkedItems.size === projects.length);
  }, [checkedItems, projects]);

  const [departments, setDepartments] = useState<any[]>([]); // State to hold departments
  const [users, setUsers] = useState<any[]>([]); // State to hold departments

  // Fetch goals
  const fetchProjects = async () => {
    try {
      const response = await GetProjects('');
      console.log('Get project Response:', response);
      const result = JSON.parse(response);

      console.log(' Get Projects Response:', result);
      if (result?.data?.projects && Array.isArray(result.data.projects)) {
        setProjects(result.data.projects);
      } else {
        console.error('Invalid Projects data');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      Alert.alert('Error', 'Failed to fetch projects');
    }
  };

  //   Fetch departments
  const fetchDepartments = async () => {
    try {
      const response = await GetDept('');
      console.log('unparsed Department Response:', response);
      const result = JSON.parse(response);

      console.log('API Response:', result);
      if (result?.data?.departments && Array.isArray(result.data.departments)) {
        setDepartments(result.data.departments);
      } else {
        console.error('Invalid departments data');
        Alert.alert('Error', 'Invalid departments data received');
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      Alert.alert('Error', 'Failed to fetch departments');
    }
  };
  const handleViewPress = (id: number,status:number) => {
    console.log('Navigating with Project ID:', id);
    navigate('IntakeView', { project_id: id, isEditable: false,status:status });
  };
  const handleEditPress = (id: number) => {
    console.log('Navigating with Project ID:', id);
    navigate('IntakeView', { project_id: id, isEditable: true });
  };

  //fetch Users
  const fetchUsers = async () => {
    try {
      const response = await GetUsers('');
      console.log('unparsed Users Response:', response);
      const result = JSON.parse(response);

      console.log('API Response:', result);
      if (result?.data?.users && Array.isArray(result.data.users)) {
        setUsers(result.data.users);
      } else {
        console.error('Invalid users data');
        Alert.alert('Error', 'Invalid users data received');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchDepartments();
    fetchUsers();
  }, []);

  const mapDepartmentIdToName = (id: number) => {
    const department = departments.find(dept => dept.department_id === id);
    return department ? department.department_name : ' ';
  };
  const mapIdIdToUser = (id: number) => {
    const user = users.find(user => user.user_id === id);
    return user ? `${user.first_name} ${user.last_name}` : ' ';
  };

  const HandleDeleteGoal = async goal_id => {
    const GoalDel = {
      goal_id: goal_id,
    };
    try {
      const response = await DeleteGoal(GoalDel);
      const result = await JSON.parse(response);
      fetchGoals();
    } catch (error) {
      console.error('Error Deleting Goals:', error);
    }
  };

  //   const handleDeletePress = goal_id => {
  //     console.log(goal_id);
  //     HandleDeleteGoal(goal_id);
  //   };

  const openModal = (goal = null) => {
    setModalVisible(true);
    setEditGoal(goal);
  };
  useFocusEffect(
    React.useCallback(() => {
      // Fetch data or refresh the screen every time it gains focus
      fetchProjects();
    }, [])
  );
  const closeModal = () => {
    setModalVisible(false);
    setEditGoal(null);
  };
  //   const handleSubmit = (newGoal: any) => {
  //     if (editGoal) {
  //       setGoalData(prevData =>
  //         prevData.map(goal =>
  //           goal.goal_id === editGoal.goal_id ? {...goal, ...newGoal} : goal,
  //         ),
  //       );
  //     } else {
  //       setGoalData(prevData => [...prevData, newGoal]);
  //     }
  //   };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setIsAscending(!isAscending);
    } else {
      setSortColumn(column);
      setIsAscending(true);
    }

    setGoalData(prevData =>
      [...prevData].sort((a, b) => {
        if (a[column] < b[column]) return isAscending ? -1 : 1;
        if (a[column] > b[column]) return isAscending ? 1 : -1;
        return 0;
      }),
    );
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <Text style={styles.heading}>Intake List</Text>
          <View style={styles.topBar}>
            <View style={styles.leftButtons}>
              {/* <TouchableOpacity style={styles.button}>
                <Icon name="check-circle" size={18} color="#C4C4C4" style={styles.buttonIcon} />
                <Text style={styles.buttonText6}>Approve</Text>
              </TouchableOpacity> */}
              {/* <TouchableOpacity style={styles.button}>
                <Icon
                  name="delete"
                  size={18}
                  color="#C4C4C4"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText6}>Delete</Text>
              </TouchableOpacity> */}
              {/* <TouchableOpacity style={styles.button}>
                <Icon name="export" size={18} color="#C4C4C4" style={styles.buttonIcon} />
                <Text style={styles.buttonText6}>Export</Text>
              </TouchableOpacity> */}
            </View>
            <View style={styles.centerButtons}>
              {/* <TouchableOpacity
                style={styles.button}
                onPress={() => openModal()}>
                <Text style={styles.buttonText}>
                  <Icon
                    name="plus"
                    size={14}
                    color="#044086"
                    style={styles.buttonIcon}
                  />{' '}
                  Create New
                </Text>
              </TouchableOpacity> */}
              {/* <TouchableOpacity style={styles.button}>
                <Icon
                  name="table-column-plus-after"
                  size={18}
                  color="#044086"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Set Column</Text>
              </TouchableOpacity> */}
            </View>
            <View style={styles.rightButtons}>
              <TouchableOpacity style={styles.button} onPress={toggleFilter}>
                <Icon
                  name="filter"
                  size={18}
                  color="#044086"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Filter</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Filter Modal */}
            <Modal
              visible={filterVisible}
              animationType="none"
              transparent={true}
              onRequestClose={toggleFilter}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalScrollContainer}>
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContainerRight}>
                    <Text style={styles.modalHeader}>Filter Options</Text>

                    {/* Status Dropdown */}
                    <View style={styles.inputRow}>
                      <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Status</Text>
                        <Picker
                          selectedValue={status}
                          onValueChange={(itemValue) => setStatus(itemValue)}
                          style={styles.input}>
                          <Picker.Item label="Select Status" value="" color="#aaa" />
                          <Picker.Item label="In Draft" value="2" />
                          <Picker.Item label="Review Pending" value="3" />
                          <Picker.Item label="Reviewed" value="4" />
                          <Picker.Item label="Approval Pending" value="1" />
                          <Picker.Item label="Approved" value="5" />
                          <Picker.Item label="Approval Rejected" value="9" />
                          <Picker.Item label="Rejected" value="10" />
                        </Picker>
                      </View>
                    </View>

                    {/* Budget Dropdown */}
                    <View style={styles.inputRow}>
                      <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Budget</Text>
                        <Picker
                          selectedValue={budget}
                          onValueChange={(itemValue) => setBudget(itemValue)}
                          style={styles.input}>
                          <Picker.Item label="Select Budget" value="" color="#aaa" />
                          <Picker.Item label="High" value="1" />
                          <Picker.Item label="Medium" value="2" />
                          <Picker.Item label="Low" value="3" />
                        </Picker>
                      </View>
                    </View>

                    {/* Project Manager Dropdown */}
                    <View style={styles.inputRow1}>
                      <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Project Manager</Text>
                        <Picker
                          selectedValue={projectManager}
                          onValueChange={(itemValue) => setProjectManager(itemValue)}
                          style={styles.input}>
                          <Picker.Item label="Select Project Manager" value="" color="#aaa" />
                          {users.map((user,index) => (
                            <Picker.Item
                              key={index}
                              label={`${user.first_name} ${user.last_name}`}
                              value={user.user_id}
                            />
                          ))}
                        </Picker>
                      </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 14 }}>
                      {/* Clear Filter Button */}
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => {
                          // Reset all filters
                          setStatus("");
                          setBudget("");
                          setProjectManager("");
                          //fetchUser(); // Refresh data if necessary
                          toggleFilter(); // Close the filter modal
                          fetchProjects(); // Apply the filters
                        }}>
                        <Text style={styles.closeButtonText}>Clear Filter</Text>
                      </TouchableOpacity>

                      {/* Apply Filter Button */}
                      <TouchableOpacity style={styles.submitButton} onPress={handleFilterSubmit}>
                        <Text style={styles.submitButtonText}>Apply Filters</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </Modal>


          {/*Table*/}
          <View style={styles.container1}>
              <DataTable>
                {/* Header */}
                <DataTable.Header style={styles.header}>
                  <DataTable.Title style={styles.columnSNo}>S.No.</DataTable.Title>
                  <DataTable.Title style={styles.columnDefault}>Project ID</DataTable.Title>
                  <DataTable.Title style={styles.columnDefault}>Project Name</DataTable.Title>
                  <DataTable.Title style={styles.columnDefault}>Status</DataTable.Title>
                  <DataTable.Title style={styles.columnWide}>Project Owner</DataTable.Title>
                  <DataTable.Title style={styles.columnWide}>Project Manager</DataTable.Title>
                  <DataTable.Title style={styles.columnDefault}>Budget</DataTable.Title>
                  <DataTable.Title style={styles.columnDefault}>Start Date</DataTable.Title>
                  <DataTable.Title style={styles.columnDefault}>End Date</DataTable.Title>
                  <DataTable.Title style={styles.columnDefault}>Go-Live Date</DataTable.Title>
                  <DataTable.Title style={styles.columnWide}>Requested By</DataTable.Title>
                  <DataTable.Title style={styles.columnDefault}>Requested On</DataTable.Title>
                  <DataTable.Title style={styles.columnActions}>Actions</DataTable.Title>
                </DataTable.Header>

                {/* Rows */}
                <ScrollView style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}>
                  {projects.map((project, index) => (
                    <DataTable.Row key={project.project_id} style={styles.row1}>
                      <DataTable.Cell style={styles.columnSNo}>{index + 1}</DataTable.Cell>
                      <DataTable.Cell style={styles.columnDefaultLeft}>{`FPX${project.project_id}`}</DataTable.Cell>
                      <DataTable.Cell style={styles.columnDefaultLeft}>{project.project_name}</DataTable.Cell>
                      <DataTable.Cell style={styles.columnDefaultLeft}>{project.status_name}</DataTable.Cell>
                      <DataTable.Cell style={styles.columnWideLeft}>{mapIdIdToUser(project.project_owner_user)}</DataTable.Cell>
                      <DataTable.Cell style={styles.columnWideLeft}>{mapIdIdToUser(project.project_manager_id)}</DataTable.Cell>
                      <DataTable.Cell style={styles.columnDefaultLeft}>{project.budget}</DataTable.Cell>
                      <DataTable.Cell style={styles.columnDefault}>
                        {new Date(project.start_date).toLocaleDateString()}
                      </DataTable.Cell>
                      <DataTable.Cell style={styles.columnDefault}>
                        {new Date(project.end_date).toLocaleDateString()}
                      </DataTable.Cell>
                      <DataTable.Cell style={styles.columnDefault}>
                        {new Date(project.golive_date).toLocaleDateString()}
                      </DataTable.Cell>
                      <DataTable.Cell style={styles.columnWideLeft}>{project.created_by_name}</DataTable.Cell>
                      <DataTable.Cell style={styles.columnDefault}>
                        {new Date(project.created_at).toLocaleDateString()}
                      </DataTable.Cell>
                      <DataTable.Cell style={styles.columnActions}>
                        <Menu
                          visible={visibleMenu === project.project_id}
                          onDismiss={() => setVisibleMenu(null)}
                          anchor={
                            <IconButton
                              icon="dots-vertical"
                              size={20}
                              onPress={() => setVisibleMenu(project.project_id)}
                            />
                          }>
                          <Menu.Item
                            onPress={() => {
                              console.log('View:', project.project_id);
                              handleViewPress(project.project_id,project.status); // Call the function with the project ID
                              setVisibleMenu(null);
                            }}
                            title="View"
                          />
                          {project.status === 2 && (
                            <Menu.Item
                              onPress={() => {
                                handleEditPress(project.project_id);
                                setVisibleMenu(null);
                              }}
                              title="Edit"
                            />
                          )}
                          {/* <Menu.Item onPress={() => {}} title="Reject" /> */}
                        </Menu>
                      </DataTable.Cell>
                    </DataTable.Row>
                  ))}
                </ScrollView>
              </DataTable>
          </View>

          {isLoading && <ActivityIndicator size="large" color="#044086" />}
        </View>
      </View>
      <CreateNewIntakeModal
        visible={modalVisible}
        onClose={closeModal}
        // onSubmit={handleSubmit}
        editGoal={editGoal}
      />
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    width: '100%',
  },
  contentWrapper: {
    flex: 1,
    alignSelf: 'stretch',
    width: '100%',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  leftButtons: {
    flexDirection: 'row',
  },
  centerButtons: {
    flexDirection: 'row',
    marginRight: 176,
  },
  rightButtons: {
    flexDirection: 'row',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginHorizontal: 5,
    borderRadius: 4,
  },
  buttonText: {
    color: '#044086',
    fontSize: 14,
  },
  buttonText6: {
    color: '#C4C4C4',
  },
  buttonIcon: {
    marginRight: 5,
  },
  tableContainer: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    color: '#757575',
    textAlign: 'center',
    fontFamily: 'Source Sans Pro',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 22,
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 12,
    paddingHorizontal: 2, // Reduce horizontal padding
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
    paddingVertical: 6,
  },
  cell: {
    fontSize: 12,
    paddingHorizontal: 2, // Reduce horizontal padding
    textAlign: 'left',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  actionCell: {
    justifyContent: 'center',
    padding: 0,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '95%',
    maxWidth: 600,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalContent: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
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
    width: '100%',
  },
  fullWidthInput: {
    marginVertical: 10,
  },
  cancelButton: {
    backgroundColor: '#ddd',
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: '#044086',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 15,
    marginRight: 10,
    paddingHorizontal: 16,
  },
  buttonText1: {
    color: 'white',
  },
  buttonText2: {
    color: 'black',
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#044086',
  },
  asterisk: {
    color: 'red',
  },
  picker: {
    height: 40,
    borderBottomColor: '#044086',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  pickerItem: {
    fontSize: 14,
  },
  textArea: {
    textAlignVertical: 'top',
  },
  fullWidth: {
    width: '100%',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  filterModal: {
    width: '30%', // Slightly larger for better spacing
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15, // Softer corners
    shadowColor: '#000', // Shadow for better visibility
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  filterTitle: {
    fontSize: 20, // Slightly larger title
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center', // Centered title
  },
  pickerContainer: {
    marginVertical: 10, // Add spacing between pickers
  },
  buttonContainer1: {
    flexDirection: 'row', // Arrange buttons side-by-side
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonFilter: {
    flex: 1, // Equal width for both buttons
    marginHorizontal: 5, // Add spacing between buttons
    padding: 10,
    backgroundColor: '#007BFF', // Primary button color
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText7: {
    color: 'white',
    fontWeight: 'bold',
  },
  pickerHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333', // Optional: Add a color for better readability
  },
  headerText: {
    fontWeight: '600',
    fontSize: 13,
    color: '#757575',
    textAlign: 'center',
  },
  container1: {
    flex: 1,
    margin: 10,
    padding: 10,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#f5f5f5',
  },
  row1: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  columnSNo: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnDefault: {
    flex: 1,
    justifyContent: 'center',
  },
  columnDefaultLeft: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 4,
  },
  columnWide: {
    flex: 1.5,
    justifyContent: 'center',
  },
  columnWideLeft: {
    flex: 1.5,
    justifyContent: 'flex-start',
    padding: 4,
  },
  columnActions: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScrollContainer: {
    maxHeight: 800,
    paddingBottom: 20,
    flexGrow: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainerRight: {
    width: '25%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 40,
    position: 'absolute',
    top: '20%',
    right: 10,
    zIndex: 100,
    flexGrow: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5, // For Android shadows
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputRow1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 20,
  },
  inputWrapper: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#044086',
    marginBottom: 5, // Adds space between the label and the input
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
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scrollContainer: {
    maxHeight: 450, // Adjust the height as needed
    overflow: 'hidden',
  },
  
  
});

export default IntakeList;