import React, { useState } from "react"
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { acceptInspection, InspectionResponse } from '../database/AcceptModalapi'
interface AcceptModalProps {
  visible: boolean;
  onClose: () => void;
  item?: { assignmentId: number }; // Make item optional
  onAcceptSuccess: (itemId: number) => void
}


const AcceptModal: React.FC<AcceptModalProps> = ({ visible, onClose, item ,onAcceptSuccess }) => {
  const [inspectionDate, setInspectionDate] = useState<Date | null>(null)  
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false)
    setInspectionDate(selectedDate || null) 
  }

  const handleReset = () => {
    setInspectionDate(null) 
  }

  const handleAccept = async () => {
    if (!inspectionDate) {
      setError("Please select an inspection date.");
      return;
    }
  
    if (!item || !item.assignmentId) {
      setError("No valid assignment selected.");
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      console.log("Assignment ID:", item.assignmentId);
  
      const payload = {
        inspectionDate: inspectionDate.toISOString(),
        statusId: 19,
        assignmentId: Number(item.assignmentId), 
        fsoAckDate: inspectionDate.toISOString().split('T')[0],
        rejectedRemarks: "",
      };
  
      console.log("Payload being sent:", payload);
  
      const response = await acceptInspection(payload);
      console.log("API Response:", response);
  
      if (response.statusCode === "200") {
        Alert.alert("Success", "Inspection accepted successfully!", [{ 
          text: "OK", 
          onPress: () => {
            onClose();
            
            onAcceptSuccess(response);
          }
        }]);
      } else {
        setError("Failed to accept inspection. Please try again.");
      }
    } catch (error) {
      // console.error("Error accepting inspection:", error.message || error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Accept Inspection</Text>
          <Text style={styles.label}>Inspection Date</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <TextInput
              style={styles.input}
              value={inspectionDate ? inspectionDate.toLocaleDateString() : ""}
              editable={false}
              placeholder="Select Date"
            />
          </TouchableOpacity>

          {showDatePicker && (
          <DateTimePicker 
          value={inspectionDate || new Date()} 
          mode="date" 
          display="default" 
          minimumDate={new Date()} 
          onChange={handleDateChange} 
        />
        
          )}

          {error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleReset} style={[styles.button, styles.resetButton]}>
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleAccept} 
              style={[styles.button, styles.acceptButton]}
              disabled={isLoading}
            >
              {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Accept</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  resetButton: {
    backgroundColor: "#007bff",
  },
  cancelButton: {
    backgroundColor: "#007bff",
  },
  acceptButton: {
    backgroundColor: "#007bff",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
})

export default AcceptModal
