import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
// import { X } from 'lucide-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface AddMemberModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (memberData: any) => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ visible, onClose, onSubmit }) => {
  const [memberName, setMemberName] = useState('');
  const [role, setRole] = useState('');
  const [priority, setPriority] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = () => {
    onSubmit({ memberName, role, priority, startDate, endDate });
    onClose();
  };

  return (
    <Modal visible={visible} transparent >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeading}>Team Member - Murlidharan</Text>
           
          </View>
  
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  Member Name <Text style={styles.asterisk}>*</Text>
                </Text>
                <TextInput 
                  style={styles.input} 
                  value={memberName}
                  onChangeText={setMemberName}
                  placeholder="Enter member name"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  Role <Text style={styles.asterisk}>*</Text>
                </Text>
                <View style={styles.pickerContainer}>
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
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  Priority <Text style={styles.asterisk}>*</Text>
                </Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    style={styles.input}
                    selectedValue={priority}
                    onValueChange={(itemValue) => setPriority(itemValue)}
                  >
                    <Picker.Item label="Select Priority" value="" />
                    <Picker.Item label="High" value="High" />
                    <Picker.Item label="Medium" value="Medium" />
                    <Picker.Item label="Low" value="Low" />
                  </Picker>
                </View>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  Proposed Start Date <Text style={styles.asterisk}>*</Text>
                </Text>
                <TextInput 
                  style={styles.input} 
                  value={startDate}
                  onChangeText={setStartDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  Proposed End Date <Text style={styles.asterisk}>*</Text>
                </Text>
                <TextInput 
                  style={styles.input} 
                  value={endDate}
                  onChangeText={setEndDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
      
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '90%',
    maxWidth: 700,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding:30
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    maxHeight: '70%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop:10,
  
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 8,
  
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  asterisk: {
    color: '#EF4444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    color: '#1F2937',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  picker: {
    height: 40,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#044086',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
