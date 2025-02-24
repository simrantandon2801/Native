import type React from "react"
import { useState, useEffect } from "react"
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native"
import { RejectInspection, type InspectionResponse } from "../database/RejectModalapi"

interface RejectModalProps {
  visible: boolean
  onClose: () => void
  item: {
    companyName?: string
    assignmentId?: string
  } | null
}

const RejectModal: React.FC<RejectModalProps> = ({ visible, onClose, item }) => {
  const [remarks, setRemarks] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    setRemarks("") 
    onClose()
  }
  useEffect(() => {
    if (visible) {
      setRemarks("") 
    }
    
  }, [visible])
  const handleReject = async () => {
    if (!item?.assignmentId) {
      setError("Invalid assignment ID. Please try again.");
      return;
    }
  
    setIsLoading(true);
    setError(null);
    
    try {
      const payload = {
        inspectionDate: null,
        statusId: 18,
        assignmentId: Number(item.assignmentId),  
        fsoAckDate: new Date().toISOString().split("T")[0],
        rejectedRemarks: remarks,
      };
      console.log("rejected payload",payload)
      const response = await RejectInspection(payload);
      console.log("Inspection rejected:", response);
  
      if (response.statusCode === "200") {
        console.log("Inspection rejected successfully");
        onClose();
        Alert.alert("Success", "Inspection rejected successfully!", [{ text: "OK", onPress: onClose }]);
      } else {
        setError("Failed to reject inspection. Please try again.");
      }
    } catch (error) {
      console.error("Error rejecting inspection:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Reject Inspection</Text>
          <Text style={styles.label}>Remarks</Text>
          <TextInput
            style={styles.input}
            value={remarks}
            onChangeText={setRemarks}
            placeholder="Enter remarks"
            multiline
          />
          {/* {error && <Text style={styles.errorText}>{error}</Text>} */}
          <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleClose} style={[styles.button, styles.cancelButton]} disabled={isLoading}>
  <Text style={styles.buttonText}>Cancel</Text>
</TouchableOpacity>
            <TouchableOpacity onPress={handleReject} style={[styles.button, styles.rejectButton]} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Reject</Text>}
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
    textAlignVertical: "top",
    minHeight: 100,
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

