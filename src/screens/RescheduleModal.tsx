"use client"

import { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView, Alert } from "react-native"
import { Picker } from "@react-native-picker/picker"
import { X } from "lucide-react-native"
import { getListOffsounDerDoForReg } from "../database/Allocateapi"
import { getSecondaryInspectors } from "../database/SecondaryInspectorapi"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { rescheduleInspection } from "../database/AllocatedInspectionn/RescheduleInspection"

interface Inspector {
  fsoName: string
  fssaiUserId: string
}

interface RescheduleModalProps {
  isVisible: boolean
  onClose: () => void
  assignmentId: string
  refId: string
  createdByName: string
  onReschedule: (data: {
    primaryInspector: string
    secondaryInspectors: Inspector[]
    remarks: string
  }) => void
}

export function RescheduleModal({
  isVisible,
  onClose,
  assignmentId,
  refId,
  createdByName,
  onReschedule,
}: RescheduleModalProps) {
  const [selectedInspector, setSelectedInspector] = useState("")
  const [remarks, setRemarks] = useState("")
  const [isSecondaryPickerVisible, setIsSecondaryPickerVisible] = useState(false)
  const [selectedSecondaryInspectors, setSelectedSecondaryInspectors] = useState<Inspector[]>([])
  const [secondaryInspectors, setSecondaryInspectors] = useState<Inspector[]>([])
  const [inspectors, setInspectors] = useState<Inspector[]>([])
  const [loggedInUserIdd1, setLoggedInUserIdd1] = useState("")
  const [loading, setLoading] = useState(false)
  const[displayRefId,setDisplayRefId]=useState("")
  const [error, setError] = useState<string | null>(null)
  const [loggedInUser, setLoggedInUser] = useState({ name: "Default Logged-In User" })
  const [isLoading, setIsLoading] = useState(false)
  const [refIdd, setRefId] = useState("")
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const toggleSecondaryPicker = () => {
    setIsSecondaryPickerVisible(!isSecondaryPickerVisible)
  }

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const storedUserName = await AsyncStorage.getItem("loggedInUserName")
        const storedUserId = await AsyncStorage.getItem("userId")
        const storedRefId = await AsyncStorage.getItem("refId")

        if (storedUserName) {
          setLoggedInUser({ name: storedUserName })
        }
        if (storedUserId) {
          setLoggedInUserIdd1(storedUserId)
        }
        if (storedRefId) {
          setRefId(storedRefId)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    fetchLoggedInUser()
  }, [])

  useEffect(() => {
    if (loggedInUserIdd1) {
      fetchInspectors()
      fetchSecondaryInspectors()
    }
  }, [loggedInUserIdd1])


  useEffect(() => {
    const fetchDisplayRefId = async () => {
      try {
        const storedRefId = await AsyncStorage.getItem("displayrefID");
        if (storedRefId) {
          setDisplayRefId(storedRefId);
        }
      } catch (error) {
        console.error("Error fetching displayRefID:", error);
      }
    };

    fetchDisplayRefId();
  }, []);
  const fetchInspectors = async () => {
    try {
      setLoading(true)
      const response = await getListOffsounDerDoForReg(loggedInUserIdd1)
      if (response && Array.isArray(response)) {
        setInspectors(response)
      } else {
        console.warn("Invalid or empty response from API:", response)
      }
    } catch (error) {
      console.error("Error fetching inspectors:", error)
      setError("Failed to fetch inspectors")
    } finally {
      setLoading(false)
    }
  }

  const handleSecondaryInspectorSelection = (inspectorId: string) => {
    if (inspectorId === selectedInspector) return
    setSecondaryInspectors((prevInspectors) => {
      const isSelected = prevInspectors.some((inspector) => inspector.fssaiUserId === inspectorId)
      if (isSelected) {
        return prevInspectors.filter((inspector) => inspector.fssaiUserId !== inspectorId)
      } else {
        const inspector = selectedSecondaryInspectors.find((i) => i.fssaiUserId === inspectorId)
        return inspector ? [...prevInspectors, inspector] : prevInspectors
      }
    })
  }

  const fetchSecondaryInspectors = async () => {
    try {
      const response = await getSecondaryInspectors(loggedInUserIdd1)
      const filteredInspectors = response.filter((inspector) => inspector.fssaiUserId !== selectedInspector)
      setSelectedSecondaryInspectors(filteredInspectors)
    } catch (error) {
      console.error("Error fetching secondary inspectors:", error)
      setError("Failed to fetch secondary inspectors")
    }
  }

  const resetFields = () => {
    setSelectedInspector("")
    setRemarks("")
    setSecondaryInspectors([])
    setIsSecondaryPickerVisible(false)
  }

  const handleReschedule = async () => {
    if (!selectedInspector) {
      Alert.alert("Error", "Please select a primary inspector")
      return
    }

    if (!remarks.trim()) {
      Alert.alert("Error", "Please enter remarks")
      return
    }

    setShowConfirmModal(true)
  }

  const confirmReschedule = async () => {
    setShowConfirmModal(false)
    setIsLoading(true)
    try {
      const selectedPrimaryInspector = inspectors.find((inspector) => inspector.fssaiUserId === selectedInspector)
  
      if (!selectedPrimaryInspector) {
        throw new Error("Selected primary inspector not found")
      }
  
      const createdByName = loggedInUser?.name
  
      const primaryAssignment = {
        refId: refIdd,
        fsoId: selectedPrimaryInspector.fssaiUserId,
        createdBy: loggedInUserIdd1,
        updatedBy: loggedInUserIdd1,
        inspectionType: "PRE",
        fsoName: selectedPrimaryInspector.fsoName,
        createdByName: createdByName,
        doRemarks: remarks,
        displayRefId: displayRefId,
        inspectionDate: "",
        officerType: "P"
      }
  
      const secondaryAssignments = secondaryInspectors.map((inspector) => ({
        refId:refIdd,
        fsoId: inspector.fssaiUserId,
        createdBy: loggedInUserIdd1,
        updatedBy: loggedInUserIdd1,
        inspectionType: "PRE",
        fsoName: inspector.fsoName,
        createdByName: createdByName,
        doRemarks: remarks,
        officerType: "S",
        displayRefId: displayRefId,
        inspectionDate: "",
      }))
  
      const payload = {
        displayRefId: displayRefId,
        inspectionDate: "",
        refId:refIdd,
        doRemarks: remarks,
        fsoId: selectedPrimaryInspector.fssaiUserId,
        statusId: 17,
        fsoAcknowledgement: true,
        fsoName: selectedPrimaryInspector.fsoName,
        createdByName: createdByName,
        fsoAssignmentSecondaryOfficerRegistration: [primaryAssignment, ...secondaryAssignments],
        inspectionType: "PRE",
        createdBy: loggedInUserIdd1,
        updatedBy: loggedInUserIdd1,
        checkReschedule: null,
        roasterId: "null"
      }
  
      console.log("Payload for reschedule:", payload)
  
      const result = await rescheduleInspection(payload)
      console.log("Inspection rescheduled:", result)
      Alert.alert("Success", "Inspection rescheduled successfully!")
      onReschedule({
        primaryInspector: selectedPrimaryInspector.fssaiUserId,
        secondaryInspectors,
        remarks,
      })
      resetFields()
      onClose()
    } catch (error) {
      console.error("Error rescheduling inspection:", error)
      Alert.alert("Error", "Failed to reschedule inspection. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal visible={isVisible} transparent animationType="none">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Reschedule Inspector</Text>
            <TouchableOpacity
              onPress={() => {
                resetFields()
                onClose()
              }}
              style={styles.closeButton}
            >
              <X size={24} color="#000" />
            </TouchableOpacity>
          </View>
          {loading && <Text>Loading inspectors...</Text>}
          {error && <Text style={{ color: "red" }}>{error}</Text>}
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Primary Inspector</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedInspector}
                  onValueChange={(itemValue) => {
                    setSelectedInspector(itemValue)
                    setSecondaryInspectors([])
                  }}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Primary Inspector" value="" />
                  {inspectors.map((inspector, index) => (
                    <Picker.Item key={index} label={inspector.fsoName} value={inspector.fssaiUserId} />
                  ))}
                </Picker>
              </View>
              <TextInput
                style={styles.input}
                value={inspectors.find((i) => i.fssaiUserId === selectedInspector)?.fsoName || ""}
                editable={false}
                placeholder="Selected Primary Inspector"
              />
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Secondary Inspectors</Text>
                <View style={styles.secondaryInspectorContainer}>
                  <TouchableOpacity
                    onPress={selectedInspector ? toggleSecondaryPicker : undefined}
                    style={[styles.pickerContainer, !selectedInspector && styles.disabledPicker, { flex: 1 }]}
                  >
                    <TextInput
                      style={styles.input}
                      value={
                        !selectedInspector
                          ? "No data available"
                          : secondaryInspectors.length > 0
                            ? secondaryInspectors.map((inspector) => inspector.fsoName).join(", ")
                            : "Select Secondary Inspectors"
                      }
                      editable={false}
                      placeholder="Select Secondary Inspectors"
                    />
                  </TouchableOpacity>
                </View>

                {isSecondaryPickerVisible && selectedInspector && (
                  <View style={[styles.pickerContainer, styles.multiSelectPicker]}>
                    <View style={{ flex: 1 }}>
                      <ScrollView>
                        {selectedSecondaryInspectors
                          .filter((inspector) => inspector.fssaiUserId !== selectedInspector)
                          .map((inspector, index) => (
                            <TouchableOpacity
                              key={index}
                              style={[
                                styles.multiSelectItem,
                                secondaryInspectors.some((si) => si.fssaiUserId === inspector.fssaiUserId) &&
                                  styles.multiSelectItemSelected,
                              ]}
                              onPress={() => handleSecondaryInspectorSelection(inspector.fssaiUserId)}
                            >
                              <Text style={styles.multiSelectItemText}>{inspector.fsoName}</Text>
                            </TouchableOpacity>
                          ))}
                      </ScrollView>
                    </View>

                    <TouchableOpacity onPress={() => setIsSecondaryPickerVisible(false)} style={styles.closeIcon}>
                      <X size={20} color="black" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Remarks</Text>
                <TextInput
                  style={styles.remarksInput}
                  placeholder="Enter remarks"
                  value={remarks}
                  onChangeText={setRemarks}
                  multiline
                />
              </View>
              <TouchableOpacity style={styles.resetButton} onPress={resetFields}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitButton, (!selectedInspector || !remarks || isLoading) && styles.disabledButton]}
                onPress={handleReschedule}
                disabled={!selectedInspector || !remarks || isLoading}
              >
                <Text style={styles.reassignButtonText}>{isLoading ? "Rescheduling..." : "Reschedule"}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>

      <Modal visible={showConfirmModal} transparent animationType="fade">
        <View style={styles.confirmModalOverlay}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.confirmModalTitle}>Confirm Reassignment</Text>
            <Text style={styles.confirmModalText}>Are you sure you want to reschedule this inspection?</Text>
            <View style={styles.confirmModalButtons}>
              <TouchableOpacity style={styles.confirmModalButton} onPress={() => setShowConfirmModal(false)}>
                <Text style={styles.confirmModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmModalButton, styles.confirmModalButtonConfirm]}
                onPress={confirmReschedule}
              >
                <Text style={[styles.confirmModalButtonText, styles.confirmModalButtonTextConfirm]}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    padding: 20,
  },
  secondaryInspectorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    maxHeight: "80%",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    padding: 5,
    backgroundColor: "#fff",
    borderRadius: 50,
    elevation: 3,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  closeButton: {
    padding: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 8,
  },
  picker: {
    height: 50,
  },
  input: {
    padding: 12,
    fontSize: 16,
  },
  disabledPicker: {
    opacity: 0.5,
  },
  multiSelectPicker: {
    marginTop: 8,
    padding: 8,
  },
  multiSelectItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  multiSelectItemSelected: {
    backgroundColor: "#e6f3ff",
  },
  multiSelectItemText: {
    fontSize: 16,
  },
  remarksInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
  reassignButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  resetButton: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  resetButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmModalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxWidth: 400,
  },
  confirmModalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  confirmModalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  confirmModalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  confirmModalButton: {
    padding: 10,
    marginLeft: 10,
  },
  confirmModalButtonConfirm: {
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },
  confirmModalButtonText: {
    fontSize: 16,
    color: "#007AFF",
  },
  confirmModalButtonTextConfirm: {
    color: "#fff",
  },
})