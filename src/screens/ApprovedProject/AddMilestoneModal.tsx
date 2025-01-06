import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DataTable, Menu } from 'react-native-paper';
import { AddMemberModal } from './AddMemberModal';

interface AddMilestoneModalProps {
  visible: boolean;
  onClose: () => void;
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
}

export const AddMilestoneModal: React.FC<AddMilestoneModalProps> = ({ visible, onClose }) => {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [isMilestoneSubmitModalVisible, setMilestoneSubmitModalVisible] = useState(false);
  const [milestoneData, setMilestoneData] = useState<MilestoneData>({
    name: '',
    shortName: '',
    priority: '',
    description: '',
    proposedStartDate: '',
    proposedEndDate: '',
  });
  const [isAddMemberModalVisible, setAddMemberModalVisible] = useState(false);
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: 1, name: 'John Doe', role: 'Manager', startDate: '2023-12-01', isActive: true },
    { id: 2, name: 'Jane Smith', role: 'Developer', startDate: '2023-12-10', isActive: false },
  ]);

  const handleInputChange = (field: keyof MilestoneData, value: string) => {
    setMilestoneData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('New milestone:', milestoneData);
    console.log('Team members:', teamMembers);
    setMilestoneSubmitModalVisible(true);
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
                <Picker.Item label="High" value="high" />
                <Picker.Item label="Medium" value="medium" />
                <Picker.Item label="Low" value="low" />
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
                value={milestoneData.proposedStartDate}
                onChangeText={(value) => handleInputChange('proposedStartDate', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Proposed End Date <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput 
                style={styles.input} 
                value={milestoneData.proposedEndDate}
                onChangeText={(value) => handleInputChange('proposedEndDate', value)}
              />
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

              <TouchableOpacity style={styles.addMemberButton} onPress={() => setAddMemberModalVisible(true)}>
                <Icon name="plus" size={16} color="#044086" />
                <Text style={styles.addMemberButtonText}>Add Member</Text>
              </TouchableOpacity>
            </View>
          </View>

          <AddMemberModal
            visible={isAddMemberModalVisible}
            onClose={() => setAddMemberModalVisible(false)}
            onSubmit={handleAddMember}
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
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
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
