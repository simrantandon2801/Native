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
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import {
  Checkbox,
  Menu,
  Provider as PaperProvider,
  IconButton,
  DataTable,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Picker} from '@react-native-picker/picker';
import {AppImages} from '../../assets';
import {DeleteGoal, GetGoals, InsertGoal} from '../../database/Goals';
import NestedDeptDropdown from '../../modals/NestedDeptDropdown';
import NestedDeptDropdownGoals from '../../modals/NestedDropdownGoals';
import NestedMultiselectDropdown from '../../modals/NestedMultSelect';

import {GetDept} from '../../database/Departments';

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
      selectedGoalOwner &&
      description &&
      selectedStakeholders &&
      selectedYear
    ) {
      const newGoal = {
        goal_id: goalId,
        goal_name: goalName,
        description: description,
        stakeholders: selectedStakeholders.join(','),
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

  // const handleStakeSelect = (deptID: number) => {
  //   setSelectedStakeholder(deptID);
  //   console.log(`Selected Stakeholder: ${deptID}`);
  // };

  const [selectedStakeholders, setSelectedStakeholders] = useState<number[]>([]);
  const handleSelectionChange = (newSelectedStakeholders: number[]) => {
    setSelectedStakeholders(newSelectedStakeholders);
    console.log('Updated Selected Items:', newSelectedStakeholders);
  };

  const {width: screenWidth} = useWindowDimensions();
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
                  Goal Owner <Text style={styles.asterisk}>*</Text>
                </Text>

                <NestedDeptDropdownGoals
                  onSelect={handleDeptSelect}
                  editGoal={editGoal}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  Impacted Stakeholders <Text style={styles.asterisk}>*</Text>
                </Text>
                {/* <NestedDeptDropdownGoals onSelect={handleStakeSelect} editGoal={editGoal} /> */}
                <NestedMultiselectDropdown
                  onSelectionChange={handleSelectionChange}
                  editGoal={editGoal} // Pass editGoal if in edit mode
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
const ManageGoals: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [sortColumn, setSortColumn] = useState('');
  const [isAscending, setIsAscending] = useState(true);
  const [goalData, setGoalData] = useState<any[]>([]);
  const [editGoal, setEditGoal] = useState<any | null>(null);
  const [headerChecked, setHeaderChecked] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setHeaderChecked(checkedItems.size === goalData.length);
  }, [checkedItems, goalData]);

  const [departments, setDepartments] = useState<any[]>([]); // State to hold departments

  // Fetch goals
  const fetchGoals = async () => {
    try {
      const response = await GetGoals('');
      console.log('unparsed Response:', response);
      const result = JSON.parse(response);

      console.log('API Response:', result);
      if (result?.data?.goals && Array.isArray(result.data.goals)) {
        setGoalData(result.data.goals); // Set the goals array from the data object
      } else {
        console.error('Invalid goals data');
        Alert.alert('Error', 'Invalid goals data received');
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
      Alert.alert('Error', 'Failed to fetch goals');
    }
  };

  // Fetch departments
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

  useEffect(() => {
    fetchGoals();
    fetchDepartments();
  }, []);

  const mapDepartmentIdToName = (id: number) => {
    const department = departments.find(dept => dept.department_id === id);
    return department ? department.department_name : ' ';
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

  const handleDeletePress = goal_id => {
    console.log(goal_id);
    HandleDeleteGoal(goal_id);
  };

  const openModal = (goal = null) => {
    setModalVisible(true);
    setEditGoal(goal);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditGoal(null);
  };
  const handleSubmit = (newGoal: any) => {
    if (editGoal) {
      setGoalData(prevData =>
        prevData.map(goal =>
          goal.goal_id === editGoal.goal_id ? {...goal, ...newGoal} : goal,
        ),
      );
    } else {
      setGoalData(prevData => [...prevData, newGoal]);
    }
  };

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
  const {width: screenWidth} = useWindowDimensions();
  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <Text style={styles.heading}>Strategic Goals</Text>
          <View style={styles.topBar}>
            {/* <View style={styles.leftButtons}>
              <TouchableOpacity style={styles.button}>
                <Icon
                  name="delete"
                  size={18}
                  color="#C4C4C4"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText6}>Delete</Text>
              </TouchableOpacity>
            </View> */}
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
            {/* <View style={styles.rightButtons}>
              <TouchableOpacity style={styles.button}>
                <Icon
                  name="filter"
                  size={18}
                  color="#044086"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Filter</Text>
              </TouchableOpacity>
            </View> */}
          </View>
          <DataTable style={styles.tableContainer}>
            <DataTable.Header>
              {/* <Checkbox
                status={headerChecked ? 'checked' : 'unchecked'}
                onPress={() => {
                  if (headerChecked) {
                    setCheckedItems(new Set());
                  } else {
                    setCheckedItems(
                      new Set(goalData.map(goal => goal.goal_id)),
                    );
                  }
                }}
              /> */}
              <DataTable.Title>S.No.</DataTable.Title>
              <DataTable.Title>Goal</DataTable.Title>
              <DataTable.Title>Description</DataTable.Title>
              <DataTable.Title>Impacted Stakeholders</DataTable.Title>
              <DataTable.Title>Goal Owner</DataTable.Title>
              <DataTable.Title>Target Year</DataTable.Title>
              <DataTable.Title>Created On</DataTable.Title>
              <DataTable.Title>Actions</DataTable.Title>
            </DataTable.Header>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{maxHeight: 4150}}>
              {goalData.map((goal, index) => (
                <DataTable.Row key={goal.goal_id}>
                  {/* <Checkbox
                    status={
                      checkedItems.has(goal.goal_id) ? 'checked' : 'unchecked'
                    }
                    onPress={() => {
                      setCheckedItems(prevChecked => {
                        const newChecked = new Set(prevChecked);
                        if (newChecked.has(goal.goal_id)) {
                          newChecked.delete(goal.goal_id);
                        } else {
                          newChecked.add(goal.goal_id);
                        }
                        return newChecked;
                      });
                    }}
                  /> */}
                  <DataTable.Cell>{index + 1}</DataTable.Cell>
                  <DataTable.Cell>{goal.goal_name}</DataTable.Cell>
                  <DataTable.Cell>{goal.description}</DataTable.Cell>
                  <DataTable.Cell>{goal.stakeholder_names}</DataTable.Cell>
                  <DataTable.Cell>
                    {mapDepartmentIdToName(parseInt(goal.goal_owner))}
                  </DataTable.Cell>
                  <DataTable.Cell>{goal.target_year}</DataTable.Cell>
                  <DataTable.Cell>
                    {new Date(goal.created_at).toLocaleDateString()}
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Menu
                      visible={goal.menuVisible}
                      onDismiss={() => {
                        const updatedGoalData = goalData.map(item =>
                          item.goal_id === goal.goal_id
                            ? {...item, menuVisible: false}
                            : item,
                        );
                        setGoalData(updatedGoalData);
                      }}
                      anchor={
                        <TouchableOpacity
                          onPress={event => {
                            const {pageX, pageY} = event.nativeEvent;
                            const updatedIntakeData = goalData.map(item =>
                              item.goal_id === goal.goal_id
                                ? {
                                    ...item,
                                    menuVisible: true,
                                    menuX: pageX,
                                    menuY: pageY,
                                  }
                                : {...item, menuVisible: false},
                            );
                            setGoalData(updatedIntakeData);
                          }}>
                          <IconButton
                            icon="dots-vertical"
                            size={20}
                            style={{margin: 0, padding: 0}}
                          />
                        </TouchableOpacity>
                      }
                      style={{
                        flexGrow: 1,
                        left: screenWidth - 390,
                        top: 150,
                      }}>
                      <Menu.Item onPress={() => openModal(goal)} title="Edit" />
                      <Menu.Item
                        onPress={() => handleDeletePress(goal.goal_id)}
                        title="Delete"
                      />
                      <Menu.Item onPress={() => {}} title="Create Program" />
                    </Menu>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </ScrollView>
          </DataTable>
          {isLoading && <ActivityIndicator size="large" color="#044086" />}
        </View>
      </View>
      <CreateNewIntakeModal
        visible={modalVisible}
        onClose={closeModal}
        onSubmit={handleSubmit}
        editGoal={editGoal}
      />
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 10,
    width: '100%',
  },
  contentWrapper: {
    width: '100%',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 10,
    fontFamily: 'Outfit',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  leftButtons: {
    flexDirection: 'row',
  },
  centerButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
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
    fontFamily: 'Inter',
  },
  buttonText6: {
    color: '#C4C4C4',
  },
  buttonIcon: {
    marginRight: 5,
    justifyContent: 'center',
  },
  tableContainer: {
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
    paddingHorizontal: 2,
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
    paddingHorizontal: 2,
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
    // justifyContent: 'space-between',
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

export default ManageGoals;

