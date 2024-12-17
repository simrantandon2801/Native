import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { Checkbox, Menu, Provider as PaperProvider, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';

const CreateNewIntakeModal: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
  const handleSubmit = () => {
    onClose();
  };
  const [selectedProgramOwner, setSelectedProgramOwner] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedApprovalReqd, setSelectedApprovalReqd] = useState('');
  const [selectedApprovalStatus, setSelectedApprovalStatus] = useState('');
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Add New Strategic Programs</Text>
          <View style={styles.modalContent}>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  Name/Title <Text style={styles.asterisk}>*</Text>
                </Text>
                <TextInput style={styles.input} />
              </View>
            </View>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  Status <Text style={styles.asterisk}>*</Text>
                </Text>
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
            </View>
            <View style={styles.inputRow}>
              {/* Approval Read Dropdown */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  Approval Reqd <Text style={styles.asterisk}>*</Text>
                </Text>
                <Picker
                  selectedValue={selectedApprovalReqd}
                  onValueChange={(itemValue) => setSelectedApprovalReqd(itemValue)}
                  style={styles.input}
                >
                  <Picker.Item label="Select Approval Reqd" value="" />
                  <Picker.Item label="Yes" value="Yes" />
                  <Picker.Item label="No" value="No" />
                </Picker>
              </View>
              {/* Approval Status Dropdown */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  Approval Status <Text style={styles.asterisk}>*</Text>
                </Text>
                <Picker
                  selectedValue={selectedApprovalStatus}
                  onValueChange={(itemValue) => setSelectedApprovalStatus(itemValue)}
                  style={styles.input}
                >
                  <Picker.Item label="Select Approval Status" value="" />
                  <Picker.Item label="Ontrack" value="Ontrack" />
                  <Picker.Item label="Delayed" value="Delayed" />
                </Picker>
              </View>
            </View>
            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, styles.fullWidth]}>
                <Text style={styles.inputLabel}>Description <Text style={styles.asterisk}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                />
              </View>
            </View>
            <View style={styles.inputRow}>
              {/* Impacted Stakeholders Dropdown */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  Program Owner <Text style={styles.asterisk}>*</Text>
                </Text>
                <Picker
                  selectedValue={selectedProgramOwner}
                  onValueChange={(itemValue) => setSelectedProgramOwner(itemValue)}
                  style={styles.input}
                >
                  <Picker.Item label="Select Owner" value="" />
                  <Picker.Item label="Manager" value="Manager" />
                  <Picker.Item label="Mhe" value="jdj" />
                  <Picker.Item label="hdf" value="hfd" />
                </Picker>
              </View>
              {/* Target Year Dropdown */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  Target Year <Text style={styles.asterisk}>*</Text>
                </Text>
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

const ManagePrograms: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [intakeData, setIntakeData] = useState([
    { id: 1, programName: 'Program A', goal: 'To gain Progress', description: 'A detailed project overview crafted by the PMO, outlining objectives, scope, and strategies within the PPM framework.', impactedStakeholders: 'Business Function - Finance', approvalRead: 'Yes', approvalStatus: 'Ontrack', targetYear: 2024, createdOn: '13/04/2023', status: 'Delayed', menuVisible: false, menuX: 0, menuY: 0 },
    { id: 2, programName: 'Program B', goal: 'Goal1', description: 'A detailed project overview...', impactedStakeholders: 'Tower- Product & Development', approvalRead: 'Yes', approvalStatus: 'Ontrack', targetYear: 2025, createdOn: '14/04/2023', status: 'Delayed', menuVisible: false, menuX: 0, menuY: 0 },
    { id: 3, programName: 'Program C', goal: 'Goal2', description: 'A detailed project overview...', impactedStakeholders: 'Business Function - Finance', approvalRead: 'Yes', approvalStatus: 'Ontrack', targetYear: 2026, createdOn: '15/04/2023', status: 'Delayed', menuVisible: false, menuX: 0, menuY: 0 },
  ]);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.heading}>Strategic Programs</Text>
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
              {['', 'S.No.', 'P.ID', 'Program Name', 'Goal', 'Description', 'Program Owner', 'Approval Reqd', 'Approval Status', 'Target year', 'Created On', 'Status', 'Action'].map((header, index) => (
                <Text key={index} style={styles.headerCell}>{header}</Text>
              ))}
            </View>
            <ScrollView>
              {intakeData.map((intake, index) => (
                <View key={intake.id} style={styles.row}>
                  <View style={styles.cell}>
                    <Checkbox status="unchecked" />
                  </View>
                  <Text style={styles.cell}>{index + 1}</Text>
                  <Text style={styles.cell}>{intake.id}</Text>
                  <Text style={styles.cell}>{intake.programName}</Text>
                  <Text style={styles.cell}>{intake.goal}</Text>
                  <Text style={styles.cell} numberOfLines={1} ellipsizeMode="tail">{intake.description}</Text>
                  <Text style={styles.cell}>{intake.impactedStakeholders}</Text>
                  <Text style={styles.cell}>{intake.approvalRead}</Text>
                  <Text style={styles.cell}>{intake.approvalStatus}</Text>
                  <Text style={styles.cell}>{intake.targetYear}</Text>
                  <Text style={styles.cell}>{intake.createdOn}</Text>
                  <Text style={styles.cell}>{intake.status}</Text>
                  <View style={[styles.cell, styles.actionCell]}>
                    <Menu
                      visible={intake.menuVisible}
                      onDismiss={() => {
                        const updatedIntakeData = intakeData.map(item =>
                          item.id === intake.id ? { ...item, menuVisible: false } : item
                        );
                        setIntakeData(updatedIntakeData);
                      }}
                      anchor={
                        <TouchableOpacity
                          onPress={(event) => {
                            const { pageX, pageY } = event.nativeEvent;
                            const updatedIntakeData = intakeData.map(item =>
                              item.id === intake.id
                                ? { ...item, menuVisible: true, menuX: pageX, menuY: pageY }
                                : { ...item, menuVisible: false }
                            );
                            setIntakeData(updatedIntakeData);
                          }}
                        >
                          <IconButton icon="dots-vertical" size={20} style={{ margin: 0, padding: 0 }} />
                        </TouchableOpacity>
                      }
                      style={{
                        position: 'absolute',
                        left: intake.menuX ? intake.menuX - 120 : 0, 
                        top: intake.menuY ? intake.menuY - 40 : 0, 
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
  },
  menuContainer: {
    maxHeight: 100, 
    maxWidth: 100,
  },
});

export default ManagePrograms;