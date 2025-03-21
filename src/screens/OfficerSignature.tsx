"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Modal, Alert,TextInput } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRoute, type RouteProp, useNavigation } from "@react-navigation/native"
import { getFssaiUserDetails, getSecEsignDetails, updateSendInvitation } from "../database/OfficerSignatureapi"
import DocumentPicker from 'react-native-document-picker';
import { saveWitnessDetailsForRegistration } from "../database/Signatureapi"
// Add this function after the imports


interface PreviewDocumentsProps {
  visible: boolean
  onClose: () => void
  sectionId: number | null
  sectionName: string
  inspectionId: string
  assignmentId: any
  refId: any
}

const OfficerSignature: React.FC = () => {
  const route = useRoute<RouteProp<Record<string, PreviewDocumentsProps>>>()
  const navigation = useNavigation()
  const { inspectionId, assignmentId,refId } = route.params

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState()
  const [fetchedOfficerData, setFetchedOfficerData] = useState<any>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  
  // Add state for FSSAI user details and signature modal
  const [fssaiUserDetails, setFssaiUserDetails] = useState<any>(null)
  const [isSignatureViewModalVisible, setIsSignatureModalVisible] = useState(false)
  const[storedUserId,setstoreduserId]=useState()
  const [applicantName, setApplicantName] = useState("")
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)
  const [applicantEmail, setApplicantEmail] = useState("")
  const [applicantContact, setApplicantContact] = useState("")
  const [signatureType, setSignatureType] = useState("aadhaar")
  const [documentDescription, setDocumentDescription] = useState("")
    const [aadhaarPart3, setAadhaarPart3] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({})
    const [aadhaarNumber, setAadhaarNumber] = useState("")

    const [aadhaarPart1, setAadhaarPart1] = useState("");
    const [aadhaarPart2, setAadhaarPart2] = useState("");

  // Refs for aadhaar input fields
  // const aadhaarInput1 = useRef<TextInput>(null)
  // const aadhaarInput2 = useRef<TextInput>(null)
  // const aadhaarInput3 = useRef<TextInput>(null)
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
    if (!selectedDocument) {
      newErrors.selectedDocument = "Document upload is required"
      Alert.alert("Validation Error", "Please select a document to upload")
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
  const fetchEsignOfficer = async () => {
    try {
      setIsLoading(true)
      const data = await getSecEsignDetails(Number.parseInt(assignmentId))
      console.log("Officer signature details fetched:", data)
      setFetchedOfficerData(data)
    } catch (err) {
      console.error("Error fetching officer signature details:", err)
      setError("Failed to load officer signature details.")
    } finally {
      setIsLoading(false)
    }
  }
 

  const openModal = () => {
    setIsModalVisible(true)
    fetchEsignOfficer()
  }
  const openSignatureModal = () => {
    setIsSignatureModalVisible(true)
    handleSignatureHere()
  }
  const closeModal = () => {
    setIsModalVisible(false)
  }
  const handleSendForSignature = async (secAssignmentId: number, email: string) => {
    try {
      if (!email) {
        console.error("Email is missing.")
        Alert.alert("Error", "Email is missing. Please provide a valid email.")
        return
      }

      const response = await updateSendInvitation(secAssignmentId, email)
      console.log("sdgsuydgsahshek", response)

      if (response.statusCode === "200") {
        try {
          const esignDetails = await getSecEsignDetails(assignmentId)

          setFetchedOfficerData(esignDetails)
          console.log("Fetched e-sign details:", esignDetails)
        } catch (err) {
          console.log("Error fetching updated data:", err)
        }
      }

      console.log("Invitation sent successfully:", response)
      Alert.alert("Success", "Invitation sent successfully!")
    } catch (error) {
      console.error("Failed to send invitation:", error)
      Alert.alert("Error", "Failed to send invitation. Please try again.")
    }
  }

 
  const handleSignatureHere = async () => {
    console.log("userID",userId)
    try {
      setIsLoading(true)
      if (!userId) {
        Alert.alert("Error", "User ID not found")
        return
      }

      const data = await getFssaiUserDetails(userId)
      setFssaiUserDetails(data)
      setIsSignatureModalVisible(true)
    } catch (error) {
      console.error("Error fetching FSSAI user details:", error)
      Alert.alert("Error", "Failed to fetch user details")
    } finally {
      setIsLoading(false)
    }
  }
  const handleCancel = () => {
    setIsSignatureModalVisible(false)
    resetForm()
  }
  const handleApplicantContactChange = (text: string) => {
    
    const numericValue = text.replace(/[^0-9]/g, ""); 
    if (numericValue.length <= 10) {
      setApplicantContact(numericValue); 
    }
  

    if (numericValue.length !== 10) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        applicantContact: "Contact number must be exactly 10 digits.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        applicantContact: undefined, 
      }));
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
  const closeSignatureModal = () => {
    setIsSignatureModalVisible(false)
    resetForm()
  }
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
       if (response.statusCode === "200") {
        try {
          const esignDetails = await getSecEsignDetails(assignmentId)

          setFetchedOfficerData(esignDetails)
          console.log("Fetched e-sign details:", esignDetails)
        } catch (err) {
          console.log("Error fetching updated data:", err)
        }
      }
       Alert.alert("Success", "Witness details saved successfully.");
   
       setIsSignatureModalVisible(false);
       resetForm();
       setIsSignatureModalVisible(false)
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.addButton} onPress={openModal}>
          <Text style={styles.addButtonText}>Add Applicant</Text>
        </TouchableOpacity>

        <Modal visible={isModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>

              {isLoading ? (
                <Text>Loading...</Text>
              ) : error ? (
                <Text>Error: {error}</Text>
              ) : fetchedOfficerData && fetchedOfficerData.length > 0 ? (
                <ScrollView>
                  <Text style={styles.modalTitle}>E-Sign Officer List</Text>
                  {fetchedOfficerData.map((officer: any, index: number) => (
                    <View key={index} style={styles.officerContainer}>
                      <Text>Officer Name: {officer.fsoName || "N/A"}</Text>
                      <Text>Email: {officer.email || "N/A"}</Text>
                      <Text>Signature: {officer.officerType || "N/A"}</Text>

                      <Text>Is E-signed: {officer.isSigned ? "E-Signed" : "pending to E-sign"}</Text>
                      {officer.officerType === "S" &&
                        (officer.isInvited ? (
                          <Text style={styles.sentText}>Sent</Text>
                        ) : (
                          <TouchableOpacity
                            onPress={() => handleSendForSignature(officer.secAssignmentId, officer.email)}
                          >
                            <Text style={styles.linkText}>Send for Signature</Text>
                          </TouchableOpacity>
                        ))}

                      {officer.officerType === "P" && (officer.isSigned?( <Text style={styles.sentText}>Complete</Text>):

                        <TouchableOpacity style={styles.buttonContainer}  onPress={openSignatureModal}>
                          <Text style={styles.buttonText}>Signature here</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </ScrollView>
                
              ) : (
                <Text>No data available</Text>
              )}
            </View>
          </View>
        </Modal>
        
        <Modal visible={isSignatureViewModalVisible} animationType="fade" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={closeSignatureModal}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>

              {isLoading ? (
                <Text>Loading...</Text>
              ) : fssaiUserDetails ? (
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
                   onChangeText={handleApplicantContactChange} 
                   placeholder="Enter contact number"
                   keyboardType="phone-pad"
                   maxLength={10} 
                 />
                 {errors.applicantContact && (
                   <Text style={styles.errorText}>{errors.applicantContact}</Text>
                 )}
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
            <View style={styles.buttonRow}>
                           <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                             <Text style={styles.buttonText}>Cancel</Text>
                           </TouchableOpacity>
           
                           <TouchableOpacity style={[styles.button, styles.proceedButton]} onPress={handleProceed}>
                             <Text style={styles.buttonText}>Proceed</Text>
                           </TouchableOpacity>
           
           
                         </View>
                                 </>
                                 
                               )}
                               
                             </ScrollView>
                             
              ) : (
                <Text>No FSSAI user details available</Text>
              )}
              
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
  buttonText1: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
  buttonContainer5: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
  },
  buttonContainer: {
    backgroundColor: "#007bff",
    padding: 8,
    borderRadius: 5,
    width: 140,
    marginTop: 5,
    alignItems: "center",
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
    fontWeight: "500",
    flexDirection: "row",
  },
  requiredAsterisk: {
    color: "red",
    marginLeft: 4,
  },
  sentText: {
    color: "007bff",
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
  },
  officerContainer: {
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addButton: {
    backgroundColor: "#0066cc",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  linkText: {
    color: "blue",
    // textDecorationLine: 'underline',
    marginTop: 5,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 5,
  },
  // closeButtonText: {
  //   color: "#0066cc",
  //   fontWeight: "bold",
  //   fontSize: 20,
  // },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  // Added missing styles for the form
  formContainer: {
    maxHeight: 500,
    width: "100%",
  },
  inputContainer: {
    marginBottom: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
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
    marginRight: 8,
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
  },
  fileButton: {
    backgroundColor: "#0066cc",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  fileButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },
})

export default OfficerSignature

