import { format } from 'date-fns';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import TimePicker from 'react-time-picker';
interface TimesheetModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (entry: { name: string; role: string; startDate: string; endDate: string; Description: string }) => void;
}

export const TimesheetModal: React.FC<TimesheetModalProps> = ({ visible, onClose, onSubmit }) => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [rawStartDate, setRawStartDate] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [startDateDisplay, setStartDateDisplay] = useState('');
  const [startDate, setStartDate] = useState('');
  const handleSubmit = () => {
    console.log("handleSubmit triggered with data:", {
      name: date,
      startDate: startTime,
      endDate: endTime,
      Description: description,
    });
  
    setShowSuccessModal(true);
  };
  
  
  

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setDate('');
    setStartTime('');
    setEndTime('');
    setDescription('');
    onClose();
  };
  const handleDateChange = date => {
    setRawStartDate(date);
    setStartDateDisplay(format(date, 'MM-dd-yyyy'));
    setStartDate(format(date, 'yyyy-MM-dd')); // Format date for the input field
    setShowStartDatePicker(false); // Close the picker
  };
  return (
    <>
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Timesheet</Text>
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Date</Text>
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
      <Text style={styles.inputLabel}>Start Time</Text>

      {Platform.OS === 'web' ? (
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          style={styles.webInput} // Added specific style for the web input
        />
      ) : (
        // For mobile, use TextInput
        <TextInput
          style={styles.input}
          value={startTime}
          onChangeText={setStartTime}
          placeholder="HH:MM AM/PM"
        />
      )}
    </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>End Time</Text>
                <TextInput 
                  style={styles.input} 
                  value={endTime}
                  onChangeText={setEndTime}
                  placeholder="HH:MM AM/PM"
                />
              </View>
            </View>
            <View style={styles.inputContainer1}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput 
                style={[styles.input, styles.descriptionInput]} 
                value={description}
                onChangeText={setDescription}
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContent}>
            <Text style={styles.successModalText}>Timesheet submitted successfully</Text>
            <TouchableOpacity style={styles.okButton} onPress={handleCloseSuccessModal}>
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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
    width: '90%',
    maxWidth: 800,
  },
  modalHeading: {
    color: '#000',
    fontFamily: 'Outfit',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    textAlign:'center',
    textTransform: 'capitalize',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
    width:'32%'
  },
  inputContainer1: {
    marginBottom: 16,
    width:'100%'
  },
  inputLabel: {
    color: '#232323',
    fontFamily: 'Source Sans Pro',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
    marginBottom: 4,
  },
  input: {
    borderRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#044086',
    backgroundColor: '#FFF',
    padding: 10,
    color: '#232323',
    fontFamily: 'Source Sans Pro',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
  },
  descriptionInput: {
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  cancelButton: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#C4C4C4',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight:16
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
  row:{
    flexDirection:'row',
    gap:16
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
  webInput: {
    height: 40,  // Ensures the height of the native time input on web matches the mobile input
    borderRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#044086',
    backgroundColor: '#FFF',
    padding: 10,
    color: '#232323',
    fontFamily: 'Source Sans Pro',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
  },
});



