import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DataTable, Menu } from 'react-native-paper';
import { TimesheetModal } from './TimeSheetModal';
import { GetResources } from '../../database/Resource';
import { ScrollView } from 'react-native-gesture-handler';
import { GetRoles } from '../../database/RoleMaster';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { InsertMember } from '../../database/ApprovedProjects';
import { useRoute } from '@react-navigation/native';

interface TeamMemberModalProps {
  visible: boolean;
  onClose: () => void;
  projectId:any;
}

export const TeamMemberModal: React.FC<TeamMemberModalProps> = ({ visible, onClose , projectId}) => {
  const [Membername, setMemberName] = useState('');
  const [role, setRole] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [memberId, setMemberId] = useState('');
  const [Priority, setPriority] = useState('');
  const [actualCost, setActualCost] = useState('');
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [isTimesheetModalVisible, setIsTimesheetModalVisible] = useState(false);
  const [isTeamMemberSubmitModalVisible, setTeamMemberSubmitModalVisible] = useState(false);
  const [members, setMembers] = useState<any[]>([]); 
  const [roles, setRoles] = useState<any[]>([]); 
  const [endDateDisplay, setEndDateDisplay] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [startDateDisplay, setStartDateDisplay] = useState('');
  const [rawStartDate, setRawStartDate] = useState(null);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [rawEndDate, setRawEndDate] = useState(null);
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: '13/04/2023', role: '05:30 AM', startDate: '05:30 AM', endDate: '6:30 AM', Description: 'Client Review Preparation, Wireframe Design', isActive: true },
    { id: 2, name: '13/04/2023', role: '05:30 AM', startDate: '05:30 AM', endDate: '6:30 AM', Description: 'Client Review Preparation, Wireframe Design', isActive: false },
  ]);

  // Fetch the members when the modal is opened
  const fetchMembers = async () => {
    try {
      const response = await GetResources('');
      console.log(response);
      const parsedRes = JSON.parse(response);
      if (parsedRes.status === 'success') {
        setMembers(parsedRes.data.resources); // Set the fetched members
      } else {
        console.error('Failed to fetch users:', parsedRes.message || 'Unknown error');
      }
    } catch (err) {
      console.log('Error Fetching Users', err);
    }
  };


  const GetRole = async () => {
    try {
      const response = await GetRoles('');
      console.log(response);
      const parsedRes = JSON.parse(response);
      if (parsedRes.status === 'success') {
        setRoles(parsedRes.data.roles); // Set the fetched members
      } else {
        console.error('Failed to fetch users:', parsedRes.message || 'Unknown error');
      }
    } catch (err) {
      console.log('Error Fetching Users', err);
    }
  };

  // Effect to trigger fetch when modal visibility changes
  useEffect(() => {
    if (visible) {
      fetchMembers();
      GetRole();
    }
    console.log("Selected Role in state:", role); 
  }, [visible]);

  
  
  
  

  const handleCloseSuccessModal = () => {
    setTeamMemberSubmitModalVisible(false);
  
  };

  const handleMemberChange = (selectedMemberId: string) => {
    console.log("Selected Member ID:", selectedMemberId); // Debugging line
    
    // Ensure the selectedMemberId is a string or number (depends on your data)
    const memberIdNumber = Number(selectedMemberId); // Convert to number if needed
    
    if (!memberIdNumber) {
      console.log("No member selected");
      return;
    }
  
    const selectedMember = members.find(member => member.resource_id === memberIdNumber);
  
    if (selectedMember) {
      console.log("Selected Member:", selectedMember);  // Log the selected member
      setMemberName(`${selectedMember.first_name} ${selectedMember.last_name}`); // Update the member name
      setMemberId(selectedMember.resource_id);
      setRole(selectedMember.role_id); 
      console.log("selecteed role",selectedMember.role_id)
    } else {
      console.log("No member found with ID:", selectedMemberId); // Debugging line if no member is found
    }
  };
  const handleDateChange = date => {
    setRawStartDate(date);
    setStartDateDisplay(format(date, 'MM-dd-yyyy'));
    setStartDate(format(date, 'yyyy-MM-dd')); // Format date for the input field
    setShowStartDatePicker(false); // Close the picker
  };
  const handleEndDateChange = date => {
    setRawEndDate(date);
    setEndDateDisplay(format(date, 'MM-dd-yyyy'));
    setEndDate(format(date, 'yyyy-MM-dd')); // Format date for the input field
    setShowEndDatePicker(false); // Close the picker
  };
  const route = useRoute();
  const {project_id} = route.params as {project_id: number};
  const handleSubmit = async () => {
    const payload = {
      project_resources_id: 0,
      project_id: projectId,
      resource_id: Number(memberId),
      role_id: Number(role),
      actual_cost: actualCost,
      start_date: startDate,
      end_date: endDate,
      availability_percentage: 0,
      is_active: true,
    };
  
    console.log('Payload:', payload);
  
    try {
      // Await the result from InsertMember
      const response = await InsertMember(payload);
      const parsedResponse = JSON.parse(response);
      // Handle the response (assuming it's a JSON object)
      if (parsedResponse && parsedResponse.status === 'success') {
        Alert.alert('Member added successfully');
       
        setTeamMemberSubmitModalVisible(true); 
      } else {
        Alert.alert('Failed to add member. Please try again.');
        setTeamMemberSubmitModalVisible(false); // Close modal on failure
      }
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error('Error submitting member:', error);
      Alert.alert('An error occurred. Please try again.');
      setTeamMemberSubmitModalVisible(false); // Close the modal on error
    }
  };
  return (
    <ScrollView>
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeading}>Team Member{/*  - Murlidharan */}</Text>
          <View style={styles.row}>
          <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>
                Member Name <Text style={styles.asterisk}>*</Text>
              </Text>

              {members.length > 0 ? (
               <Picker
               selectedValue={memberId}  // Bind Picker value to memberId
               onValueChange={handleMemberChange}  // Update memberId when a member is selected
               style={styles.input}
             >
               {/* Show default 'Select Member' only when no member is selected */}
               {memberId === "" ? (
                 <Picker.Item label="Select Member" value="" />
               ) : null}
             
               {members.map(member => (
                 <Picker.Item
                   key={member.resource_id}
                   label={`${member.first_name} ${member.last_name}`} // Display full name in Picker
                   value={member.resource_id}  // Set the resource_id as the value
                 />
               ))}
             </Picker>
              ) : (
                <Text>Loading members...</Text>
              )}
          </View>
          <View style={styles.inputContainer1}>
          <Text style={styles.inputLabel}>
                Role <Text style={styles.asterisk}>*</Text>
              </Text>
              <Picker
  style={styles.input}
  selectedValue={role}  // Bind role_id to Picker
  onValueChange={(itemValue) => {
    console.log("Selected Role ID:", itemValue); // Log the selected role ID when changed
    setRole(itemValue);  // Update role when user selects a new role
  }}
>
  <Picker.Item label="Select Role" value="" />
  {roles.length > 0 ? (
    roles.map((roleItem) => (
      <Picker.Item
        key={roleItem.role_id}
        label={roleItem.role_name}  // Role name to be displayed
        value={roleItem.role_id}    // role_id as the value
      />
    ))
  ) : (
    <Picker.Item label="Loading roles..." value="" />
  )}
</Picker>
          </View>
          <View style={styles.inputContainer1}>
            <Text style={styles.inputLabel}>
             Actual cost Budget <Text style={styles.asterisk}>*</Text>
            </Text>
            <TextInput
        style={styles.input}
        value={actualCost}
        onChangeText={setActualCost} // Update the state with the input value
        keyboardType="numeric" // Optional: restrict to numeric input
        placeholder="Enter actual cost"
      />
            {/* <Picker
              style={styles.input}
              selectedValue={Priority}
              onValueChange={(itemValue) => setRole(itemValue)}
            >
              <Picker.Item label="Select Priority" value="" />
              <Picker.Item label="Manager" value="Manager" />
              <Picker.Item label="Developer" value="Developer" />
              <Picker.Item label="Designer" value="Designer" />
            </Picker> */}
          </View>
          </View>
          <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Proposed Start Date<Text style={styles.asterisk}>*</Text></Text>
              <TextInput
  style={styles.input}
  value={startDateDisplay} // Bind to Formik's state or use custom state
  onFocus={() => setShowStartDatePicker(true)} // Open date picker on focus
  /* onBlur={handleBlur('startDate')} */ // Trigger Formik validation on blur
  placeholder="Select Start Date"
  editable={Platform.OS !== 'web'} // Disable manual input on web
/>
      {/* <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
        <Icon name="calendar-today" size={20} color="#044086" style={styles.icon} />
      </TouchableOpacity> */}
                  {/* {touched?.startDate && errors?.startDate && (
                    <Text style={{color: 'red'}}>{errors.startDate}</Text>
                  )}
 */}
      {Platform.OS === 'web' && showStartDatePicker && (
        <DatePicker
          selected={rawStartDate}
          onChange={(date) => {
            handleDateChange(date); // Handle date change
            setShowStartDatePicker(false); // Close picker
          }}
          dateFormat="MM-dd-yyyy"
          inline // Inline style for better usability
        />
      )}
          </View>
          <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Proposed End Date<Text style={styles.asterisk}>*</Text></Text>
              <TextInput
  style={styles.input}
  value={/* values.endDate || */ endDateDisplay} // Use Formik's value or custom state
  onFocus={() => setShowEndDatePicker(true)} // Open date picker on focus
 /*  onBlur={handleBlur('endDate')} */ // Trigger Formik validation on blur
  placeholder="Select End Date"
  editable={Platform.OS !== 'web'} // Disable manual input on web
/>
      {/* <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
        <Icon name="calendar-today" size={20} color="#044086" style={styles.icon} />
      </TouchableOpacity> */}
                  {/* {touched?.endDate && errors?.endDate && (
                    <Text style={{color: 'red'}}>{errors.endDate}</Text>
                  )} */}

                  {Platform.OS === 'web' && showEndDatePicker && (
                    <DatePicker
                      selected={rawEndDate}
                      onChange={handleEndDateChange}
                      dateFormat="MM-dd-yyyy"
                      inline // Inline style for better usability
                    />
                  )}
          </View>
            <TouchableOpacity style={styles.addTimeHeading}>
                        <Text style={styles.addTimeHeadingText}>TimeSheet</Text>
                      </TouchableOpacity>
                      <View style={styles.buttonRow}>
                                    <View style={styles.rightButtons}>
                                      <TouchableOpacity style={styles.deleteButton}>
                                        <Icon name="delete" size={16} color="#C4C4C4" />
                                        <Text style={styles.deleteButtonText}>Delete</Text>
                                      </TouchableOpacity>
                      
                                      <TouchableOpacity style={styles.addMemberButton}  onPress={()=>setIsTimesheetModalVisible(true)}>
                                        <Icon name="plus" size={16} color="#044086" />
                                        <Text style={styles.addMemberButtonText}>Add New</Text>
                                     
                                      <Modal visible={isTimesheetModalVisible} onDismiss={() => setIsTimesheetModalVisible(false)}>
                                      <TimesheetModal
  visible={isTimesheetModalVisible}
  onClose={() => setIsTimesheetModalVisible(false)}
  onSubmit={() => {
    console.log('Submit action triggered');
    setIsTimesheetModalVisible(false);
  }}
/>

      </Modal></TouchableOpacity>
                                    </View>
                                  </View>
                                  <View style={styles.container}>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title style={styles.tableCell}>S.No.</DataTable.Title>
          <DataTable.Title style={styles.tableCell}>Date</DataTable.Title>
          <DataTable.Title style={styles.tableCell}>Start Time</DataTable.Title>
          <DataTable.Title style={styles.tableCell}>End Time</DataTable.Title>
          <DataTable.Title style={styles.tableCell}>Description</DataTable.Title>
          <DataTable.Title style={styles.tableCell}>Action</DataTable.Title>
        </DataTable.Header>

        {teamMembers.map((member, index) => (
          <DataTable.Row key={member.id}>
            <DataTable.Cell style={styles.tableCell}>{index + 1}</DataTable.Cell>
            <DataTable.Cell style={styles.tableCell}>{member.name}</DataTable.Cell>
            <DataTable.Cell style={styles.tableCell}>{member.role}</DataTable.Cell>
            <DataTable.Cell style={styles.tableCell}>{member.startDate}</DataTable.Cell>
            <DataTable.Cell style={styles.tableCell}>{member.endDate}</DataTable.Cell>
            <DataTable.Cell style={styles.tableCell}>
            {member.Description}
            </DataTable.Cell>
            <DataTable.Cell style={styles.tableCell}>
              <View style={styles.actionCell}>
              <Menu
                  visible={activeMenu === member.id}
                  onDismiss={() => setActiveMenu(null)}
                  anchor={<TouchableOpacity onPress={() => setActiveMenu(activeMenu === member.id ? null : member.id)}>
                    <Icon name="dots-vertical" size={20} color="#667085" />
                  </TouchableOpacity>} children={undefined}>
  {/* Menu content goes here */}
</Menu>

              </View>
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
           <Modal visible={isTeamMemberSubmitModalVisible} transparent animationType="fade">
                  <View style={styles.modalOverlay}>
                    <View style={styles.successModalContent}>
                      <Text style={styles.successModalText}>TeamMember submitted successfully</Text>
                      <TouchableOpacity style={styles.okButton} onPress={() => {
    handleCloseSuccessModal();
    onClose(); 
  }}>
                        <Text style={styles.okButtonText}>OK</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
          </View>
         
        </View>
      </View>
    </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '100%',
    maxWidth: 720,
  },
  modalContainerT: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    width:'100%',
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
  },
  successModalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  successModalText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
  },
  okButton: {
    backgroundColor: '#044086',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  okButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 16,
  },
   closeButtonT: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#044486',
    // backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    width:'20%',
    marginTop:20

  },
  closeButtonTextT: {
    color: '#044486',
    fontWeight: 'bold',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  asterisk: {
    color: '#C70B0B',
  },
  input: {
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1.5,
    borderBottomColor: '#044086',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 10,
  },
  cancelButton: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#C4C4C4',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    color: '#232323',
    fontSize: 14,
    fontWeight: '400',
  },
  submitButton: {
    borderRadius: 7,
    backgroundColor: '#044086',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
    marginTop:16
  },
  addTimeHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 20,
  },
  addTimeHeadingText: {
    color: '#044086',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 20,
  },
  rightButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  deleteButtonText: {
    color: '#C4C4C4',
    fontFamily: 'Inter',
    fontSize: 14
  },
  addMemberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  addMemberButtonText: {
    color: '#044086',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter'
  },
  inputContainer1:{
    width:220
  },
  container: {
    marginTop: 20,
  },
  tableCell: {
    justifyContent: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF3',
    borderRadius: 16,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  badgeText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  activeText: {
    color: '#027A48',
  },
  inactiveText: {
    color: '#B42318',
  },
  actionCell: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  menuText: {
    fontSize: 14,
  },
});

