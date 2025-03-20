"use client"

import React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TextInput,Image
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRoute, type RouteProp, useNavigation } from "@react-navigation/native"
import DocumentPicker from 'react-native-document-picker';
import {deleteInspectionSignature, getWitnessDetailsForRegistration, saveWitnessDetailsForRegistration} from '../database/Signatureapi'
import { viewInspectionDocument } from "../database/DocumentListapi"

interface PreviewDocumentsProps {
  visible: boolean
  onClose: () => void
  sectionId: number | null
  sectionName: string
  inspectionId: string
  assignmentId: any
  refId: any
}
interface WitnessDetail {
  name: string;
  email: string;
  mobileNo: string;
  document_desc: string;
  documentPath: string;
  eSignId: string; // Assuming this is the unique identifier for deletion
}
const OfficerSignature: React.FC = () => {
  const route = useRoute<RouteProp<Record<string, PreviewDocumentsProps>>>()
  const navigation = useNavigation()
  const { inspectionId, sectionName, assignmentId, refId } = route.params
  console.log("inspectionid", inspectionId, "sectionName", sectionName, "assignmentID", assignmentId, "refID", refId)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  // Modal state
  const [modalVisible, setModalVisible] = useState(false)
  const [applicantName, setApplicantName] = useState("")
  const [applicantEmail, setApplicantEmail] = useState("")
  const [applicantContact, setApplicantContact] = useState("")
  const [signatureType, setSignatureType] = useState("aadhaar")
  const [aadhaarNumber, setAadhaarNumber] = useState("")
  const [documentDescription, setDocumentDescription] = useState("")
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)
  const [aadhaarPart1, setAadhaarPart1] = useState("");
  const [aadhaarPart2, setAadhaarPart2] = useState("");
   const [viewImageModal, setViewImageModal] = useState(false)
    const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [aadhaarPart3, setAadhaarPart3] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fetchedData, setfetchedData] = useState<WitnessDetail[]>([]);
  const aadhaarInput1 = React.useRef<TextInput>(null);
  const aadhaarInput2 = React.useRef<TextInput>(null);
  const aadhaarInput3 = React.useRef<TextInput>(null);

  const RequiredLabel = ({ text }: { text: string }) => (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text style={styles.inputLabel}>{text}</Text>
      <Text style={styles.requiredAsterisk}>*</Text>
    </View>
  );

  useEffect(() => {
    const fetchDataFromAsyncStorage = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId")
        setUserId(storedUserId)
        console.log("Retrieved User ID:", storedUserId)
      } catch (err) {
        console.error("Error fetching data from AsyncStorage:", err)
        setError("Failed to load data from storage.")
      }
    }

    fetchDataFromAsyncStorage()
  }, [inspectionId, assignmentId])

  const fetchWitnessDetails = async () => {
    try {
      setIsLoading(true)
      const data = await getWitnessDetailsForRegistration(
        parseInt(assignmentId), 
        parseInt(inspectionId)
      )
      console.log("Witness detaidls fetched:", data)
      setfetchedData(data)
      // Process the data as needed
      setIsLoading(false)
    } catch (err) {
      console.error("Error fetching witness details:", err)
      setError("Failed to load witness details.")
      setIsLoading(false)
    }
  }

  // Call this function when needed, for example in another useEffect
  useEffect(() => {
    fetchWitnessDetails()
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!applicantName.trim()) {
      newErrors.applicantName = "Applicant name is required";
    }

    if (!applicantEmail.trim()) {
      newErrors.applicantEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(applicantEmail)) {
      newErrors.applicantEmail = "Email is invalid";
    }

    if (!applicantContact.trim()) {
      newErrors.applicantContact = "Contact number is required";
    } else if (!/^\d{10}$/.test(applicantContact)) {
      newErrors.applicantContact = "Contact number must be 10 digits";
    }

    // if (signatureType === "aadhaar") {
    //   if (!aadhaarPart1 || !aadhaarPart2 || !aadhaarPart3 ||
    //     aadhaarPart1.length !== 4 || aadhaarPart2.length !== 4 || aadhaarPart3.length !== 4) {
    //     newErrors.aadhaar = "Complete 12-digit Aadhaar number is required";
    //   }
    // }

    if (signatureType === "physical") {
      if (!documentDescription.trim()) {
        newErrors.documentDescription = "Document description is required";
      }
      if (!selectedDocument) {
        newErrors.selectedDocument = "Document upload is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceed = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fill in all required fields.");
      return;
    }
  
    try {
      setIsLoading(true);
  
    
      const payload = {
        assignmentId: assignmentId,
        inspectionId: parseInt(inspectionId),
        refId: refId,
        name: applicantName,
        email: applicantEmail,
        mobileNo: applicantContact,
        aadharFirstDigit: signatureType === "aadhaar" ? aadhaarPart1 : null,
        aadharSecondDigit:
          signatureType === "aadhaar" ? `${aadhaarPart2}${aadhaarPart3}` : null,
        signatureType: "APPLICANT",
        documentDesc: documentDescription,
        fssaiUserId: null,
        verificationType: signatureType.toUpperCase(),
        officerType: null,
        isOfficer: false,
      };
  
      console.log("------payload signature----", payload);
  
  
      const response = await saveWitnessDetailsForRegistration(payload, selectedDocument);
  
      console.log("API Response:", response);
      Alert.alert("Success", "Witness details saved successfully.");
  
      setModalVisible(false);
      resetForm();
      setModalVisible(false)
    } catch (error) {
      console.error("Error saving witness details:", error);
      Alert.alert(
        "Error",
        "Failed to save witness details. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setApplicantName("");
    setApplicantEmail("");
    setApplicantContact("");
    setSignatureType("aadhaar");
    setAadhaarNumber("");
    setAadhaarPart1("");
    setAadhaarPart2("");
    setAadhaarPart3("");
    setDocumentDescription("");
    setSelectedDocument(null);
    setErrors({});
  };

  const handleCancel = () => {
    setModalVisible(false)
    resetForm()
  }
   const handleViewImage = async (documentPath: string) => {
      try {
        const base64String = await viewInspectionDocument(documentPath);
    
        console.log("Base64 String:", base64String);
        console.log("sdkj")
    
        if (!base64String) {
          throw new Error("Base64 string is undefined or empty");
        }
    
     
        setCurrentImage(base64String);
        setViewImageModal(true);
      } catch (error) {
        console.error("Error viewing document:", error);
        Alert.alert("Error", "Could not load the document. Please try again.");
      }
    };
    const handleDelete = async (eSignId
      : string) => {
      try {
        if (!eSignId
        ) {
          console.error("Generated code is undefined or null");
          Alert.alert("Error", "Invalid code . Please try again.");
          return;
        }
    
        console.log("Deleting document with generatedCode:", eSignId );
    
        const response = await deleteInspectionSignature(eSignId
        );
        console.log("API Response:", response);
    
        
        fetchWitnessDetails();
    
        Alert.alert("Success", "Document deleted successfully");
      } catch (error) {
        console.error("Error deleting document:", error);
        Alert.alert("Error", "Failed to delete document.");
      }
    };
  const handleChooseFile = async () => {
    try {
   
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
      });
  
      console.log('Selected File:', res);
  
      
      setSelectedDocument(res[0]);
      console.log("File stored successfully:", res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled the document picker');
      } else {
        console.error('Error while selecting document:', err);
        setErrors({ selectedDocument: 'Failed to select document' });
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
      {!fetchedData || fetchedData.length === 0 ? (
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.addButtonText}>Add Applicant</Text>
          </TouchableOpacity>
        ) : null}
        {fetchedData && fetchedData.length > 0 && (
  <ScrollView>
    <View style={styles.sectionContainer}>
      {fetchedData.map((ins, index) => (
        <View key={index} style={styles.infoCard}>
          <Text style={styles.infoText}>Applicant Name: {ins.name || "N/A"}</Text>
          <Text style={styles.infoText}>Applicant Email: {ins.email || "N/A"}</Text>
          <Text style={styles.infoText}>Applicant Contact Number: {ins.mobileNo || "N/A"}</Text>
          <Text style={styles.infoText}>Document Description: {ins.document_desc || "N/A"}</Text>
          <View style={styles.actionContainer}>
            <Text style={styles.infoText}>Action:</Text>
         
  <View style={styles.buttonContainer}>
    <TouchableOpacity
      style={[ styles.viewButton]} 
      onPress={() => handleViewImage(ins.documentPath)}
    >
      <Text style={styles.buttonText}>View</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.actionButton, styles.deleteButton]} 
      onPress={() => handleDelete(ins.eSignId
      )}
    >
      <Text style={styles.actionButtonText}>Delete</Text>
    </TouchableOpacity>
  </View>

 

          </View>
        </View>
      ))}
    </View>
  </ScrollView>
)}

<Modal
  animationType="fade"
  transparent={true}
  visible={viewImageModal}
  onRequestClose={() => setViewImageModal(false)}
>
  <View style={styles.imageModalOverlay}>
    <View>
      <TouchableOpacity style={styles.closeImageButton} onPress={() => setViewImageModal(false)}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>
      
      {currentImage ? (
        <Image source={{ uri: currentImage }} style={styles.fullImage} resizeMode="contain" />
      ) : (
        <Text style={styles.emptyText}>No image available</Text>
      )}
    </View>
  </View>
</Modal>
       
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Add Applicant</Text>

              <ScrollView style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <RequiredLabel text="Applicant Name" />
                  <TextInput
                    style={styles.textInput}
                    value={applicantName}
                    onChangeText={setApplicantName}
                    placeholder="Enter applicant name"
                  />
                  {errors.applicantName && <Text style={styles.errorText}>{errors.applicantName}</Text>}
                </View>

                <View style={styles.inputContainer}>
                  <RequiredLabel text="Applicant Email" />
                  <TextInput
                    style={styles.textInput}
                    value={applicantEmail}
                    onChangeText={setApplicantEmail}
                    placeholder="Enter applicant email"
                    keyboardType="email-address"
                  />
                  {errors.applicantEmail && <Text style={styles.errorText}>{errors.applicantEmail}</Text>}
                </View>

                <View style={styles.inputContainer}>
                  <RequiredLabel text="Applicant Contact Number" />
                  <TextInput
                    style={styles.textInput}
                    value={applicantContact}
                    onChangeText={setApplicantContact}
                    placeholder="Enter contact number"
                    keyboardType="phone-pad"
                  />
                  {errors.applicantContact && <Text style={styles.errorText}>{errors.applicantContact}</Text>}
                </View>

                <View style={styles.inputContainer}>
                  <RequiredLabel text="Signature Type" />
                  <View style={styles.radioContainer}>
                    <TouchableOpacity style={styles.radioOption} onPress={() => setSignatureType("aadhaar")}>
                      <View style={[styles.radioButton, signatureType === "aadhaar" && styles.radioButtonSelected]}>
                        {signatureType === "aadhaar" && <View style={styles.radioButtonInner} />}
                      </View>
                      <Text style={styles.radioLabel}>By Aadhaar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.radioOption} onPress={() => setSignatureType("mobile")}>
                      <View style={[styles.radioButton, signatureType === "mobile" && styles.radioButtonSelected]}>
                        {signatureType === "mobile" && <View style={styles.radioButtonInner} />}
                      </View>
                      <Text style={styles.radioLabel}>By Mobile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.radioOption} onPress={() => setSignatureType("physical")}>
                      <View style={[styles.radioButton, signatureType === "physical" && styles.radioButtonSelected]}>
                        {signatureType === "physical" && <View style={styles.radioButtonInner} />}
                      </View>
                      <Text style={styles.radioLabel}>By Physical</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Conditional inputs based on signature type */}
                {/* {signatureType === "aadhaar" && (
                  <View style={styles.inputContainer}>
                    <RequiredLabel text="Aadhaar Number" />
                    <View style={styles.aadhaarInputContainer}>
                      <TextInput
                        style={styles.aadhaarInput}
                        value={aadhaarPart1}
                        onChangeText={(text) => {
                          const cleaned = text.replace(/[^0-9]/g, '');
                          setAadhaarPart1(cleaned);
                          if (cleaned.length === 4) {
                            // Auto-focus next input
                            aadhaarInput2.current?.focus();
                          }
                        }}
                        placeholder="XXXX"
                        keyboardType="numeric"
                        maxLength={4}
                        ref={aadhaarInput1}
                      />
                      <Text style={styles.aadhaarSeparator}>-</Text>
                      <TextInput
                        style={styles.aadhaarInput}
                        value={aadhaarPart2}
                        onChangeText={(text) => {
                          const cleaned = text.replace(/[^0-9]/g, '');
                          setAadhaarPart2(cleaned);
                          if (cleaned.length === 4) {
                            // Auto-focus next input
                            aadhaarInput3.current?.focus();
                          } else if (cleaned.length === 0) {
                            // Go back to previous input
                            aadhaarInput1.current?.focus();
                          }
                        }}
                        placeholder="XXXX"
                        keyboardType="numeric"
                        maxLength={4}
                        ref={aadhaarInput2}
                      />
                      <Text style={styles.aadhaarSeparator}>-</Text>
                      <TextInput
                        style={styles.aadhaarInput}
                        value={aadhaarPart3}
                        onChangeText={(text) => {
                          const cleaned = text.replace(/[^0-9]/g, '');
                          setAadhaarPart3(cleaned);
                          if (cleaned.length === 0) {
                            // Go back to previous input
                            aadhaarInput2.current?.focus();
                          }
                        }}
                        placeholder="XXXX"
                        keyboardType="numeric"
                        maxLength={4}
                        ref={aadhaarInput3}
                      />
                    </View>
                    {errors.aadhaar && <Text style={styles.errorText}>{errors.aadhaar}</Text>}
                  </View>
                )} */}

                {signatureType === "physical" && (
                  <>
                    <View style={styles.inputContainer}>
                      <RequiredLabel text="Document Description" />
                      <TextInput
                        style={styles.textInput}
                        value={documentDescription}
                        onChangeText={setDocumentDescription}
                        placeholder="Enter document description"
                      />
                      {errors.documentDescription && <Text style={styles.errorText}>{errors.documentDescription}</Text>}
                    </View>

                    <View style={styles.inputContainer}>
                    <RequiredLabel text="Document Upload" />

      <TouchableOpacity style={styles.fileButton} onPress={handleChooseFile}>
        <Text style={styles.fileButtonText}>Choose File</Text>
      </TouchableOpacity>

      {errors.selectedDocument && <Text style={styles.errorText}>{errors.selectedDocument}</Text>}
    </View>
                  </>
                )}
              </ScrollView>

              <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.proceedButton]} onPress={handleProceed}>
                  <Text style={styles.buttonText}>Proceed</Text>
                </TouchableOpacity>


              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  label: {
    fontWeight: '400',
    marginBottom: 5,
    fontSize:16
  },
  actionButton: {
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    borderRadius: 5, // Rounded corners
    marginHorizontal: 4, // Space between buttons
  },
  deleteButton: {
    backgroundColor: '#FF4D4D', // Red background for Delete button
  },
  buttonText: {
    color: '#FFFFFF', // White text for View button
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionButtonText: {
    color: '#FFFFFF', // White text for Delete button
    fontSize: 14,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: "#0066cc",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    maxHeight: "80%",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  formContainer: {
    maxHeight: 400,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
    fontWeight: "500",
    flexDirection: "row",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  radioContainer: {
    flexDirection: "column",
    gap: 12,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#0066cc",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioButtonSelected: {
    borderColor: "#0066cc",
  },
  radioButtonInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#0066cc",
  },
  radioLabel: {
    fontSize: 16,
    color: "#333",
  },
  fileButton: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  fileButtonText: {
    color: "#333",
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  proceedButton: {
    backgroundColor: "#0066cc",
  },
  // buttonText: {
  //   fontSize: 16,
  //   fontWeight: "bold",
  //   color: "#333",
  // },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    padding: 15,
  },
  closeImageButton: {
    position: "absolute",
    top: 10,
    right: 80,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  imageModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: 500,
    height: 600,
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewButton: {
    backgroundColor: "#007bff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#333",
  },
  subheading: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
    color: "#666",
  },
  loadingContainer: {
    padding: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#ff6b6b",
    elevation: 2,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  retryText: {
    color: "#3366ff",
    marginTop: 10,
    textAlign: "center",
    textDecorationLine: "underline",
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
    gap: 20,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
    textAlign: "center",
    backgroundColor: "#e8e8e8",
    paddingVertical: 8,
    borderRadius: 4,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    borderLeftWidth: 3,
    borderLeftColor: "#0066cc",
  },
  infoText: {
    fontSize: 15,
    color: "#444",
    marginBottom: 6,
    fontWeight: "500",
  },
  noDataContainer: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginTop: 20,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
  },
  requiredAsterisk: {
    color: "red",
    marginLeft: 4,
  },
  aadhaarInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  aadhaarInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    textAlign: "center",
  },
  aadhaarSeparator: {
    fontSize: 20,
    marginHorizontal: 8,
    color: "#666",
  },
})

export default OfficerSignature