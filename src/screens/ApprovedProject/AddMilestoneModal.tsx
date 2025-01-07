import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DataTable, Menu } from 'react-native-paper';
import { AddMemberModal } from './AddMemberModal';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { GetMilestones, GetMilestonesResource, InsertMilestone } from '../../database/ApprovedProjects';
import { useFocusEffect } from '@react-navigation/native';

interface AddMilestoneModalProps {
  visible: boolean;
  onClose: () => void;
  projectId:any;
  milestone:any;
  isEditable:any;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  startDate: string;
  isActive: boolean;
}

interface MilestoneData {
  name: string;
  shortName: string;
  priority: string;
  description: string;
  proposedStartDate: string;
  proposedEndDate: string;
  projectId:any,
  milestone_id: string;
}

export const AddMilestoneModal: React.FC<AddMilestoneModalProps> = ({ visible, onClose, projectId,milestone,isEditable }) => {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [isMilestoneSubmitModalVisible, setMilestoneSubmitModalVisible] = useState(false);
  const [startDateDisplay, setStartDateDisplay] = useState('');
  const [startDate, setStartDate] = useState('');
  const [rawStartDate, setRawStartDate] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [rawEndDate, setRawEndDate] = useState(null);
  const [endDateDisplay, setEndDateDisplay] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [milestoneData, setMilestoneData] = useState<MilestoneData>({
    name: '',
    shortName: '',
    priority: '',
    description: '',
    proposedStartDate: '',
    proposedEndDate: '',
    projectId:'',
    milestone_id :'',
  });
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
  useEffect(() => {
    console.log("isEditing:", isEditing);  // Logs the value of isEditing
    console.log("isMilestoneModalVisible:", visible); // Logs the modal visibility
  }, [isEditing, visible]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [milestoneRes, setmilestoneRes] = useState<any[]>([]);
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
  const [isAddMemberModalVisible, setAddMemberModalVisible] = useState(false);
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: 1, name: 'John Doe', role: 'Manager', startDate: '2023-12-01', isActive: true },
    { id: 2, name: 'Jane Smith', role: 'Developer', startDate: '2023-12-10', isActive: false },
  ]);

  const handleInputChange = (field: keyof MilestoneData, value: string) => {
    setMilestoneData(prev => ({ ...prev, [field]: value }));
  };
  useEffect(() => {
    if (milestone) {
      console.log('Prefilling milestone data:', milestone);  
      setMilestoneData({
        milestone_id: milestone.milestone_id,  
        projectId: milestone.project_id || '',  
        name: milestone.milestone_name,
        shortName: milestone.short_name, 
        priority: milestone.priority,
        description: milestone.description,
        proposedStartDate: milestone.start_date,
        proposedEndDate: milestone.end_date,
      });
  
      setStartDateDisplay(milestone.start_date);
      setEndDateDisplay(milestone.end_date);
      setStartDate(milestone.start_date);
      setEndDate(milestone.end_date);
      setIsEditing(isEditable)
    }
  },  [milestone, isEditable]);
  const handleSubmit = async () => {
    // Construct payload for milestone data
    const payload = {
        project_id:projectId,
        short_name:milestoneData.shortName,
        milestone_name: milestoneData.name,
        /* shortName: milestoneData.shortName, */
        priority: milestoneData.priority,
        description: milestoneData.description,
        start_date: startDate,
        end_date: endDate,
        milestone_id: milestoneData.milestone_id || '',
     
    };
    
    console.log('Payload to be sent:', payload);
    try {
        // Await the result from InsertMember
        const response = await InsertMilestone(payload);
        const parsedResponse = JSON.parse(response);
        // Handle the response (assuming it's a JSON object)
        if (parsedResponse && parsedResponse.status === 'success') {
          Alert.alert('Member added successfully');
         
          setMilestoneSubmitModalVisible(true); 
        } else {
          Alert.alert('Failed to add member. Please try again.');
          setMilestoneSubmitModalVisible(false); 
        }
      } catch (error) {
        // Handle any errors that occur during the API call
        console.error('Error submitting member:', error);
        Alert.alert('An error occurred. Please try again.');
        setMilestoneSubmitModalVisible(false); 
      }

   
  };

  
  const handleCloseSuccessModal = () => {
    setMilestoneSubmitModalVisible(false);
    onClose();
  };

  const handleRemoveMember = (id: number) => {
    setTeamMembers(prev => prev.filter(member => member.id !== id));
    setActiveMenu(null);
  };

  const handleAddMember = (memberData: Omit<TeamMember, 'id'>) => {
    setTeamMembers(prev => [...prev, { id: prev.length + 1, ...memberData }]);
  };


  const FetchMilestones = async (projectId) => {
    try {
      const response = await GetMilestones(projectId); // Pass projectId here
      const parsedRes = JSON.parse(response);
      console.log('Get Projects Response:', response);
  
      if (parsedRes?.status === 'success' && Array.isArray(parsedRes.data)) {
        setMilestones(parsedRes.data);  // Update the state with the fetched data
      } else {
        console.error('Invalid or empty data');
        Alert.alert('Error', 'Invalid or empty data');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      Alert.alert('Error', 'Failed to fetch projects');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Fetch data or refresh the screen every time it gains focus
      FetchMilestones(projectId);
      FetchMilestonesRes();
    }, [])
  );   
  const handleAddMemberClick = () => {
    const milestoneId = milestoneData.milestone_id ;
  
    // Save milestone_id before opening the modal
    setSelectedMilestone(milestoneId);
    
    console.log('Selected Milestone ID for Add Member:', milestoneId);  
    
    // Now show the modal
    setAddMemberModalVisible(true);
  };

  const FetchMilestonesRes = async () => {
    // Create the payload before the try block
    const payload = {
      milestone_id: milestoneData.milestone_id,  
      project_id: projectId,     
    };
  
    try {
     
      const response = await GetMilestonesResource(payload); 
      const parsedRes = JSON.parse(response);
  
      console.log('Get Projects Response:', parsedRes);
  
      if (parsedRes?.status === 'success' && Array.isArray(parsedRes.data)) {
        // Set the fetched data in the state
        setMilestones(parsedRes.data);
      } else {
        console.error('Invalid or empty data');
        Alert.alert('Error', 'Invalid or empty data');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      Alert.alert('Error', 'Failed to fetch projects');
    }
  };
  
  
  return (
    <Modal visible={visible} transparent animationType="fade">
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalHeading}>Add New Milestone</Text>
        <View>
          {/* First Row */}
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Name/Title <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput 
                style={styles.input} 
                value={milestoneData.name}
                onChangeText={(value) => handleInputChange('name', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Short/Custom Name <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput 
                style={styles.input} 
                value={milestoneData.shortName}
                onChangeText={(value) => handleInputChange('shortName', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Priority <Text style={styles.asterisk}>*</Text>
              </Text>
              <Picker
                style={styles.input}
                selectedValue={milestoneData.priority}
                onValueChange={(value) => handleInputChange('priority', value)}
              >
                <Picker.Item label="Select Priority" value="" />
                <Picker.Item label="High" value="3" />
                <Picker.Item label="Medium" value="2" />
                <Picker.Item label="Low" value="1" />
              </Picker>
            </View>
          </View>

          {/* Description */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Description <Text style={styles.asterisk}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={milestoneData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              multiline
            />
          </View>

         
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Proposed Start Date <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
  style={styles.input}
  value={startDateDisplay} // Bind to Formik's state or use custom state
  onFocus={() => setShowStartDatePicker(true)} // Open date picker on focus
  
  placeholder="Select Start Date"
  editable={Platform.OS !== 'web'} // Disable manual input on web
/>
      {/* <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
        <Icon name="calendar-today" size={20} color="#044086" style={styles.icon} />
      </TouchableOpacity> */}
                 {/*  {touched?.startDate && errors?.startDate && (
                    <Text style={{color: 'red'}}>{errors.startDate}</Text>
                  )} */}

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
              <Text style={styles.inputLabel}>
                Proposed End Date <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
  style={styles.input}
  value={ endDateDisplay} // Use Formik's value or custom state
  onFocus={() => setShowEndDatePicker(true)} // Open date picker on focus
  
  placeholder="Select End Date"
  editable={Platform.OS !== 'web'} // Disable manual input on web
/>
      {/* <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
        <Icon name="calendar-today" size={20} color="#044086" style={styles.icon} />
      </TouchableOpacity> */}
                 {/*  {touched?.endDate && errors?.endDate && (
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
          </View>

          <TouchableOpacity style={styles.addTeamHeading}>
            <Text style={styles.addTeamHeadingText}>Add Team Members</Text>
          </TouchableOpacity>

          <View style={styles.buttonRow}>
            <View style={styles.rightButtons}>
              <TouchableOpacity style={styles.deleteButton}>
                <Icon name="delete" size={16} color="#C4C4C4" />
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>

              <TouchableOpacity
  style={styles.addMemberButton}
  onPress={() => {
    handleAddMemberClick ();
   
    console.log('Selected Milestone for Add Member now :', selectedMilestone);
    /* setAddMemberModalVisible(true)  */
   
  }}
>
<Icon name="plus" size={16} color="#044086" />
  <Text style={styles.addMemberButtonText}>Add Member</Text>
</TouchableOpacity>
            </View>
          </View>

          <AddMemberModal
            visible={isAddMemberModalVisible}
            onClose={() => setAddMemberModalVisible(false)}
            onSubmit={handleAddMember}
            milestone={selectedMilestone}  
            projectId={projectId}
          />

          <View style={styles.container}>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title style={styles.tableCell}>S.No.</DataTable.Title>
                <DataTable.Title style={styles.tableCell}>Member Name</DataTable.Title>
                <DataTable.Title style={styles.tableCell}>Role</DataTable.Title>
                <DataTable.Title style={styles.tableCell}>Proposed Start Date</DataTable.Title>
                <DataTable.Title style={styles.tableCell}>Active/Inactive</DataTable.Title>
                <DataTable.Title style={styles.tableCell}>Action</DataTable.Title>
              </DataTable.Header>

              {teamMembers.map((member, index) => (
                <DataTable.Row key={member.id}>
                  <DataTable.Cell style={styles.tableCell}>{index + 1}</DataTable.Cell>
                  <DataTable.Cell style={styles.tableCell}>{member.name}</DataTable.Cell>
                  <DataTable.Cell style={styles.tableCell}>{member.role}</DataTable.Cell>
                  <DataTable.Cell style={styles.tableCell}>{member.startDate}</DataTable.Cell>
                  <DataTable.Cell style={styles.tableCell}>
                    <View style={styles.badge}>
                      <Icon 
                        name="circle" 
                        size={12} 
                        color={member.isActive ? "#027A48" : "#B42318"} 
                      />
                      <Text style={[
                        styles.badgeText,
                        member.isActive ? styles.activeText : styles.inactiveText
                      ]}>
                        {member.isActive ? "Active" : "Inactive"}
                      </Text>
                    </View>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.tableCell}>
                    <View style={styles.actionCell}>
                      <Menu
                        visible={activeMenu === member.id}
                        onDismiss={() => setActiveMenu(null)}
                        anchor={
                          <TouchableOpacity onPress={() => setActiveMenu(activeMenu === member.id ? null : member.id)}>
                            <Icon name="dots-vertical" size={20} color="#667085" />
                          </TouchableOpacity>
                        }
                      >
                        <Menu.Item 
                          onPress={() => handleRemoveMember(member.id)} 
                          title="Remove"
                          titleStyle={styles.menuText}
                        />
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
            

            {isEditable && (
  <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
    <Text style={styles.submitButtonText}>Save</Text>
  </TouchableOpacity>
)}

          </View>

          <Modal visible={isMilestoneSubmitModalVisible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.successModalContent}>
                <Text style={styles.successModalText}>Milestone submitted successfully</Text>
                <TouchableOpacity style={styles.okButton} onPress={handleCloseSuccessModal}>
                  <Text style={styles.okButtonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </View>
  </Modal>
   
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
    padding: 30,
    width: '60%',
    height: '90%',
    maxWidth: 1200,
    overflow: 'auto',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
  },
  modalHeading: {
    color: '#000',
    fontFamily: 'Outfit',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    textTransform: 'capitalize',
    marginBottom: 20,
    textAlign:'center'
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
    marginTop:16
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#000',
  },
  asterisk: {
    color: '#C70B0B',
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
  textArea: {
    textAlignVertical: 'top',
   
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
  addTeamHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 20,
  },
  addTeamHeadingText: {
    color: '#044086',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter'
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
  container: {
    padding: 16,
  },
  tableCell: {
    flex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingVertical: 2,
    // paddingHorizontal: 8,
    borderRadius: 16,
    alignSelf: 'center',
    gap: 4,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeText: {
    color: '#232323',
  },
  inactiveText: {
    color: '#232323',
  },
  actionCell: {
    position: 'relative',
  },
  actionButton: {
    padding: 8,
  },

  menuItem: {
    padding: 8,
    minWidth: 100,
  },
  menuText: {
    fontSize: 14,
    color: '#B42318',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 10,
  },
  submitButton: {
    borderRadius: 7.693,
    borderWidth: 0.962,
    borderColor: '#044086',
    backgroundColor: '#044086',
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: 'rgba(16, 24, 40, 0.05)',
    shadowOffset: { width: 0, height: 0.962 },
    shadowRadius: 1.923,
    shadowOpacity: 1,
  },
  submitButtonText: {
    color: '#FFF',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 22,
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
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
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
 
 
});