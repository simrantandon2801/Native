import React, { useState } from "react"
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator,Alert } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { acceptInspection, InspectionResponse } from '../database/AcceptModalapi'

interface AcceptModalProps {
  visible: boolean
  onClose: () => void
  item: {
    assignmentId: number
  }
}

const AcceptModal: React.FC<AcceptModalProps> = ({ visible, onClose, item }) => {
  const [inspectionDate, setInspectionDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

// console.log("Assignment ID:", item.assignmentId)
  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || inspectionDate
    setShowDatePicker(false)
    setInspectionDate(currentDate)
  }

  const handleAccept = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const payload = {
        inspectionDate: inspectionDate.toISOString(),
        statusId: 19,
        assignmentId: 273306, 
        fsoAckDate: inspectionDate.toISOString().split('T')[0],
        rejectedRemarks: ""
      }
    

      const response: InspectionResponse = await acceptInspection(payload)
      console.log("Inspection accepted:", response)
      
      if (response.statusCode === "200") {
        console.log("Inspection accepted successfully")
        onClose()
        Alert.alert("Success", "Inspection accepted successfully!", [
          { text: "OK", onPress: onClose },
        ]);
      } else {
        setError("Failed to accept inspection. Please try again.")
      }
    } catch (error) {
      console.error("Error accepting inspection:", error)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Accept Inspection</Text>
          <Text style={styles.label}>Inspection Date</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <TextInput
              style={styles.input}
              value={inspectionDate.toLocaleDateString()}
              editable={false}
              placeholder="Select Date"
            />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker 
              value={inspectionDate} 
              mode="date" 
              display="default" 
              onChange={handleDateChange} 
            />
          )}
          {/* {error && <Text style={styles.errorText}>{error}</Text>} */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleAccept} 
              style={[styles.button, styles.acceptButton]}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Accept</Text>
              )}
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
  },
  cancelButton: {
    backgroundColor: "#F44336",
    marginRight: 5,
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    marginLeft: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
})

export default AcceptModal