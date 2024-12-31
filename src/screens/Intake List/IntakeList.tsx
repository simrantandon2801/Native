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
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Picker} from '@react-native-picker/picker';
import {AppImages} from '../../assets';
import {DeleteGoal, GetGoals, InsertGoal} from '../../database/Goals';
import NestedDeptDropdown from '../../modals/NestedDeptDropdown';
import NestedDeptDropdownGoals from '../../modals/NestedDropdownGoals';
import {GetDept, GetUsers} from '../../database/Departments';
import {GetProjects} from '../../database/Intake';
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
    return user ? `${user.first_name}${user.last_name}` : ' ';
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
              <TouchableOpacity style={styles.button}>
                <Icon
                  name="delete"
                  size={18}
                  color="#C4C4C4"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText6}>Delete</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity style={styles.button}>
                <Icon name="export" size={18} color="#C4C4C4" style={styles.buttonIcon} />
                <Text style={styles.buttonText6}>Export</Text>
              </TouchableOpacity> */}
            </View>
            <View style={styles.centerButtons}>
              <TouchableOpacity
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
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Icon
                  name="table-column-plus-after"
                  size={18}
                  color="#044086"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Set Column</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.rightButtons}>
              <TouchableOpacity style={styles.button}>
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
          <View style={styles.tableContainer}>
            <View style={styles.headerRow}>
              {[
                '',
                'S.No.',
                'Project ID',
                'Project Name',
                'Status',
                'Project Owner',
                'Project Manager',
                'Budget',
                'Start date',
                'End date',
                'Go-Live date',
                'Requested By',
                'Requested On',
                'Actions',
              ].map((header, index) => (
                <View
                  key={index}
                  style={[
                    styles.headerCell,
                    index === 0
                      ? {flex: 0.3}
                      : index === 1
                      ? {flex: 0.4}
                      : index === 2
                      ? {flex: 1}
                      : index >= 3 && index <= 4
                      ? {flex: 1.3}
                      : index >= 5 && index <= 6
                      ? {flex: 1.5}
                      : index >= 9 && index <= 10
                      ? {flex: 1.5}
                      : {flex: 1},
                  ]}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {index === 0 && (
                      <Checkbox
                        status={headerChecked ? 'checked' : 'unchecked'}
                        onPress={() => {
                          if (headerChecked) {
                            setCheckedItems(new Set());
                          } else {
                            setCheckedItems(
                              new Set(
                                projects.map(project =>
                                  project.project_id.toString(),
                                ),
                              ),
                            );
                          }
                        }}
                      />
                    )}
                    <Text
                      style={{
                        color: '#757575',
                        fontFamily: 'Source Sans Pro',
                        fontSize: 13,
                        fontStyle: 'normal',
                        fontWeight: '600',
                        lineHeight: 22,
                      }}>
                      {header}
                    </Text>
                    {index > 2 && index < 10 && (
                      <TouchableOpacity
                        onPress={() => handleSort(header.toLowerCase())}>
                        <Image
                          source={AppImages.Arrow}
                          style={{
                            width: 16,
                            height: 16,
                            marginLeft: 4,
                            tintColor:
                              sortColumn === header.toLowerCase()
                                ? '#757575'
                                : '#757575',
                            transform: [
                              {
                                rotate:
                                  sortColumn === header.toLowerCase() &&
                                  !isAscending
                                    ? '180deg'
                                    : '0deg',
                              },
                            ],
                          }}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
            {/*Row items start */}
            <ScrollView showsVerticalScrollIndicator={false}>
              {projects.map((project, index) => (
                <View key={project.project_id} style={styles.row}>
                  <View style={[styles.cell, {flex: 0.3}]}>
                    <Checkbox
                      status={
                        checkedItems.has(project.project_id.toString())
                          ? 'checked'
                          : 'unchecked'
                      }
                      onPress={() => {
                        setCheckedItems(prevChecked => {
                          const newChecked = new Set(prevChecked);
                          if (newChecked.has(project.project_id.toString())) {
                            newChecked.delete(project.project_id.toString());
                          } else {
                            newChecked.add(project.project_id.toString());
                          }
                          return newChecked;
                        });
                      }}
                    />
                  </View>
                  <View style={[styles.cell, {flex: 0.4}]}>
                    <Text>{index + 1}</Text>
                  </View>
                  <View style={[styles.cell, {flex: 1}]}>
                    <Text>FPX{project.project_id}</Text>
                  </View>
                  <View style={[styles.cell, {flex: 1.3}]}>
                    <Text>{project.project_name}</Text>
                  </View>
                  <View style={[styles.cell, {flex: 1.3}]}>
                    {/* <Text numberOfLines={1} ellipsizeMode="tail">
                      {mapDepartmentIdToName(project.project_owner_dept)}
                    </Text> */}
                    <Text>{project.status_name}</Text>
                  </View>
                  <View style={[styles.cell, {flex: 1.5}]}>
                    <Text>{mapIdIdToUser(project.project_owner_user)}</Text>
                  </View>
                  <View style={[styles.cell, {flex: 1.5}]}>
                    <Text>{mapIdIdToUser(project.project_manager_id)}</Text>
                  </View>
                  <View style={[styles.cell, {flex: 1}]}>
                    <Text>{project.budget}</Text>
                  </View>
                  <View style={[styles.cell, {flex: 1}]}>
                    <Text>
                      {new Date(project.start_date).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={[styles.cell, {flex: 1}]}>
                    <Text>
                      {new Date(project.end_date).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={[styles.cell, {flex: 1}]}>
                    <Text>
                      {new Date(project.golive_date).toLocaleDateString()}
                    </Text>
                  </View>

                  {/* <View style={[styles.cell, {flex: 1.5}]}>
                  <Text>
                    {new Date(project.requested_by_date).toLocaleDateString()}
                  </Text>
                </View> */}
                  <View style={[styles.cell, {flex: 1.5}]}>
                    <Text>
                      {project.created_by_name}
                    </Text>
                  </View>
                  <View style={[styles.cell, {flex: 1}]}>
                    {new Date(project.created_at).toLocaleDateString()}
                  </View>
                  <View style={[styles.cell, {flex: 1}]}>
                    <Menu
                      visible={project.menuVisible}
                      onDismiss={() => {
                        const updatedProjectsData = projects.map(item =>
                          item.project_id === project.project_id
                            ? {...item, menuVisible: false}
                            : item,
                        );
                        setProjects(updatedProjectsData);
                      }}
                      anchor={
                        <TouchableOpacity
                          onPress={event => {
                            const {pageX, pageY} = event.nativeEvent;
                            const updatedProjectsData = projects.map(item =>
                              item.project_id === project.project_id
                                ? {
                                    ...item,
                                    menuVisible: true,
                                    menuX: pageX,
                                    menuY: pageY,
                                  }
                                : {...item, menuVisible: false},
                            );
                            setProjects(updatedProjectsData);
                          }}>
                          <IconButton
                            icon="dots-vertical"
                            size={20}
                            style={{margin: 0, padding: 0}}
                          />
                        </TouchableOpacity>
                      }
                      style={{
                        position: 'absolute',
                        zIndex: 1000,
                        left: project.menuX ? project.menuX - 150 : 0,
                        top: project.menuY ? project.menuY - 80 : 0,
                      }}>
                      <Menu.Item
                        onPress={() => {
                          console.log(
                            'Project ID in onPress:',
                            project.project_id,
                          ); // Debugging log
                          handleViewPress(project.project_id,project.status); // Call the function with the project ID
                        }}
                        title="View"
                      />
                      {project.status === 2 && (
    <Menu.Item
      onPress={() => handleEditPress(project.project_id)}
      title="Edit"
    />
  )}
                      {/* <Menu.Item onPress={() => {}} title="Reject" /> */}
                    </Menu>
                  </View>
                </View>
              ))}
            </ScrollView>
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
});

export default IntakeList;