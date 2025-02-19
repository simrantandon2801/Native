"use client"
import { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView } from "react-native"
import { Picker } from "@react-native-picker/picker"
import { X } from "lucide-react-native"
import { getListOffsounDerDoForReg } from "../database/Allocateapi"
import AsyncStorage from "@react-native-async-storage/async-storage"
interface Inspector {
  fsoName: string
  fssaiUserId: string
}

interface ReassignModalProps {
  isVisible: boolean
  onClose: () => void
  assignmentId: string
  inspectors: Inspector[]
  onReassign: (data: {
    primaryInspector: string
    secondaryInspectors: Inspector[]
    remarks: string
  }) => void
}

export function ReassignModal({ isVisible, onClose, assignmentId, onReassign }: ReassignModalProps) {
  const [selectedInspector, setSelectedInspector] = useState("")
  const [remarks, setRemarks] = useState("")
  const [isSecondaryPickerVisible, setIsSecondaryPickerVisible] = useState(false)
  const [selectedSecondaryInspectors, setSelectedSecondaryInspectors] = useState<Inspector[]>([])
  const [secondaryInspectors, setSecondaryInspectors] = useState<Inspector[]>([])
  const [inspectors, setInspectors] = useState([])
  const [loggedInUserIdd1, setLoggedInUserIdd1] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const toggleSecondaryPicker = () => {
    setIsSecondaryPickerVisible(!isSecondaryPickerVisible)
  }
  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId")

        if (storedUserId) {
          setLoggedInUserIdd1(storedUserId)
        } else {
          console.warn("No logged-in user found in AsyncStorage.")
        }
      } catch (error) {
        console.error("Error fetching logged-in user:", error)
      }
    }

    fetchLoggedInUser()
  }, [])
  useEffect(() => {
    if (loggedInUserIdd1) {
      fetchInspectors()
    }
  }, [loggedInUserIdd1])
  const fetchInspectors = async () => {
    try {
      setLoading(true)
      const response = await getListOffsounDerDoForReg(loggedInUserIdd1)
      console.log(response, "API Response")

    } catch (error) {
      console.error("Error fetching inspectors:", error)
    //   setError("Failed to fetch inspectors")
    } finally {
      setLoading(false)
    }
  }
  //   const handleSecondaryInspectorSelection = (inspectorId: string) => {
  //     const inspector = selectedSecondaryInspectors.find((insp) => insp.fssaiUserId === inspectorId)
  //     if (!inspector) return

  //     setSecondaryInspectors((prev) => {
  //       const exists = prev.some((si) => si.fssaiUserId === inspectorId)
  //       if (exists) {
  //         return prev.filter((si) => si.fssaiUserId !== inspectorId)
  //       } else {
  //         return [...prev, inspector]
  //       }
  //     })
  //   }

  const handleSubmit = () => {
    onReassign({
      primaryInspector: selectedInspector,
      secondaryInspectors,
      remarks,
    })
    onClose()
  }

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Reassign Inspector</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
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
              {/* <View style={styles.inputContainer}>
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
                   <ScrollView style={{ maxHeight: 200 }}>
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
             
             
                   <TouchableOpacity
                     onPress={() => setIsSecondaryPickerVisible(false)}
                     style={styles.closeIcon}
                   >
                     <X size={20} color="black" />
                   </TouchableOpacity>
                 </View>
               )}
             </View> */}

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

              <TouchableOpacity
                style={[styles.submitButton, (!selectedInspector || !remarks) && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={!selectedInspector || !remarks}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
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
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})

