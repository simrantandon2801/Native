import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  Image,
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
import {
  DeleteProgram,
  GetPrograms,
  InsertProgram,
} from '../../database/ManageProgram';
import {GetGoals} from '../../database/Goals';
import { AppImages } from '../../assets';

interface CreateNewIntakeModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (newGoal: any) => void;
  EditProgram?: any;
}
import NestedDeptDropdownPrograms from '../../modals/NestedDropdownPrograms';
const CreateNewIntakeModal: React.FC<CreateNewIntakeModalProps> = ({
  visible,
  onClose,
  onSubmit,
  EditProgram,
  reloadParent 
}) => {
  const [selectedProgramOwner, setSelectedProgramOwner] = useState<number>(-1);
  //const [selectedGoalOwner, setSelectedGoalOwner] = useState<number>(-1);
  
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedApprovalReqd, setSelectedApprovalReqd] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');

  const [selectedApprovalStatus, setSelectedApprovalStatus] = useState('');
  const [Programname, setProgramname] = useState('');
  const [Description, setDescription] = useState('');
  const [programData, setProgramData] = useState<any>([]);
  const [programId, setprogramId] = useState<string | undefined>(undefined);
  const [goalData, setGoalData] = useState([]); // To hold the fetched goals


  useEffect(() => {
    console.log();
    console.log('Edit Program:', EditProgram);
    if (EditProgram) {
      setprogramId(EditProgram.program_id);
      setProgramname(EditProgram.program_name || '');
      setDescription(EditProgram.description || '');
      //setSelectedStakeholder(editGoal.stakeholders || '');
      setSelectedYear(EditProgram.target_year || '');
      setSelectedStatus(EditProgram.status || '');
      setSelectedProgramOwner(EditProgram.program_owner || '');
    } else {
      setprogramId(undefined);
      setProgramname('');
      setDescription('');
      //setSelectedStakeholder('');
      setSelectedYear('');
      setSelectedStatus('');
      setSelectedProgramOwner('');
    }
  }, [EditProgram]);

  const handleSubmit = async () => {
    console.log('Submit inside modal triggered');
    if (
      !Programname ||
      !Description
    ) {
      Alert.alert('Error', 'Please fill out all required fields.');
      return;
    }
    const programDataToSubmit = {
      program_id: programId,
      program_name: Programname,
      description: Description,
      //stakeholders:,
      program_owner: selectedProgramOwner,
      target_year: selectedYear,
      //start_date:,
      //end_date:,
      goal_id: selectedGoal,
      status: selectedStatus,
      year: selectedYear,
      approvalReqd: selectedApprovalReqd,
      approvalStatus: selectedApprovalStatus,
    };
    console.log(programDataToSubmit);

    try {
      const response = await InsertProgram(programDataToSubmit); // Ensure InsertProgram is an async function
      const parsedResponse = JSON.parse(response);

      if (parsedResponse.status === 'success') {
        Alert.alert('Goal created successfully');
        onSubmit(programDataToSubmit);
        onClose(); // Close the modal after successful submission
       
       
      } else {
        Alert.alert('Failed to create goal. Please try again.');
        onClose(); // Close the modal even if there is an error
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      Alert.alert('An error occurred. Please try again.');
    }
  };

  const fetchGoals = async () => {
    try {
      const response = await GetGoals(''); // Assume GetGoals fetches the goals data
      const result = JSON.parse(response);

      if (result?.data?.goals && Array.isArray(result.data.goals)) {
        setGoalData(result.data.goals); // Set the fetched goals data
      } else {
        console.error('Invalid goals data');
        Alert.alert('Error', 'Invalid goals data received');
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
      Alert.alert('Error', 'Failed to fetch goals');
    }
  };
  const handleDeptSelect = (deptID: number) => {
    setSelectedProgramOwner(deptID);
    console.log(`Selected GoalOwner: ${deptID}`);
  };

  useEffect(()=>{
    fetchGoals();
  },)

  return (
    <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}>
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Text style={styles.modalTitle}>Add New Strategic Programs</Text>
        <View style={styles.modalContent}>
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Name/Title <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={Programname}
                onChangeText={setProgramname}
              />
            </View>
          </View>
          <View style={styles.inputRow}>
            {/* <View style={styles.inputContainer}>
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
            </View> */}

            {/*Goals Dropdown*/}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Goals <Text style={styles.asterisk}>*</Text>
              </Text>
              <Picker
                selectedValue={selectedGoal}
                onValueChange={itemValue =>
                  setSelectedGoal(itemValue)
                }
                style={styles.input}>
                <Picker.Item label="Select Goal" value="" />

                {/* Map through the fetched goals and display them in the Picker */}
                {goalData.length > 0 ? (
                  goalData.map(goal => (
                    <Picker.Item
                      key={goal.goal_id} // Unique key for each Picker.Item
                      label={goal.goal_name} // Display the goal name
                      value={goal.goal_id.toString()} // Set goal_id as value
                    />
                  ))
                ) : (
                  <Picker.Item label="No Goals Available" value="" />
                )}
              </Picker>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Program Owner
              </Text>
                <NestedDeptDropdownPrograms onSelect={handleDeptSelect} EditProgram={EditProgram} />
            </View>
          </View>

          {/* <View style={styles.inputRow}>
             <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Approval Reqd <Text style={styles.asterisk}>*</Text>
              </Text>
              <Picker
                selectedValue={selectedApprovalReqd}
                onValueChange={itemValue =>
                  setSelectedApprovalReqd(itemValue)
                }
                style={styles.input}>
                <Picker.Item label="Select Approval Reqd" value="" />
                <Picker.Item label="Yes" value="Yes" />
                <Picker.Item label="No" value="No" />
              </Picker>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Approval Status <Text style={styles.asterisk}>*</Text>
              </Text>
              <Picker
                selectedValue={selectedApprovalStatus}
                onValueChange={itemValue =>
                  setSelectedApprovalStatus(itemValue)
                }
                style={styles.input}>
                <Picker.Item label="Select Approval Status" value="" />
                <Picker.Item label="Ontrack" value="Ontrack" />
                <Picker.Item label="Delayed" value="Delayed" />
              </Picker>
            </View>
          </View> */}
          <View style={styles.inputRow}>
            <View style={[styles.inputContainer, styles.fullWidth]}>
              <Text style={styles.inputLabel}>
                Description <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={Description}
                onChangeText={setDescription}
               
              />
            </View>
          </View>
          <View style={styles.inputRow}>
            {/* Impacted Stakeholders Dropdown */}
         
            {/* Target Year Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Target Year
              </Text>
              <Picker
                selectedValue={selectedYear}
                onValueChange={itemValue => setSelectedYear(itemValue)}
                style={styles.input}>
                <Picker.Item label="Select Year" value="" />
                <Picker.Item label="2024" value="2024" />
                <Picker.Item label="2025" value="2025" />
                <Picker.Item label="2026" value="2026" />
              </Picker>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
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
  </Modal>
  );
};

const ManagePrograms: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [ProgramData, setProgramData] = useState<any[]>([]);
  const [EditProgram, setEditProgram] = useState<any | null>(null);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  
  const fetchPrograms = async () => {
    try {
      const response = await GetPrograms('');
      console.log('unparsed Response:', response);
      const result = JSON.parse(response);
      //const result = await JSON.parse(response);

      console.log('API Response:', result);
      if (result?.data?.programs && Array.isArray(result.data.programs)) {
        setProgramData(result.data.programs); // Set the goals array from the data object
      } else {
        console.error('Invalid programs data');
        Alert.alert('Error', 'Invalid goals data received');
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
      Alert.alert('Error', 'Failed to fetch programs');
    }
  };
  useEffect(() => {
    fetchPrograms();
  }, []);
  /*   const [intakeData, setIntakeData] = useState([
    { id: 1, programName: 'Program A', goal: 'To gain Progress', description: 'A detailed project overview crafted by the PMO, outlining objectives, scope, and strategies within the PPM framework.', impactedStakeholders: 'Business Function - Finance', approvalRead: 'Yes', approvalStatus: 'Ontrack', targetYear: 2024, createdOn: '13/04/2023', status: 'Delayed', menuVisible: false, menuX: 0, menuY: 0 },
    { id: 2, programName: 'Program B', goal: 'Goal1', description: 'A detailed project overview...', impactedStakeholders: 'Tower- Product & Development', approvalRead: 'Yes', approvalStatus: 'Ontrack', targetYear: 2025, createdOn: '14/04/2023', status: 'Delayed', menuVisible: false, menuX: 0, menuY: 0 },
    { id: 3, programName: 'Program C', goal: 'Goal2', description: 'A detailed project overview...', impactedStakeholders: 'Business Function - Finance', approvalRead: 'Yes', approvalStatus: 'Ontrack', targetYear: 2026, createdOn: '15/04/2023', status: 'Delayed', menuVisible: false, menuX: 0, menuY: 0 },
  ]); */

  const handleDeletePress = program_id => {
    console.log(program_id);
    HandleDeleteProgram(program_id);
  };
  const HandleDeleteProgram = async program_id => {
    console.log('Deleting program with ID:', program_id);
    const GoalDel = {
      program_id: program_id,
    };
    try {
      const response = await DeleteProgram(GoalDel);

      //const result = JSON.parse(response);
      const result = await JSON.parse(response);
      fetchPrograms();
    } catch (error) {
      console.error('Error Deleting Goals:', error);
    }
  };
  const openModal = (program = null) => {
    console.log('Opening modal with program:', program);
    setModalVisible(true);
    setEditProgram(program);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditProgram(null);
  };
  const handleSubmit = (programDataToSubmit: any) => {
    if (EditProgram) {
      setProgramData(prevData =>
        prevData.map(program =>
          program.program_id === EditProgram.program_id
            ? {...program, ...programDataToSubmit}
            : program,
        ),
      );
    } else {
      setProgramData(prevData => [...prevData, programDataToSubmit]);
    }
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedPrograms(ProgramData.map(program => program.program_id));
    } else {
      setSelectedPrograms([]);
    }
  };

  const handleSelectProgram = (programId: string) => {
    setSelectedPrograms(prev => 
      prev.includes(programId) 
        ? prev.filter(id => id !== programId)
        : [...prev, programId]
    );
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.heading}>Strategic Programs</Text>
        <View style={styles.buttonRow}>
          <View style={styles.leftButtons}>
            <TouchableOpacity style={styles.button}>
              <Icon
                name="delete"
                size={18}
                color="#C4C4C4"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText6}>Delete</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.centerButtons}>
            <TouchableOpacity style={styles.button} onPress={openModal}>
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
        </View>
        <View style={styles.tableContainer}>
          <DataTable style={styles.dataTable}>
            <DataTable.Header style={styles.tableHeader}>
              <DataTable.Title style={styles.checkboxColumn}>
                <TouchableOpacity onPress={handleSelectAll}>
                  <View style={[styles.checkbox, selectAll && styles.checkboxChecked]}>
                    {selectAll && <Icon name="check" size={16} color="#fff" />}
                  </View>
                </TouchableOpacity>
              </DataTable.Title>
              <DataTable.Title style={styles.numberColumn}>S.No.</DataTable.Title>
              <DataTable.Title>Program Name</DataTable.Title>
              <DataTable.Title>Goal</DataTable.Title>
              <DataTable.Title>Description</DataTable.Title>
              <DataTable.Title>Program Owner</DataTable.Title>
              <DataTable.Title>Target Year</DataTable.Title>
              <DataTable.Title>Created On</DataTable.Title>
              <DataTable.Title style={styles.actionColumn}>Action</DataTable.Title>
            </DataTable.Header>

            {ProgramData.map((programs, index) => (
              <DataTable.Row key={programs.program_id} style={styles.tableRow}>
                <DataTable.Cell style={styles.checkboxColumn}>
                  <TouchableOpacity onPress={() => handleSelectProgram(programs.program_id)}>
                    <View style={[styles.checkbox, selectedPrograms.includes(programs.program_id) && styles.checkboxChecked]}>
                      {selectedPrograms.includes(programs.program_id) && <Icon name="check" size={16} color="#fff" />}
                    </View>
                  </TouchableOpacity>
                </DataTable.Cell>
                <DataTable.Cell style={styles.numberColumn}>{index + 1}</DataTable.Cell>
                <DataTable.Cell>{programs.program_name}</DataTable.Cell>
                <DataTable.Cell>{programs.goal_name}</DataTable.Cell>
                <DataTable.Cell>{programs.description}</DataTable.Cell>
                <DataTable.Cell>{programs.program_owner_name}</DataTable.Cell>
                <DataTable.Cell>{programs.target_year}</DataTable.Cell>
                <DataTable.Cell>{new Date(programs.created_at).toLocaleDateString()}</DataTable.Cell>
                <DataTable.Cell style={styles.actionColumn}>
                  <Menu
                    visible={programs.menuVisible}
                    onDismiss={() => {
                      const updatedIntakeData = ProgramData.map(item =>
                        item.id === programs.id
                          ? {...item, menuVisible: false}
                          : item,
                      );
                      setProgramData(updatedIntakeData);
                    }}
                    anchor={
                      <TouchableOpacity
                        onPress={event => {
                          const {pageX, pageY} = event.nativeEvent;
                          const updatedIntakeData = ProgramData.map(item =>
                            item.program_id === programs.program_id
                              ? {
                                  ...item,
                                  menuVisible: true,
                                  menuX: pageX,
                                  menuY: pageY,
                                }
                              : {...item, menuVisible: false},
                          );
                          setProgramData(updatedIntakeData);
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
                      left: programs.menuX ? programs.menuX - 140 : 0,
                      top: programs.menuY ? programs.menuY - 80 : 0,
                    }}>
                    <Menu.Item
                      onPress={() => openModal(programs)}
                      title="Edit"
                    />
                    <Menu.Item
                      onPress={() => handleDeletePress(programs.program_id)}
                      title="Delete"
                    />
                    <Menu.Item onPress={() => {}} title="Create Program" />
                  </Menu>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </View>
        
      </View>
      <CreateNewIntakeModal
        visible={modalVisible}
        onClose={closeModal}
        EditProgram={EditProgram}
        onSubmit={handleSubmit}
        CreateNewIntakeModal
      />
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  leftButtons: {
    flexDirection: 'row',
  },
  centerButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginHorizontal: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  buttonText: {
    color: '#044086',
    fontSize: 14,
  },
  buttonIcon: {
    marginRight: 5,
  },
  
  row: {
    flexDirection: 'row',
 
    // paddingVertical: 6,
    alignItems: 'center',
  },
  cell: {
    width: 120,
    fontSize: 12,
    // paddingHorizontal: 5,
    textAlign: 'center',
  },
  actionCell: {
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  cellContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  submitButton: {
    backgroundColor: '#044086',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText1: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonText2: {
    color: 'black',
    fontWeight: 'bold',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  menuContainer: {
    maxHeight: 100,
    maxWidth: 100,
  },
  buttonText6:{

  },
  headerRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    alignItems: 'center',
  },
  headerCell: {
    width: 120,
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  checkboxColumn: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
  },
  numberColumn: {
    width: 50,
   
  },
  actionColumn: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableContainer: {
    // borderWidth: 1,
    // borderColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor:'#fff',
     
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ffff',
    color:'red',
    paddingVertical: 10,
    paddingHorizontal: 5,
  
  },
  tableRow: {
    flexDirection: 'row',
  
    paddingVertical: 10,
    paddingHorizontal: 5,
 
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#757575',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#757575',
  },
  dataTable: {
    borderWidth: 0,
  },
});

export default ManagePrograms;

