import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { Checkbox, Menu, Provider as PaperProvider, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Dropdown = ({ label, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <View style={{ flex: 1, marginHorizontal: 5 }}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text>{selectedOption || 'Select an option'}</Text>
        <Icon name="chevron-down" size={12} color="#044086" style={styles.dropdownIcon} />
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.dropdownList}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedOption(option);
                setIsOpen(false);
              }}
            >
              <Text>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const intakeData = [
  { id: 1, goal: 'To gain Progress', description: 'A detailed project overview crafted by the PMO, outlining objectives, scope, and strategies within the PPM framework.', impactedStakeholders: 'Business Function - Finance', goalOwner: 'Tower- Product & Development', targetYear: 2024, createdOn: '13/04/2023', status: 'Delayed', menuVisible: false },
  { id: 2, goal: 'Goal1', description: 'A detailed project overview...', impactedStakeholders: 'Tower- Product & Development', goalOwner: 'Business Function - Finance', targetYear: 2025, createdOn: '14/04/2023', status: 'Delayed', menuVisible: false },
  { id: 3, goal: 'Goal2', description: 'A detailed project overview...', impactedStakeholders: 'Business Function - Finance', goalOwner: 'Tower- Product & Development', targetYear: 2026, createdOn: '15/04/2023', status: 'Delayed', menuVisible: false },
];

const CreateNewIntakeModal: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
  const handleSubmit = () => {
    onClose();
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
          <Text style={styles.modalTitle}>Create New Intake</Text>
          <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.inputRow}>
            <View style={{ flex: 1, marginHorizontal: 5 }}>
              <Text style={styles.inputLabel}>Name/Title <Text style={styles.asterisk}>*</Text></Text>
              <TextInput style={styles.input} />
            </View>
            <View style={{ flex: 1, marginHorizontal: 5 }}>
              <Text style={styles.inputLabel}>Classification</Text>
              <TextInput style={styles.input}  />
            </View>
          </View>
          <View style={styles.inputRow}>
            <Dropdown
              label="Department"
              options={['IT', 'HR', 'Finance', 'Marketing']}
            />
          </View>
          <View style={styles.inputRow}>
            <View style={{ flex: 1, marginHorizontal: 5 }}>
              <Text style={styles.inputLabel}>Project Owner</Text>
              <TextInput style={styles.input}  />
            </View>
            <View style={{ flex: 1, marginHorizontal: 5 }}>
              <Text style={styles.inputLabel}>Functional Service Owner</Text>
              <TextInput style={styles.input}  />
            </View>
          </View>
          <View style={styles.inputRow}>
            <View style={{ flex: 1, marginHorizontal: 5 }}>
              <Text style={styles.inputLabel}>Impacted Function</Text>
              <TextInput style={styles.input}  />
            </View>
            <View style={{ flex: 1, marginHorizontal: 5 }}>
              <Text style={styles.inputLabel}>Impacted Application</Text>
              <TextInput style={styles.input} />
            </View>
          </View>
          <View style={styles.inputRow}>
            <View style={{ flex: 1, marginHorizontal: 5 }}>
              <Text style={styles.inputLabel}>Business Tower</Text>
              <TextInput style={styles.input} />
            </View>
            <Dropdown
              label="Priority"
              options={['High', 'Medium', 'Low']}
            />
          </View>
          <View style={styles.inputRow}>
            <View style={{ flex: 1, marginHorizontal: 5 }}>
              <Text style={styles.inputLabel}>Proposed Start Date</Text>
              <TextInput style={styles.input}  />
            </View>
            <View style={{ flex: 1, marginHorizontal: 5 }}>
              <Text style={styles.inputLabel}>Proposed End Date</Text>
              <TextInput style={styles.input} />
            </View>
          </View>
          <View style={styles.inputRow}>
            <View style={{ flex: 1, marginHorizontal: 5 }}>
              <Text style={styles.inputLabel}>Go Live Date</Text>
              <TextInput style={styles.input}  />
            </View>
            <View style={{ flex: 1, marginHorizontal: 5 }}>
              <Text style={styles.inputLabel}>Release Quarter</Text>
              <TextInput style={styles.input}/>
            </View>
          </View>
          <View style={styles.inputRow}>
            <Dropdown
              label="Budget"
              options={['Option 1', 'Option 2', 'Option 3']}
            />
            <Dropdown
              label="Project Site"
              options={['Option 1', 'Option 2', 'Option 3']}
            />
          </View>
          <View style={styles.checkboxContainer}>
            <Checkbox status="unchecked" />
            <Text style={styles.checkboxLabel}>Add more project details</Text>
          </View>
          </ScrollView>
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
  const [intakeData, setIntakeData] = useState([
    { id: 1, goal: 'To gain Progress', description: 'A detailed project overview crafted by the PMO, outlining objectives, scope, and strategies within the PPM framework.', impactedStakeholders: 'Business Function - Finance', goalOwner: 'Tower- Product & Development', targetYear: 2024, createdOn: '13/04/2023', status: 'Delayed', menuVisible: false },
    { id: 2, goal: 'Goal1', description: 'A detailed project overview...', impactedStakeholders: 'Tower- Product & Development', goalOwner: 'Business Function - Finance', targetYear: 2025, createdOn: '14/04/2023', status: 'Delayed', menuVisible: false },
    { id: 3, goal: 'Goal2', description: 'A detailed project overview...', impactedStakeholders: 'Business Function - Finance', goalOwner: 'Tower- Product & Development', targetYear: 2026, createdOn: '15/04/2023', status: 'Delayed', menuVisible: false },
  ]);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <PaperProvider>
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Strategic Goals</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={openModal}>
            <Text style={styles.buttonText}>
              <Icon name="plus" size={14} color="#044086" style={styles.buttonIcon} /> Create New
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <View style={styles.buttonContent}>
              <Icon name="table-column" size={18} color="#044086" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Set Columns</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <View style={styles.headerRow}>
            {['Checkbox', 'S.No.', 'ID', 'Goal', 'Description', 'Impacted Stakeholders', 'Goal Owner', 'Target year', 'Created On', 'Status', 'Action'].map((header, index) => (
              <Text key={index} style={styles.headerCell}>{header}</Text>
            ))}
          </View>
          {intakeData.map((intake, index) => (
            <View key={intake.id} style={styles.row}>
              <View style={styles.cell}>
                <Checkbox status="unchecked" />
              </View>
              <Text style={styles.cell}>{index + 1}</Text>
              <Text style={styles.cell}>{intake.id}</Text>
              <Text style={styles.cell}>{intake.goal}</Text>
              <Text style={styles.cell} numberOfLines={1} ellipsizeMode="tail">{intake.description}</Text>
              <Text style={styles.cell}>{intake.impactedStakeholders}</Text>
              <Text style={styles.cell}>{intake.goalOwner}</Text>
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
                    <TouchableOpacity onPress={() => {
                      const updatedIntakeData = intakeData.map(item =>
                        item.id === intake.id ? { ...item, menuVisible: true } : { ...item, menuVisible: false }
                      );
                      setIntakeData(updatedIntakeData);
                    }}>
                      <IconButton icon="dots-vertical" size={24} />
                    </TouchableOpacity>
                  }
                >
                  <Menu.Item onPress={() => { /* Handle edit */ }} title="Edit" />
                  <Menu.Item onPress={() => { /* Handle delete */ }} title="Delete" />
                  <Menu.Item onPress={() => { /* Handle create program */ }} title="Create Program" />
                </Menu>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <CreateNewIntakeModal visible={modalVisible} onClose={closeModal} />
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    marginBottom: 20,
  },
  heading: {
    color: '#000',
    fontFamily: 'Outfit',
    fontSize: 15,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 22,
    textTransform: 'capitalize',
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#044086',
    fontFamily: 'Source Sans Pro',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 22,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    marginRight: 10,
    fontSize: 14,
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 10,
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    marginRight: 10,
    fontSize: 14,
    paddingVertical: 10,
  },
  actionCell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonContent: {
    flexDirection: 'row',
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
    borderRadius: 20,
    padding: 20,
    width: '40%',
    maxHeight: '95%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  inputLabel: {
    color: '#044086',
    fontFamily: 'Source Sans Pro',
    fontSize: 13,
    fontWeight: '400',
    marginBottom: 5,
  },
  asterisk: {
    color: '#C70B0B',
  },
  input: {
    height: 40,
    paddingHorizontal: 0,
    color: '#044086',
    fontFamily: 'Source Sans Pro',
    fontSize: 13,
    fontWeight: '400',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#044086',
  },
  dropdownIcon: {
    position: 'absolute',
    right: 0,
    bottom: 10,
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#044086',
    borderRadius: 5,
    backgroundColor: 'white',
    position: 'absolute',
    top: 45,
    left: 0,
    width: '60%',
    zIndex: 10,
  },
  dropdownItem: {
    padding: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkboxLabel: {
    marginLeft: 8,
    color: '#044086',
    fontFamily: 'Source Sans Pro',
    fontSize: 13,
    fontWeight: '400',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 7,

  },
  submitButton: {
    backgroundColor: '#044086',
    borderRadius: 7

  },
  buttonText1: {
    color: '#fff',


  },
  buttonText2: {

    color: '#232323'

  },
  menuContent: {
    // marginTop: -10,
    // marginLeft: -100,
  },
});

export default ManageGoals;

