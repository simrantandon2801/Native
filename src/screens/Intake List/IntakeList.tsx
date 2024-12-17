import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { Checkbox, IconButton, Menu } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';
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

const initialIntakeData = [
  { id: 1, name: 'Project 1', progress: 75, progressColors: { dark: '#76C043', light: '#CEE4BE' }, priority: 'High', currentStatus: 'On Track', lastStatus: 'Delayed', classification: 'Business', endDate: '2023-12-31', manager: 'John Doe', status: 'On Track', menuVisible: false },
  { id: 2, name: 'Project 2', progress: 50, progressColors: { dark: '#EA916E', light: '#F8DBD0' }, priority: 'Medium', currentStatus: 'Delayed', lastStatus: 'On Track', classification: 'Strategy', endDate: '2024-03-15', manager: 'Jane Smith', status: 'Delayed', menuVisible: false },
  { id: 3, name: 'Project 3', progress: 25, progressColors: { dark: '#EACF02', light: '#EEEBD3' }, priority: 'Low', currentStatus: 'Draft', lastStatus: 'On Track', classification: 'Operation', endDate: '2024-06-30', manager: 'Bob Johnson', status: 'Delayed', menuVisible: false },
];

const CreateNewIntakeModal: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedSite, setSelectedSite] = useState('');
  const [selectedClassification, setSelectedClassification] = useState('');
  const [projectOwner, setProjectOwner] = useState('');
  const [FunctionalOwner, setFunctionalOwner] = useState('');
  const [Impactedfunction, setImpactedfunction] = useState('');
  const [ImpactedApplication, setImpactedApplication] = useState('');
  const [BusinessTower, setBusinessTower] = useState('');
  const [StartDate, setStartDate] = useState('');
  const [EndDate, setEndDate] = useState('');
  const [LiveDate, setLiveDate] = useState('');
  const [ReleaseQuarter, setReleaseQuarter] = useState('');


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
        <ScrollView
                  showsVerticalScrollIndicator={false}>
        <Text style={styles.modalTitle}>Create Intake List</Text>
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
                Classification <Text style={styles.asterisk}>*</Text>
              </Text>
              <Picker
                selectedValue={selectedClassification}
                onValueChange={(itemValue) => setSelectedClassification(itemValue)}
                style={styles.input}
              >
                <Picker.Item label="Select Classification" value="" />
                <Picker.Item label="Business" value="business" />
                <Picker.Item label="Strategy" value="strategy" />
                <Picker.Item label="Operation" value="operation" />
              </Picker>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Department <Text style={styles.asterisk}>*</Text>
              </Text>
              <Picker
                selectedValue={selectedDepartment}
                onValueChange={(itemValue) => setSelectedDepartment(itemValue)}
                style={styles.input}
              >
                <Picker.Item label="Select Department" value="" />
                <Picker.Item label="IT" value="it" />
                <Picker.Item label="HR" value="hr" />
                <Picker.Item label="Finance" value="finance" />
              </Picker>
            </View>
          </View>
          <View style={styles.inputRow}>
  <View style={{ flex: 1, marginHorizontal: 5 }}>
    <Text style={styles.inputLabel}>
      Project Owner <Text style={styles.asterisk}>*</Text>
    </Text>
    <TextInput
      style={styles.input}
      value={projectOwner}
      onChangeText={setProjectOwner}
    />
  </View>
  <View style={{ flex: 1, marginHorizontal: 5 }}>
    <Text style={styles.inputLabel}>
      Functional Service Owner <Text style={styles.asterisk}>*</Text>
    </Text>
    <TextInput
      style={styles.input}
      value={FunctionalOwner}
      onChangeText={setFunctionalOwner}
    />
  </View>

</View>
<View style={styles.inputRow}>
  <View style={{ flex: 1, marginHorizontal: 5 }}>
    <Text style={styles.inputLabel}>
      Impacted Function <Text style={styles.asterisk}>*</Text>
    </Text>
    <TextInput
      style={styles.input}
      value={Impactedfunction}
      onChangeText={setImpactedfunction}
    />
  </View>
  <View style={{ flex: 1, marginHorizontal: 5 }}>
    <Text style={styles.inputLabel}>
      Impacted Application <Text style={styles.asterisk}>*</Text>
    </Text>
    <TextInput
      style={styles.input}
      value={ImpactedApplication}
      onChangeText={setImpactedApplication}
    />
  </View>
  
</View>
<View style={styles.inputRow}>
  <View style={{ flex: 1, marginHorizontal: 5 }}>
    <Text style={styles.inputLabel}>
      Business Tower <Text style={styles.asterisk}>*</Text>
    </Text>
    <TextInput
      style={styles.input}
      value={BusinessTower}
      onChangeText={setBusinessTower}
    />
  </View>
  <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Priority <Text style={styles.asterisk}>*</Text>
              </Text>
              <Picker
                selectedValue={selectedPriority}
                onValueChange={(itemValue) => setSelectedPriority(itemValue)}
                style={styles.input}
              >
                <Picker.Item label="Select Priority" value="" />
                <Picker.Item label="IT" value="it" />
                <Picker.Item label="HR" value="hr" />
                <Picker.Item label="Finance" value="finance" />
              </Picker>
            </View>
  
</View>
<View style={styles.inputRow}>
  <View style={{ flex: 1, marginHorizontal: 5 }}>
    <Text style={styles.inputLabel}>
      Proposed Start Date <Text style={styles.asterisk}>*</Text>
    </Text>
    <TextInput
      style={styles.input}
      value={StartDate}
      onChangeText={setStartDate}
    />
  </View>
  <View style={{ flex: 1, marginHorizontal: 5 }}>
    <Text style={styles.inputLabel}>
      Proposed End Date <Text style={styles.asterisk}>*</Text>
    </Text>
    <TextInput
      style={styles.input}
      value={EndDate}
      onChangeText={setEndDate}
    />
  </View>
  
</View>
<View style={styles.inputRow}>
  <View style={{ flex: 1, marginHorizontal: 5 }}>
    <Text style={styles.inputLabel}>
      Go live Date <Text style={styles.asterisk}>*</Text>
    </Text>
    <TextInput
      style={styles.input}
      value={LiveDate}
      onChangeText={setLiveDate}
    />
  </View>
  <View style={{ flex: 1, marginHorizontal: 5 }}>
    <Text style={styles.inputLabel}>
      Released Quarter <Text style={styles.asterisk}>*</Text>
    </Text>
    <TextInput
      style={styles.input}
      value={ReleaseQuarter}
      onChangeText={setReleaseQuarter}
    />
  </View>
  
</View>
<View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Budget <Text style={styles.asterisk}>*</Text>
              </Text>
              <Picker
                selectedValue={selectedBudget}
                onValueChange={(itemValue) => setSelectedBudget(itemValue)}
                style={styles.input}
              >
                <Picker.Item label="Select Budget" value="" />
                <Picker.Item label="Business" value="business" />
                <Picker.Item label="Strategy" value="strategy" />
                <Picker.Item label="Operation" value="operation" />
              </Picker>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Project Site <Text style={styles.asterisk}>*</Text>
              </Text>
              <Picker
                selectedValue={selectedSite}
                onValueChange={(itemValue) => setSelectedSite(itemValue)}
                style={styles.input}
              >
                <Picker.Item label="Select Site" value="" />
                <Picker.Item label="IT" value="it" />
                <Picker.Item label="HR" value="hr" />
                <Picker.Item label="Finance" value="finance" />
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
        </ScrollView>
      </View>
     
   
    </View>
    
  </Modal>

  );
};

const IntakeList: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [intakeData, setIntakeData] = useState(initialIntakeData);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Intake List</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={openModal}>
          <Text style={styles.buttonText}>
            <Icon name="plus" size={14} color="#044086" style={styles.buttonIcon} /> Create New
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <View style={styles.buttonContent}>
            <Icon name="columns" size={18} color="#044086" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Set Column</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <View style={styles.headerRow}>
          {['', 'S.No.', 'Project Name', 'Progress', 'Priority', 'Current Status', 'Last Status', 'Classification', 'Tentative End Date', 'Intake Manager', 'Status', 'Action'].map((header, index) => (
            <Text key={index} style={styles.headerCell}>{header}</Text>
          ))}
        </View>
        {intakeData.map((intake) => (
          <View key={intake.id} style={styles.row}>
            <View style={styles.cell}>
              <Checkbox status="unchecked" />
            </View>
            <Text style={styles.cell}>{intake.id}</Text>
            <Text style={styles.cell}>{intake.name}</Text>
            <View style={styles.cell}>
              <View style={[styles.progressBarBackground, { backgroundColor: intake.progressColors.light, width: 60 }]}>
                <View style={[styles.progressBar, { width: `${intake.progress}%`, backgroundColor: intake.progressColors.dark }]} />
              </View>
            </View>
            <Text style={[styles.cell, styles[`priority${intake.priority}`]]}>{intake.priority}</Text>
            <Text style={styles.cell}>{intake.currentStatus}</Text>
            <Text style={styles.cell}>{intake.lastStatus}</Text>
            <Text style={styles.cell}>{intake.classification}</Text>
            <Text style={styles.cell}>{intake.endDate}</Text>
            <Text style={styles.cell}>{intake.manager}</Text>
            <Text style={styles.cell}>{intake.status}</Text>
            <View style={[styles.cell, styles.actionCell]}>
              <Menu
                visible={intake.menuVisible}
                onDismiss={() => {
                  const updatedIntakeData = intakeData.map(item => 
                    item.id === intake.id ? {...item, menuVisible: false} : item
                  );
                  setIntakeData(updatedIntakeData);
                }}
                anchor={
                  <IconButton 
                    icon="dots-vertical"
                    size={16}
                    onPress={() => {
                      const updatedIntakeData = intakeData.map(item => 
                        item.id === intake.id ? {...item, menuVisible: true} : item
                      );
                      setIntakeData(updatedIntakeData);
                    }}
                  />
                }
              >
                <Menu.Item onPress={() => {}} title="Edit" />
                <Menu.Item onPress={() => {}} title="Delete" />
                <Menu.Item onPress={() => {}} title="Approval" />
              </Menu>
            </View>
          </View>
        ))}
      </View>
      <CreateNewIntakeModal visible={modalVisible} onClose={closeModal} />
    </ScrollView>
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
  inputContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  headerCell: {
    width: 80,
    fontWeight: 'bold',
    marginRight: 5,
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 10,
  },
  cell: {
    width: 80,
    marginRight: 5,
    height: 20,
    fontSize: 11,
    paddingVertical: 2,
  },
  actionCell: {
    width: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
    position: 'relative',
  },
  progressBarBackground: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    width: 60,
  },
  progressBar: {
    height: '100%',
    width: '100%',
  },
  priorityLow: {
    color: '#232323',
    fontFamily: 'Source Sans Pro',
    fontSize: 11,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 18,
    display: 'flex',
    padding: 0,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
    paddingVertical: 1,
  },
  priorityMedium: {
    color: '#1B7A01',
    fontFamily: 'Source Sans Pro',
    fontSize: 11,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 18,
    display: 'flex',
    padding: 0,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#DAFFD4',
    paddingVertical: 1,
  },
  priorityHigh: {
    color: '#B50707',
    fontFamily: 'Source Sans Pro',
    fontSize: 11,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 18,
    display: 'flex',
    padding: 0,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#FFD4D4',
    paddingVertical: 1,
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
    textAlign:'center'
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
    borderRadius:7,
    
  },
  submitButton: {
    backgroundColor: '#044086',
    borderRadius:7

  },
  buttonText1: {
    color: '#fff',
  },
  buttonText2: {
    color:'#232323'
  },
  menu: {
    position: 'absolute',
    right: 0,
    top: 20,
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
  picker: {
    height: 50,
    borderBottomWidth: 1.5,
    borderBottomColor: '#044086',
    backgroundColor: 'transparent',
  },
  modalContent: {
    marginBottom: 20,
  },
});

export default IntakeList;