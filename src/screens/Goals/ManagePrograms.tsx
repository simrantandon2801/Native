import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert, useWindowDimensions
} from 'react-native';
import {
  Checkbox,
  Menu,
  Provider as PaperProvider,
  IconButton,
  DataTable,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import {
  DeleteProgram,
  GetPrograms,
  InsertProgram,
} from '../../database/ManageProgram';
import { GetGoals } from '../../database/Goals';
import NestedDeptDropdownPrograms from '../../modals/NestedDropdownPrograms';

interface CreateNewIntakeModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (programDataToSubmit: any) => void;
  EditProgram?: any;
  reloadParent?: () => void;
}



const CreateNewIntakeModal: React.FC<CreateNewIntakeModalProps> = ({
  visible,
  onClose,
  onSubmit,
  EditProgram,
  
}) => {
  const [selectedProgramOwner, setSelectedProgramOwner] = useState<number>(-1);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedApprovalReqd, setSelectedApprovalReqd] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [selectedApprovalStatus, setSelectedApprovalStatus] = useState('');
  const [Programname, setProgramname] = useState('');
  const [Description, setDescription] = useState('');
  const [programId, setprogramId] = useState<string | undefined>(undefined);
  const [goalData, setGoalData] = useState([]);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  useEffect(() => {
    console.log('Edit Program:', EditProgram);
    if (EditProgram) {
      setprogramId(EditProgram.program_id);
      setProgramname(EditProgram.program_name || '');
      setDescription(EditProgram.description || '');
      setSelectedYear(EditProgram.target_year || '');
      setSelectedStatus(EditProgram.status || '');
      setSelectedProgramOwner(EditProgram.program_owner || '');
    } else {
      setprogramId(undefined);
      setProgramname('');
      setDescription('');
      setSelectedYear('');
      setSelectedStatus('');
      setSelectedProgramOwner('');
    }
  }, [EditProgram]);


  const handleSubmit = async () => {
    console.log('Submit inside modal triggered');
    if (!Programname || !Description) {
      Alert.alert('Error', 'Please fill out all required fields.');
      return;
    }
    const programDataToSubmit = {
      program_id: programId,
      program_name: Programname,
      description: Description,
      program_owner: selectedProgramOwner,
      target_year: selectedYear,
      goal_id: selectedGoal,
      status: selectedStatus,
      year: selectedYear,
      approvalReqd: selectedApprovalReqd,
      approvalStatus: selectedApprovalStatus,
    };
    console.log(programDataToSubmit);

    try {
      const response = await InsertProgram(programDataToSubmit);
      const parsedResponse = JSON.parse(response);

      if (parsedResponse.status === 'success') {

        Alert.alert('Goal created successfully');
        onSubmit(programDataToSubmit);
        onClose(); // Close the modal after successful submission
        
       
      } else {
        Alert.alert('Failed to create goal. Please try again.');
        onClose();
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      Alert.alert('An error occurred. Please try again.');
    }
  };

  const fetchGoals = async () => {
    try {
      const response = await GetGoals('');
      const result = JSON.parse(response);

      if (result?.data?.goals && Array.isArray(result.data.goals)) {
        setGoalData(result.data.goals);
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

  useEffect(() => {
    fetchGoals();
  }, []);
  const { width: screenWidth } = useWindowDimensions();
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Add New Strategic Programs</Text>
          <ScrollView
            style={styles.modalScrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.modalContentContainer}>
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
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>
                    Goals <Text style={styles.asterisk}>*</Text>
                  </Text>
                  <Picker
                    selectedValue={selectedGoal}
                    onValueChange={(itemValue) => setSelectedGoal(itemValue)}
                    style={styles.input}>
                    <Picker.Item label="Select Goal" value="" />
                    {goalData.length > 0 ? (
                      goalData.map((goal) => (
                        <Picker.Item
                          key={goal.goal_id}
                          label={goal.goal_name}
                          value={goal.goal_id.toString()}
                        />
                      ))
                    ) : (
                      <Picker.Item label="No Goals Available" value="" />
                    )}
                  </Picker>
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Program Owner</Text>
                  <NestedDeptDropdownPrograms
                    onSelect={handleDeptSelect}
                    EditProgram={EditProgram}
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
                    value={Description}
                    onChangeText={setDescription}
                 
                  />
                </View>
              </View>
              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Target Year</Text>
                  <Picker
                    selectedValue={selectedYear}
                    onValueChange={(itemValue) => setSelectedYear(itemValue)}
                    style={styles.input}>
                    <Picker.Item label="Select Year" value="" />
                    <Picker.Item label="2024" value="2024" />
                    <Picker.Item label="2025" value="2025" />
                    <Picker.Item label="2026" value="2026" />
                  </Picker>
                </View>
              </View>
            </View>
          </ScrollView>
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

  const fetchPrograms = async () => {
    try {
      const response = await GetPrograms('');
      console.log('unparsed Response:', response);
      const result = JSON.parse(response);

      console.log('API Response:', result);
      if (result?.data?.programs && Array.isArray(result.data.programs)) {
        setProgramData(result.data.programs);
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

  const handleDeletePress = (program_id) => {
    console.log(program_id);
    HandleDeleteProgram(program_id);
  };

  const HandleDeleteProgram = async (program_id) => {
    console.log('Deleting program with ID:', program_id);
    const GoalDel = {
      program_id: program_id,
    };
    try {
      const response = await DeleteProgram(GoalDel);
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
          program.program_id === EditProgram.program_id ? {...program, ...programDataToSubmit} : program,
        ),
      );
    } else {
      setProgramData((prevData) => [...prevData, programDataToSubmit]);
    }
    fetchPrograms();
  };
const { width: screenWidth } = useWindowDimensions();
  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.heading}>Strategic Programs</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => openModal()}>
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
        </View>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>S.No.</DataTable.Title>
              <DataTable.Title>Program Name</DataTable.Title>
              <DataTable.Title>Goal</DataTable.Title>
              <DataTable.Title>Description</DataTable.Title>
              <DataTable.Title>Program Owner</DataTable.Title>
              <DataTable.Title>Target year</DataTable.Title>
              <DataTable.Title>Created On</DataTable.Title>
              <DataTable.Title>Action</DataTable.Title>
            </DataTable.Header>

            {ProgramData.map((programs, index) => (
              <DataTable.Row key={programs.program_id}>
                <DataTable.Cell>{index + 1}</DataTable.Cell>
                <DataTable.Cell>{programs.program_name}</DataTable.Cell>
                <DataTable.Cell>{programs.goal_name}</DataTable.Cell>
                <DataTable.Cell>{programs.description}</DataTable.Cell>
                <DataTable.Cell>{programs.program_owner_name}</DataTable.Cell>
                <DataTable.Cell>{programs.target_year}</DataTable.Cell>
                <DataTable.Cell>
                  {new Date(programs.created_at).toLocaleDateString()}
                </DataTable.Cell>
                <DataTable.Cell>
                  <Menu
                    visible={programs.menuVisible}
                    onDismiss={() => {
                      const updatedIntakeData = ProgramData.map((item) =>
                        item.id === programs.id
                          ? { ...item, menuVisible: false }
                          : item
                      );
                      setProgramData(updatedIntakeData);
                    }}
                    anchor={
                      <TouchableOpacity
                        onPress={(event) => {
                          const { pageX, pageY } = event.nativeEvent;
                          const updatedIntakeData = ProgramData.map((item) =>
                            item.program_id === programs.program_id
                              ? {
                                  ...item,
                                  menuVisible: true,
                                  menuX: pageX,
                                  menuY: pageY,
                                }
                              : { ...item, menuVisible: false }
                          );
                          setProgramData(updatedIntakeData);
                        }}>
                        <IconButton
                          icon="dots-vertical"
                          size={20}
                          style={{ margin: 0, padding: 0 }}
                        />
                      </TouchableOpacity>
                    }
                    style={{
                     
                      left:screenWidth-390,
                       top: 150,
                       flexGrow: 1,
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
        </ScrollView>
      </View>
      <CreateNewIntakeModal
        visible={modalVisible}
        onClose={closeModal}
        EditProgram={EditProgram}
        onSubmit={handleSubmit}
        
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
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
  scrollView: {
    flex: 1,
    backgroundColor:'#fff'
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
    maxHeight: '80%',
  },
  modalScrollView: {
    flexGrow: 1,
  },
  modalContentContainer: {
    flexGrow: 1,
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
    width: '100%',
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
  textArea: {
    textAlignVertical: 'top',
   
  },
  fullWidth: {
    width: '100%',
  },
});

export default ManagePrograms;
