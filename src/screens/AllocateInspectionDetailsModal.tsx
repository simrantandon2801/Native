"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native"
import Modal from "react-native-modal"
import { Picker } from "@react-native-picker/picker"
import { getListOffsounDerDoForReg } from "../database/Allocateapi"

interface AllocateInspectionDetailsModalProps {
  isVisible: boolean
  onClose: () => void
  data: any
}

const AllocateInspectionDetailsModal: React.FC<AllocateInspectionDetailsModalProps> = ({
  isVisible,
  onClose,
  data,
}) => {
  const [isAllocateModalVisible, setIsAllocateModalVisible] = useState(false)
  const [selectedInspector, setSelectedInspector] = useState("")
  const [remarks, setRemarks] = useState("")
  const [inspectors, setInspectors] = useState<Array<{ fsoName: string; fssaiUserId: string }>>([])

  const openAllocateModal = () => {
    console.log("Opening Allocate Modal")
    setIsAllocateModalVisible(true)
    fetchInspectors()
  }

  const closeAllocateModal = () => {
    setIsAllocateModalVisible(false)
    setSelectedInspector("")
    setRemarks("")
  }

  const fetchInspectors = async () => {
    try {
      const userId = "10000000016" // This should be dynamically set or retrieved from a state/prop
      const response = await getListOffsounDerDoForReg(userId)
      // Assuming the response contains an array of inspector names
      // Update this based on the actual response structure
      setInspectors(response)
    } catch (error) {
      console.error("Error fetching inspectors:", error)
    }
  }

  const handleCreateInspection = () => {
    console.log("Creating inspection with:", { selectedInspector, remarks })
    closeAllocateModal()
  }

  return (
    <>
      <Modal isVisible={isVisible} onBackdropPress={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Inspection Details</Text>
              {data && data.kobDetails && data.kobDetails.length > 0 && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Business Type:</Text>
                  <Text style={styles.detailValue}>{data.kobDetails[0].kobname}</Text>
                </View>
              )}
              {data && data.inspectionDetails && data.inspectionDetails.length > 0 ? (
                <View>
                  <Text style={styles.sectionTitle}>Inspection Details</Text>
                  {data.inspectionDetails.map((item, index) => (
                    <View key={index} style={styles.detailRow}>
                      <Text style={styles.detailLabel}>{item.key}:</Text>
                      <Text style={styles.detailValue}>{item.value}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View>
                  <Text style={styles.sectionTitle}>Inspection Details</Text>
                  <Text style={styles.detailValue}>N/A</Text>
                </View>
              )}
            </ScrollView>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.AllocateButton} onPress={openAllocateModal}>
                <Text style={styles.AllocateButtonText}>Allocate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal isVisible={isAllocateModalVisible} onBackdropPress={closeAllocateModal}>
        <View style={styles.allocateModalContainer}>
          <View style={styles.allocateModalContent}>
            <Text style={styles.allocateModalTitle}>Allocate Inspection</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedInspector}
                onValueChange={(itemValue) => setSelectedInspector(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select Primary Inspector" value="" />
                {inspectors.map((inspector, index) => (
                  <Picker.Item key={index} label={inspector.fsoName} value={inspector.fssaiUserId} />
                ))}
              </Picker>
            </View>
            <TextInput
              style={[styles.remarksInput, { minHeight: 40, marginBottom: 15 }]}
              value={inspectors.find((i) => i.fssaiUserId === selectedInspector)?.fsoName || ""}
              editable={false}
              placeholder="Selected Inspector"
            />
            <TextInput
              style={styles.remarksInput}
              placeholder="Remarks"
              value={remarks}
              onChangeText={setRemarks}
              multiline
            />
            <View style={styles.allocateButtonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeAllocateModal}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createButton} onPress={handleCreateInspection}>
                <Text style={styles.buttonText}>Create Inspection</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  detailLabel: {
    fontWeight: "bold",
    flex: 1,
  },
  detailValue: {
    flex: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  buttonContainer: {
    marginTop: 30,
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
  },
  closeButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: 100,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  AllocateButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: 100,
  },
  AllocateButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  allocateModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  allocateModalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
  },
  allocateModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  remarksInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    minHeight: 100,
    textAlignVertical: "top",
  },
  allocateButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginRight: 5,
    width: 80,
  },
  createButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginLeft: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
})

export default AllocateInspectionDetailsModal

