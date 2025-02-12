"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,Alert } from "react-native"
import Modal from "react-native-modal"
import { Picker } from "@react-native-picker/picker"
import { getListOffsounDerDoForReg } from "../database/Allocateapi"
import { getSecondaryInspectors } from "../database/SecondaryInspectorapi"
// import MultiSelect from "react-native-multiple-select"
// import { createInspection } from "../database/CreateInspection"
import { createInspection,  } from "../database/CreateInspection"

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
  const [inspectors, setInspectors] = useState([])
  // const [secondaryInspectors, setSecondaryInspectors] = useState([])
  const [selectedSecondaryInspectors, setSelectedSecondaryInspectors] = useState<Inspector[]>([])
  const [isSecondaryModalVisible, setIsSecondaryModalVisible] = useState(false);
  // const [selectedSecondaryInspectors, setSelectedSecondaryInspectors] = useState<string[]>([])
  const [secondaryInspectors, setSecondaryInspectors] = useState<Inspector[]>([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSecondaryPickerVisible, setIsSecondaryPickerVisible] = useState(false);

  const toggleSecondaryPicker = () => {
    setIsSecondaryPickerVisible(!isSecondaryPickerVisible);
  };
  interface Inspector {
    fssaiUserId: string;
    fsoName: string;
  }
  const openAllocateModal = () => {
    console.log("Opening Allocate Modal")
    setIsAllocateModalVisible(true)
    setSelectedInspector("")
    setSelectedSecondaryInspectors([])
    fetchInspectors()
    fetchSecondaryInspectors()
  }

  const closeAllocateModal = () => {
    setIsAllocateModalVisible(false)
    setSelectedInspector("")
    setSelectedSecondaryInspectors([])
    setRemarks("")
  }
  const toggleSecondaryModal = () => setIsSecondaryModalVisible(!isSecondaryModalVisible);
  const fetchInspectors = async () => {
    try {
      const userId = "10000000016"
      const response = await getListOffsounDerDoForReg(userId)
      setInspectors(response)
    } catch (error) {
      console.error("Error fetching inspectors:", error)
    }
  }
  const handleSecondaryInspectorSelection = (inspectorId: string) => {
    const isSelected = secondaryInspectors.some(
      inspector => inspector.fssaiUserId === inspectorId
    );
    
    if (isSelected) {
      setSecondaryInspectors(
        secondaryInspectors.filter(
          inspector => inspector.fssaiUserId !== inspectorId
        )
      );
    } else {
      const inspector = selectedSecondaryInspectors.find(
        i => i.fssaiUserId === inspectorId
      );
      if (inspector) {
        setSecondaryInspectors([...secondaryInspectors, inspector]);
      }
    }
  };
  const fetchSecondaryInspectors = async () => {
    try {
      const userId = "10000000016"
      const response = await getSecondaryInspectors(userId)
      setSelectedSecondaryInspectors(response)
    } catch (error) {
      console.error("Error fetching secondary inspectors:", error)
    }
  }

  // const handleSecondaryInspectorChange = (selectedKeys: string[]) => {
    
  //   const updatedInspectors = inspectors.filter(inspector =>
  //     selectedKeys.includes(inspector.fssaiUserId)
  //   );
  //   setSelectedSecondaryInspectors(updatedInspectors);
  // };

  const handleCreateInspection = async () => {
    try {
      const payload: any = {
        displayRefId: data.displayRefId || "",
        inspectionDate: "",
        refId: data.refId || 0,
        doRemarks: remarks,
        fsoId: selectedInspector,
        statusId: 17,
        fsoAcknowledgement: true,
        fsoName: inspectors.find((i) => i.fssaiUserId === selectedInspector)?.fsoName || "",
        createdByName: "nhbsecretary", 
        fsoAssignmentSecondaryOfficerRegistration: selectedSecondaryInspectors.map((inspector) => ({
          refId: data.refId || 0,
          fsoId: inspector.fssaiUserId,
          createdBy: "10000000016",
          updatedBy: "10000000016", 
          inspectionType: "POST",
          fsoName: inspector.fsoName,
          createdByName: "nhbsecretary",
          doRemarks: remarks,
          officerType: "S",
        })),
        inspectionType: "POST",
        createdBy: "10000000016", 
        updatedBy: "10000000016", 
        checkReschedule: false,
      }
  
      const result = await createInspection(payload)
      console.log("Inspection created:", result)
  
   
      Alert.alert("Inspection created successfully!")
      closeAllocateModal()
    } catch (error) {
      console.error("Error creating inspection:", error)
      
      Alert.alert("Failed to create inspection. Please try again.")
    }
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

            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Primary Inspector</Text>
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
                style={styles.input}
                value={inspectors.find((i) => i.fssaiUserId === selectedInspector)?.fsoName || ""}
                editable={false}
                placeholder="Selected Primary Inspector"
              />
            </View>
 
            <View style={styles.inputContainer}>
  <Text style={styles.inputLabel}>Secondary Inspectors</Text>
  <TouchableOpacity 
    onPress={toggleSecondaryPicker} 
    style={styles.pickerContainer}
  >
    <TextInput
      style={styles.input}
      value={
        secondaryInspectors.length > 0
          ? secondaryInspectors.map(inspector => inspector.fsoName).join(', ')
          : 'Select Secondary Inspectors'
      }
      editable={false}
      placeholder="Select Secondary Inspectors"
    />
  </TouchableOpacity>
  
  {isSecondaryPickerVisible && (
    <View style={[styles.pickerContainer, styles.multiSelectPicker]}>
      <ScrollView style={{ maxHeight: 200 }}>
        {selectedSecondaryInspectors.map((inspector, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.multiSelectItem,
              secondaryInspectors.some(
                si => si.fssaiUserId === inspector.fssaiUserId
              ) && styles.multiSelectItemSelected
            ]}
            onPress={() => handleSecondaryInspectorSelection(inspector.fssaiUserId)}
          >
            <Text style={styles.multiSelectItemText}>
              {inspector.fsoName}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  itemsContainer: {
    height: 100,
  },
  textDropdown: {
    fontSize: 16,
  },
  textDropdownSelected: {
    fontSize: 16,
  },
  multiSelectContainer: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    padding: 5,
  },
  multiSelectPicker: {
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    zIndex: 1000,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  multiSelectItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  multiSelectItemSelected: {
    backgroundColor: '#e6f3ff',
  },
  multiSelectItemText: {
    fontSize: 16,
  }
})

export default AllocateInspectionDetailsModal
