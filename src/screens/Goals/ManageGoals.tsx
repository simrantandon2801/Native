



import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView, Alert } from 'react-native';
import { Checkbox, Menu, Provider as PaperProvider, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import { GetGoals,  InsertGoal } from '../../database/Goals';
interface CreateNewIntakeModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (newGoal: any) => void; 
}
const CreateNewIntakeModal: React.FC<CreateNewIntakeModalProps> = ({ visible, onClose, onSubmit }) => {
 
  const [selectedStakeholder, setSelectedStakeholder] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedGoalOwner, setSelectedGoalOwner] = useState('');
  const [goalName, setGoalName] = useState('');
  const [description, setDescription] = useState('');
  const [intakeData, setIntakeData] = useState<any[]>([]);
  
  
  const handleSubmit = async () => {
    if (goalName && selectedStatus && selectedGoalOwner && description && selectedStakeholder && selectedYear) {
      const newGoal = {
        goal_name: goalName,
        description,
        stakeholders: selectedStakeholder,
        goal_owner: selectedGoalOwner,
        target_year: selectedYear,
        start_date: new Date().toISOString(),
        end_date: new Date().toISOString(),  
        status: selectedStatus,
      };
      console.log(newGoal)
      try {
        // Call the Insert_goal API function
        const response = await InsertGoal(newGoal);
       const parsedResponse = JSON.parse(response)
       
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
 
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Add New Strategic Goal</Text>
          <View style={styles.modalContent}>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  Name/Title <Text style={styles.asterisk}>*</Text>
                </Text>
                <TextInput style={styles.input} 
                value={goalName}
                onChangeText={setGoalName}/>
              </View>
            </View>
            <View style={styles.inputRow}>
    
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>
          Status <Text style={styles.asterisk}>*</Text>
        </Text>
        {/* <TextInput style={styles.input} /> */}
          <Picker
           selectedValue={selectedStatus}
           onValueChange={(itemValue) => setSelectedStatus(itemValue)}
           style={styles.input}
          >
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
        {/* <TextInput style={styles.input} /> */}
          <Picker
            selectedValue={selectedGoalOwner}
            onValueChange={(itemValue) => setSelectedGoalOwner(itemValue)}
            style={styles.input}
          >
            <Picker.Item label="Select Goal Owner" value="" />
            <Picker.Item label="John Doe" value="johnDoe" />
            <Picker.Item label="Jane Smith" value="janeSmith" />
            <Picker.Item label="Mark Johnson" value="markJohnson" />
          </Picker>
    
      </View>
    </View>
            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, styles.fullWidth]}>
                <Text style={styles.inputLabel}>Description 
                  <Text style={styles.asterisk}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                />
              </View>
            </View>
            <View style={styles.inputRow}>
      {/* Impacted Stakeholders Dropdown */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>
          Impacted Stakeholders <Text style={styles.asterisk}>*</Text>
        </Text>
        
        {/* <TextInput style={styles.input} /> */}
          <Picker
            selectedValue={selectedStakeholder}
            onValueChange={(itemValue) => setSelectedStakeholder(itemValue)}
            style={styles.input}
          >
            <Picker.Item label="Select Stakeholders" value="" />
            <Picker.Item label="Team A" value="teamA" />
            <Picker.Item label="Team B" value="teamB" />
            <Picker.Item label="Team C" value="teamC" />
          </Picker>
      
      </View>

      {/* Target Year Dropdown */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>
          Target Year <Text style={styles.asterisk}>*</Text>
        </Text>
       
        {/* <TextInput style={styles.input} /> */}
          <Picker
            selectedValue={selectedYear}
            onValueChange={(itemValue) => setSelectedYear(itemValue)}
            style={styles.input}
          >
            <Picker.Item label="Select Year" value="" />
            <Picker.Item label="2024" value="2024" />
            <Picker.Item label="2025" value="2025" />
            <Picker.Item label="2026" value="2026" />
          </Picker>
     
      </View>
    </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText2}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
              <Text style={styles.buttonText1}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const ManageGoals: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [goalData, setGoalData] = useState<any[]>([]);
  const fetchGoals = async () => {
    try {
      const response = await GetGoals('');
      console.log("unparsed Response:", response);
      const result = JSON.parse(response);
      //const result = await JSON.parse(response);

      console.log("API Response:", result);
      if (result?.data?.goals && Array.isArray(result.data.goals)) {
        setGoalData(result.data.goals);  // Set the goals array from the data object
      } else {
        console.error("Invalid goals data");
        Alert.alert("Error", "Invalid goals data received");
      }
    
     
    } catch (error) {
      console.error("Error fetching departments:", error);
      Alert.alert("Error", "Failed to fetch departments");
    }
  };
  useEffect(() => {
    fetchGoals();
   
  }, []);



  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.heading}>Strategic Goals</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={openModal}>
            <Text style={styles.buttonText}>
              <Icon name="plus" size={14} color="#044086" style={styles.buttonIcon} /> Create New
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <View style={styles.buttonContent}>
              <Icon name="table-column-plus-after" size={18} color="#044086" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Set Column</Text>
            </View>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            <View style={styles.headerRow}>
              {['', 'S.No.', 'ID', 'Goal', 'Description', 'Impacted Stakeholders', 'Goal Owner', 'Target year', 'Created On', 'Status', 'Action'].map((header, index) => (
                <Text key={index} style={styles.headerCell}>{header}</Text>
              ))}
            </View>
            <ScrollView>
            {goalData.map((goal, index) => (
          <View key={goal.goal_id} style={styles.row}>
                  <View style={styles.cell}>
                    <Checkbox status="unchecked" />
                  </View>
                  <Text style={styles.cell}>{index + 1}</Text>
                  <Text style={styles.cell}>{goal.goal_id}</Text>
                  <Text style={styles.cell}>{goal.goal_name}</Text>
                  <Text style={styles.cell} numberOfLines={1} ellipsizeMode="tail">{goal.description}</Text>
                  <Text style={styles.cell}>{goal.stakeholders}</Text>
                  <Text style={styles.cell}>{goal.goal_owner}</Text>
                  <Text style={styles.cell}>{goal.target_year}</Text>
                  <Text style={styles.cell}>{new Date(goal.created_at).toLocaleDateString()}</Text>
                  <Text style={styles.cell}>{goal.status}</Text>
                  <View style={[styles.cell, styles.actionCell]}>
                    <Menu
                      visible={goal.menuVisible}
                      onDismiss={() => {
                        const updatedGoalData = goalData.map(item =>
                          item.goal_id === goal.goal_id ? { ...item, menuVisible: false } : item
                        );
                        setGoalData(updatedGoalData);
                      }}
                      anchor={
                        <TouchableOpacity
                          onPress={(event) => {
                            const { pageX, pageY } = event.nativeEvent;
                            const updatedIntakeData = goalData.map(item =>
                              item.goal_id === goal.goal_id
                                ? { ...item, menuVisible: true, menuX: pageX, menuY: pageY }
                                : { ...item, menuVisible: false }
                            );
                            setGoalData(updatedIntakeData);
                          }}
                        >
                          <IconButton icon="dots-vertical" size={20} style={{ margin: 0, padding: 0 }} />
                        </TouchableOpacity>
                      }
                      style={{
                        position: 'absolute',
                        left: goal.menuX ? goal.menuX - 120 : 0, // Adjust left position
                        top: goal.menuY ? goal.menuY - 40 : 0, // Adjust top position to appear higher
                      }}
                    >
                      <Menu.Item onPress={() => {}} title="Edit" />
                      <Menu.Item onPress={() => {}} title="Delete" />
                      <Menu.Item onPress={() => {}} title="Create Program" />
                    </Menu>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
      <CreateNewIntakeModal visible={modalVisible} onClose={closeModal} />
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
  },
  headerCell: {
    width: 120,
    fontWeight: 'bold',
    fontSize: 12,
    paddingHorizontal: 5,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 6,
  },
  cell: {
    width: 120,
    fontSize: 12,
    paddingHorizontal: 5,
  },
  actionCell: {
    justifyContent: 'center',
    // alignItems: 'center',
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
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  // input: {
  //   borderBottomWidth: 1,
  //    borderBottomColor: '#044086',
  //   borderBottomLeftRadius: 5,
  //   borderBottomRightRadius: 5,
  //   padding: 8,
  //   fontSize: 14,
  // },
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
    width: '100%', // Ensures input takes up the full width of the container
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
  // dropdown: {
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#ccc',
  //   borderRadius: 5,
  //   overflow: 'hidden',
  // },
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
    // height: 100,
    textAlignVertical: 'top',
  },
  fullWidth: {
    // flex: 1,
    // marginHorizontal: 5,
  },
  menuContainer: {
    maxHeight: 100, 
    maxWidth: 100,
  },
});

export default ManageGoals;

