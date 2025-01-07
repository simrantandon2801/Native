import React, { useState,useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DataTable, Menu } from 'react-native-paper';
import { AddMemberModal } from './AddMemberModal';
import { RaidData,InsertRaid ,GetRaids, fetchPriorities} from '../../database/Raid';
import { Priority } from '../../database/Masters';


interface AddRaidModalProps {
  visible: boolean;
  onClose: () => void;
  projectId: number;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  startDate: string;
  isActive: boolean;
}

export const AddRaidModal: React.FC<AddRaidModalProps> = ({ visible, onClose, projectId }) => {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [isRaidSubmitModalVisible, setRaidSubmitModalVisible] = useState(false);
    const [selectedPriority, setSelectedPriority] = useState<Priority | null>(null)
    const [loading, setLoading] = useState(false)
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [raidData, setRaidData] = useState<RaidData>({
    raid_id: 0,
    project_id: projectId,
    type: '',
    title: '',
    driver: '',
    description: '',
    impact: '',
    status: '',
    next_status: '',
    priority: priorities,
    due_date: '',
    raid_owner: 0,
    is_active: true
  });
  const [isAddMemberModalVisible, setAddMemberModalVisible] = useState(false);
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: 1, name: 'John Doe', role: 'Manager', startDate: '2023-12-01', isActive: true },
    { id: 2, name: 'Jane Smith', role: 'Developer', startDate: '2023-12-10', isActive: false },
  ]);

  const handleInputChange = (field: keyof RaidData, value: string | number | boolean) => {
    setRaidData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
        console.log(raidData)
      const result = await InsertRaid(raidData);
      console.log('New raid:', result);
      setRaidSubmitModalVisible(true);
    } catch (error) {
      console.error('Error submitting RAID:', error);
      Alert.alert('Error', 'Failed to submit RAID. Please try again.');
    }
  };
    const fetchPrioritiesData = async () => {
      try {
        setLoading(true);
        const response = await fetchPriorities();
        console.log('Raw Response:', response);
    
        // If response is already an object, no need to parse it
        const result = response;  // No need for JSON.parse() here
    
        console.log('Parsed API Response:', result);
    
        if (result.length > 0) {
          setPriorities(result);  // result is already an array of priorities
        } else {
          console.error('Invalid priority data:', result);
        }
        
      } catch (error) {
        console.error('Error fetching priorities:', error);
      } finally {
        setLoading(false);
      }
    };
    
  
    // Fetch priorities on component mount
    useEffect(() => {
      fetchPrioritiesData()
    }, [])
  
  const handleCloseSuccessModal = () => {
    setRaidSubmitModalVisible(false);
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
          <ScrollView  showsVerticalScrollIndicator={false}>
            <Text style={styles.modalHeading}>Raid Details</Text>
            <View>
              <View style={styles.row}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>
                    Title <Text style={styles.asterisk}>*</Text>
                  </Text>
                  <TextInput 
                    style={styles.input} 
                    value={raidData.title}
                    onChangeText={(value) => handleInputChange('title', value)}
                  />
                </View>

                <View style={styles.inputContainer}>
                          <Text style={styles.inputLabel}>
                           Type <Text style={styles.required}>*</Text>
                          </Text>
                          <Picker
                            style={styles.input}
                            onValueChange={(itemValue) => console.log(itemValue)}
                          >
                            <Picker.Item label="Select Type" value="" />
                            <Picker.Item label="Risk" value="Risk" />
                            <Picker.Item label="Issue" value="Issue" />
                            <Picker.Item label="Assumption" value="Assumption" />
                          </Picker>
                        </View>

                        <View style={styles.inputContainer}>
                          <Text style={styles.inputLabel}>
                           Driver <Text style={styles.required}>*</Text>
                          </Text>
                          <Picker
                            style={styles.input}
                            onValueChange={(itemValue) => console.log(itemValue)}
                          >
                            <Picker.Item label="Select Drivers" value="" />
                            <Picker.Item label="Driver1" value="Driver1" />
                            <Picker.Item label="Driver2" value="Driver2" />
                            <Picker.Item label="Driver3" value="Driver3" />
                          </Picker>
                        </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  Description <Text style={styles.asterisk}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={raidData.description}
                  onChangeText={(value) => handleInputChange('description', value)}
                 
                />
              </View>

              <View style={styles.row}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>
                     Raid Status <Text style={styles.asterisk}>*</Text>
                  </Text>
                  <TextInput 
                    style={styles.input} 
                    value={raidData.status}
                    onChangeText={(value) => handleInputChange('status', value)}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>
                    Due Date <Text style={styles.asterisk}>*</Text>
                  </Text>
                  <TextInput 
                    style={styles.input} 
                    value={raidData.due_date}
                    onChangeText={(value) => handleInputChange('due_date', value)}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>
                    Owner <Text style={styles.asterisk}>*</Text>
                  </Text>
                  <TextInput 
                    style={styles.input} 
                    value={raidData.raid_owner.toString()}
                    onChangeText={(value) => handleInputChange('raid_owner', parseInt(value) || 0)}
                 
                  />
                </View>
              </View>

              <View style={styles.row}>
               

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>
                    Next Status <Text style={styles.asterisk}>*</Text>
                  </Text>
                  <TextInput 
                    style={styles.input} 
                    value={raidData.next_status}
                    onChangeText={(value) => handleInputChange('next_status', value)}
                  />
                </View>
                <View style={styles.inputContainer}>
                          <Text style={styles.inputLabel}>
                           Priority <Text style={styles.required}>*</Text>
                          </Text>
                          <Picker
          style={styles.input}
          selectedValue={selectedPriority}
          onValueChange={(itemValue) => setSelectedPriority(itemValue)}
        >
          <Picker.Item label="Select Priority" value="" />
          {priorities.map((priority) => (
            <Picker.Item key={priority.id} label={priority.value} value={priority.id} />
          ))}
        </Picker>
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

              <Modal visible={isRaidSubmitModalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                  <View style={styles.successModalContent}>
                    <Text style={styles.successModalText}>Raid submitted successfully</Text>
                    <TouchableOpacity style={styles.okButton} onPress={handleCloseSuccessModal}>
                      <Text style={styles.okButtonText}>OK</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
          </ScrollView>
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
    gap: 4,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeText: {
    color: '#232323',color: '#232323',
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
  required:{
    color:'red'

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

