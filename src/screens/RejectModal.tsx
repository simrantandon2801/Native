import React, { useState } from "react"
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"

interface RejectModalProps {
  visible: boolean
  onClose: () => void
  item: {
    companyName?: string
    assignmentId?: string
  } | null
}

const RejectModal: React.FC<RejectModalProps> = ({ visible, onClose, item }) => {
  const [inspectionDate, setInspectionDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)

  const handleDateChange = (event: Event, selectedDate?: Date) => {
    const currentDate = selectedDate || inspectionDate
    setShowDatePicker(false)
    setInspectionDate(currentDate)
  }

  const handleReject = () => {
    // Implement the reject logic here
    console.log("Rejected with inspection date:", inspectionDate)
    onClose()
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Reject Inspection</Text>
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
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleReject} style={[styles.button, styles.rejectButton]}>
              <Text style={styles.buttonText}>Reject</Text>
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
  rejectButton: {
    backgroundColor: "#FF9800",
    marginLeft: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
})

export default RejectModal

