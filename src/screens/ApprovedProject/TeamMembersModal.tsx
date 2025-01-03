import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DataTable, Menu } from 'react-native-paper';
import { TimesheetModal } from './TimeSheetModal';

interface TeamMemberModalProps {
  visible: boolean;
  onClose: () => void;
}

 export const TeamMemberModal: React.FC<TeamMemberModalProps> = ({ visible, onClose }) => {
  const [Membername, setMemberName] = useState('');
  const [role, setRole] = useState('');
  const [startDate, setStartDate] = useState('');
  const[endDate,setendDate]=useState('')

  const [Priority, setPriority] = useState('');
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [isTimesheetModalVisible, setIsTimesheetModalVisible] = useState(false);
  const [isTeamMemberSubmitModalVisible, setTeamMemberSubmitModalVisible] = useState(false);

  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: '13/04/2023', role: '05:30 AM', startDate: '05:30 AM',endDate: '6:30Am' ,Description:'Client Review Preparation, Wireframe Design',isActive:true},
    { id: 2, name: '13/04/2023', role: '05:30 AM', startDate: '05:30 AM', endDate:'6:30am' ,Description:'Client Review Preparation, Wireframe Design',isActive:false},
  ]);
  const handleSubmit = () => {
  
    console.log('New team member:', { Membername, role, Priority  });
    setTeamMemberSubmitModalVisible(true);
   
    
  };
  const handleCloseSuccessModal = () => {
    setTeamMemberSubmitModalVisible(false);
  };
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeading}>Team Member - Murlidharan</Text>
          <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
               Member Name <Text style={styles.asterisk}>*</Text>
            </Text>
            <TextInput 
              style={styles.input} 
              value={Membername}
              onChangeText={setMemberName}
            />
          </View>
          <View style={styles.inputContainer1}>
            <Text style={styles.inputLabel}>
              Role <Text style={styles.asterisk}>*</Text>
            </Text>
            <Picker
              style={styles.input}
              selectedValue={role}
              onValueChange={(itemValue) => setRole(itemValue)}
            >
              <Picker.Item label="Select Role" value="" />
              <Picker.Item label="Manager" value="Manager" />
              <Picker.Item label="Developer" value="Developer" />
              <Picker.Item label="Designer" value="Designer" />
            </Picker>
          </View>
          <View style={styles.inputContainer1}>
            <Text style={styles.inputLabel}>
              Priority <Text style={styles.asterisk}>*</Text>
            </Text>
            <Picker
              style={styles.input}
              selectedValue={Priority}
              onValueChange={(itemValue) => setRole(itemValue)}
            >
              <Picker.Item label="Select Priority" value="" />
              <Picker.Item label="Manager" value="Manager" />
              <Picker.Item label="Developer" value="Developer" />
              <Picker.Item label="Designer" value="Designer" />
            </Picker>
          </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
               Proposed Start Date <Text style={styles.asterisk}>*</Text>
            </Text>
            <TextInput 
              style={styles.input} 
              value={startDate}
              onChangeText={setStartDate}
              placeholder="YYYY-MM-DD"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
               Proposed End Date <Text style={styles.asterisk}>*</Text>
            </Text>
            <TextInput 
              style={styles.input} 
              value={endDate}
              onChangeText={setendDate}
              placeholder="YYYY-MM-DD"
            />
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

