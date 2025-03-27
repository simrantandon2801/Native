"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,Image,ActivityIndicator
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFocusEffect } from '@react-navigation/native';
import  { useCallback } from 'react';
import { useRoute, type RouteProp, useNavigation } from "@react-navigation/native"
import { deleteInspectionofficerSignature, getFssaiUserDetails, getSecEsignDetails, submitapioficer, updateSendInvitation } from "../database/OfficerSignatureapi"
import DocumentPicker from "react-native-document-picker"
import { getWitnessDetailsForRegistration, saveWitnessDetailsForRegistration } from "../database/Signatureapi"
import { viewInspectionDocument } from "../database/DocumentListapi"
import { getMasterInspectionSection } from "../database/Resumeapi"
import { submitInspectionSection } from "../database/SubmitSectionapi"
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
interface WitnessDetail {
  name: string;
  email: string;
  mobileNo: string;
  document_desc: string;
  documentPath: string;
  eSignId: string; 
  signatureType: string;
  secAssignmentId:number
}
interface Officer {
  officerType: any;
  secAssignmentId: any;
  isSigned: boolean;
}
const OfficerSignature: React.FC = () => {
  const route = useRoute<RouteProp<Record<string, PreviewDocumentsProps>>>()
  const navigation = useNavigation()
  const { inspectionId, assignmentId, refId ,sectionId} = route.params
  const [fetchedData, setfetchedData] = useState<WitnessDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentOfficerType, setCurrentOfficerType] = useState("");
const [currentSecAssignmentId, setCurrentSecAssignmentId] = useState(null);
  const [userId, setUserId] = useState()
  const [fetchedOfficerData, setFetchedOfficerData] = useState<any>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isHandToHandVisible, setIsHandToHandVisible] = useState(false);
  // Add state for FSSAI user details and signature modal
  const [fssaiUserDetails, setFssaiUserDetails] = useState<any>(null)
  const [isSignatureViewModalVisible, setIsSignatureModalVisible] = useState(false)
  const [storedUserId, setstoreduserId] = useState()
  const [applicantName, setApplicantName] = useState("")
   const [viewImageModal, setViewImageModal] = useState(false)
   const [babitaji, setbabitaji] = useState();
     const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)
  const [applicantEmail, setApplicantEmail] = useState("")
  const [applicantContact, setApplicantContact] = useState("")
  const [signatureType, setSignatureType] = useState("aadhaar")
  const [documentDescription, setDocumentDescription] = useState("")
  const [aadhaarPart3, setAadhaarPart3] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [aadhaarNumber, setAadhaarNumber] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [aadhaarPart1, setAadhaarPart1] = useState("")
 
  const [aadhaarPart2, setAadhaarPart2] = useState("")

  // Refs for aadhaar input fields
  // const aadhaarInput1 = useRef<TextInput>(null)
  // const aadhaarInput2 = useRef<TextInput>(null)
  // const aadhaarInput3 = useRef<TextInput>(null)
  const RequiredLabel = ({ text }: { text: string }) => (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text style={styles.inputLabel}>{text}</Text>
      <Text style={styles.requiredAsterisk}>*</Text>
    </View>
  )
  useEffect(() => {
    fetchEsignOfficer();
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
  const handleDelete = async (eSignId
      : string,secAssignmentId:number) => {
      try {
        if (!eSignId) {
          console.error("Generated code is undefined or null");
          Alert.alert("Error", "Invalid code . Please try again.");
          return;
        }
    
        console.log("Deleting document with generatedCode:", eSignId,secAssignmentId );
    
        const response = await deleteInspectionofficerSignature(eSignId,secAssignmentId
        );
        console.log("API Response:", response);
    
        
        fetchWitnessDetails();
    
        Alert.alert("Success", "Document deleted successfully");
      } catch (error) {
        console.error("Error deleting document:", error);
        Alert.alert("Error", "Failed to delete document.");
      }
    };
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!applicantName.trim()) {
      newErrors.applicantName = "Applicant name is required"
    }

    if (!applicantEmail.trim()) {
      newErrors.applicantEmail = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(applicantEmail)) {
      newErrors.applicantEmail = "Email is invalid"
    }

    if (!applicantContact.trim()) {
      newErrors.applicantContact = "Contact number is required"
    } else if (!/^\d{10}$/.test(applicantContact)) {
      newErrors.applicantContact = "Contact number must be 10 digits"
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
        newErrors.documentDescription = "Document description is required"
      }
      if (!selectedDocument) {
        newErrors.selectedDocument = "Document upload is required"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const handleSubmit = async (assignmentId: string) => {
    setIsLoading(true);
    console.log("Handle Submit Officer", assignmentId);
  
    try {
      // Ensure `inspectionId` is defined before using it
      if (!inspectionId) {
        throw new Error("inspectionId is undefined");
      }
  
      const witnessDetails = await getWitnessDetailsForRegistration(
        Number.parseInt(assignmentId),
        Number.parseInt(inspectionId)
      );
      console.log("Witness details fetched:", witnessDetails);
  
      if (witnessDetails.length === 0) {
        Alert.alert("Alert", "Please add Inspection Officer sign details.");
        setIsLoading(false);
        return;
      }
  
      const response = await submitapioficer(assignmentId);
      console.log("Assignment ID:", assignmentId);
      console.log("API Response:", response);
  
      if (response.statusCode === "200" && response.generatedCode === "false") {
        Alert.alert("Alert", "Please wait for E-sign officer to respond.");
        setIsLoading(false);
        return;
      }
  
      if (response && response.generatedCode === "true") {
        try {
          console.log("Submission successful, fetching master inspection section...");
  
          // Create inspection details object
          const inspectionDetails = {
            inspectionDetailsParametersRegistration: [],
            inspectionDetailsSectionRegistration: {
              id: {
                inspectionId: inspectionId,
                sectionId: sectionId,
              },
              createdBy: userId,
              updatedBy: userId,
              refId: refId,
              observation: null,
              isSubmitted: true,
              comments: null,
            },
          };
  
          console.log("Inspection Details Created:", inspectionDetails);
  
          const apiResponse = await submitInspectionSection(inspectionDetails);
          console.log("submitInspectionSection Response:", apiResponse);
  
          // Show success alert after both APIs complete successfully
          Alert.alert("Success", "Form submitted successfully!", [
            {
              text: "OK",
              onPress: async () => {
                try {
                  // Navigate back after performing the async operation
                  await AsyncStorage.setItem("refreshResumeList", "true");
                  navigation.pop(1); // Navigate back after the async operation completes
                } catch (error) {
                  console.error("Error while setting AsyncStorage item:", error);
                  Alert.alert("Error", "Failed to update the resume list.");
                }
              },
            }
          ]);
        } catch (submitError) {
          console.error("Error submitting inspection section:", submitError);
          Alert.alert("Error", "Failed to submit inspection section.");
        }
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  

  useFocusEffect(
    useCallback(() => {
      console.log("Screen focused");
    }, [inspectionId])
  );
  const fetchEsignOfficer = async () => {
    try {
      setIsLoading(true);
  
     
      const data= await getSecEsignDetails(Number.parseInt(assignmentId));
      console.log("Officer signature details fetched:", data);
      setbabitaji(data[0].secAssignmentId);
  
      // Extract secAssignmentId from the response
      // const secAssignmentId = data?.secAssignmentId;
      // setbabitaji(data.data[0].secAssignmentId)
  
      // if (secAssignmentId) {
      //   // Store secAssignmentId in AsyncStorage
      //   await AsyncStorage.setItem("secAssignmentId", secAssignmentId);
      //   console.log("secAssignmentId stored in AsyncStorage:", secAssignmentId);
      // } else {
      //   console.error("secAssignmentId is missing in the API response");
      // }
  
      // Update state with fetched data
      setFetchedOfficerData(data);
    } catch (err) {
      console.error("Error fetching officer signature details:", err);
      setError("Failed to load officer signature details.");
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = () => {
    setIsModalVisible(true)
    fetchEsignOfficer()
  }
  const openSignatureModal = (officerType, secAssignmentId) => {
    setCurrentOfficerType(officerType);
    setCurrentSecAssignmentId(secAssignmentId);
    setIsLoading(true);
    handleSignatureHere(officerType, secAssignmentId);
  }
  const closeModal = () => {
    setIsModalVisible(false)
  }
  const handleSendForSignature = async (secAssignmentId: number, email: string) => {
    try {
      setIsLoading(true)
      if (!email) {
        console.error("Email is missing.")
        Alert.alert("Error", "Email is missing. Please provide a valid email.")
        setIsLoading(false)
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
    }finally {
      setIsLoading(false)
    }
  }

  const handleSignatureHere = async (officerType:String,secAssignmentId:number) => {
    console.log("userID", userId)
    try {
      setIsLoading(true) 
      if (!userId) {
        Alert.alert("Error", "User ID not found")
        return
      }

     
      const response = await getFssaiUserDetails(userId)

     
      if (Array.isArray(response) && response.length > 0) {
 
        const data = response[0]

       
        setApplicantName(data.name || "")
        setApplicantEmail(data.email || "")
        setApplicantContact(data.mobileNo || "")
       

        
        setFssaiUserDetails(data)
        setIsSignatureModalVisible(true) 
      } else {
        Alert.alert("Error", "No user details found")
      }
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
    const numericValue = text.replace(/[^0-9]/g, "")
    if (numericValue.length <= 10) {
      setApplicantContact(numericValue)
    }

    if (numericValue.length !== 10) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        applicantContact: "Contact number must be exactly 10 digits.",
      }))
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        applicantContact: undefined,
      }))
    }
  }

  const handleChooseFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
      })

      console.log("Selected File:", res)

      setSelectedDocument(res[0])
      console.log("File stored successfully:", res[0])
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log("User canceled the document picker")
      } else {
        console.error("Error while selecting document:", err)
        setErrors({ selectedDocument: "Failed to select document" })
      }
    }
  }
  const closeSignatureModal = () => {
    setIsSignatureModalVisible(false)
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
  const handleProceed = async (officerType:string,secAssignmentId:number) => {
    // Validate the form before proceeding
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fill in all required fields.");
      return;
    }
  
    try {
      setIsLoading(true); 
  
     
      const payload = {
        assignmentId: assignmentId,
        inspectionId: Number.parseInt(inspectionId),
        refId: refId,
        name: applicantName,
        email: applicantEmail,
        mobileNo: applicantContact,
        aadharFirstDigit: signatureType === "aadhaar" ? aadhaarPart1 : null,
        aadharSecondDigit: signatureType === "aadhaar" ? `${aadhaarPart2}${aadhaarPart3}` : null,
        signatureType: "Inspection Officer",
        documentDesc: documentDescription,
        fssaiUserId: userId,
        verificationType: signatureType.toUpperCase(),
        officerType: officerType,
        isOfficer: true,
        secAssignmentId:secAssignmentId
      };
  
      console.log("------payload signature----", payload);
  
     
      const response = await saveWitnessDetailsForRegistration(payload, selectedDocument);
      console.log("API Response:", response);
     
     
      const esignDetails = await getSecEsignDetails(Number.parseInt(assignmentId));
      setFetchedOfficerData(esignDetails);
      console.log("Updating isSigned status for primary officer:", assignmentId);
      console.log("Fetched e-sign details:", esignDetails);
      console.log("secAsisignmtID",secAssignmentId)
  
     const data = await getWitnessDetailsForRegistration(
          parseInt(assignmentId), 
          parseInt(inspectionId)
        )
        console.log("Witness detaidls fetched:", data)
        setfetchedData(data)
      Alert.alert("Success", "E-sign Officer list saved successfully.");
  
      setShowPreview(true);
     
    } catch (error) {
 
      console.error("Error saving witness details:", error);
     
    } finally {
      setIsLoading(false);
    }
  };
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
  
    
    useEffect(() => {
    
      fetchWitnessDetails()
    }, [])
  const resetForm = () => {
    setApplicantName("")
    setApplicantEmail("")
    setApplicantContact("")
    setSignatureType("aadhaar")
    setAadhaarNumber("")
    setAadhaarPart1("")
    setAadhaarPart2("")
    setAadhaarPart3("")
    setDocumentDescription("")
    setSelectedDocument(null)
    setErrors({})
  }
  const filteredData = fetchedData.filter(
    (witness) =>
      witness.signatureType === "FSO" || witness.signatureType === "Inspection Officer"
  );
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.addButton} onPress={openModal}>
          <Text style={styles.addButtonText}>Add E-sign Inspection Officer</Text>
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.scrollcontainer}>
     
      {filteredData.length > 0 ? (
        <View>
          {filteredData.map((witness, index) => (
            <View key={index} style={styles.infoCard}>
              <Text style={styles.infoText}>Applicant Name: {witness.name || "N/A"}</Text>
              <Text style={styles.infoText}>Applicant Email: {witness.email || "N/A"}</Text>
              <Text style={styles.infoText}>
                Applicant Contact Number: {witness.mobileNo || "N/A"}
              </Text>
              <Text style={styles.infoText}>
                Document Description: {witness.document_desc || "N/A"}
              </Text>
              <View style={styles.actionContainer}>
                <Text style={styles.infoText}>Action:</Text>

                <View style={styles.buttonContainervd}>
                    
                      <TouchableOpacity
                        style={[styles.actionButton, styles.viewButton]}
                        onPress={() => handleViewImage(witness.documentPath)}
                      >
                        <Text style={styles.buttonText}>View</Text>
                      </TouchableOpacity>

                      {/* Delete Button */}
                      {witness.officerType === "P" ? (
                        <TouchableOpacity
                          style={[styles.actionButton, styles.deleteButton]}
                          onPress={async () => {
                            try {
                              handleDelete(witness.eSignId, babitaji)
                            } catch (error) {
                              console.error("Error handling delete action:", error)
                              Alert.alert("Error", "An unexpected error occurred. Please try again.")
                            }
                          }}
                        >
                          <Text style={styles.actionButtonText}>Delete</Text>
                        </TouchableOpacity>
                      ) : witness.officerType === "S" ? (
                        <Text style={styles.infoText}>N/A</Text>
                      ) : null}
                    </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        !isLoading && !error && (
          <Text style={styles.noDataText}></Text>
        )
      )}

     
       <View style={styles.buttonContainerRow}>
       <TouchableOpacity style={styles.submitButton} onPress={() => handleSubmit(assignmentId)} disabled={isLoading}>
      {isLoading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <Text style={styles.buttonText3}>Submit Section</Text>
      )}
    </TouchableOpacity>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText3}>Back</Text>
        </TouchableOpacity>
      </View> 
    </ScrollView>

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

                      <Text>Is E-signed: {officer.isSigned ? "E-Signed" : "Pending to E-sign"}</Text>
                      {officer.officerType === "S" &&
                        (officer.isInvited ? (
                          <Text style={styles.sentText}>Sent</Text>
                        ) : (
                          <TouchableOpacity
                            onPress={() => handleSendForSignature(officer.secAssignmentId, officer.email)}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <ActivityIndicator size="small" color="#007bff" />
                            ) : (
                              <Text style={styles.linkText}>Send for Signature</Text>
                            )}
                          </TouchableOpacity>
                        ))}

{officer.officerType === "P" &&
  (officer.isSigned ? (
    <Text style={styles.sentText}>Complete</Text>
  ) : (
    <TouchableOpacity
      style={styles.buttonContainer}
      onPress={() => openSignatureModal(officer.officerType, officer.secAssignmentId)}
    >
      <Text style={styles.buttonText}>Signature here</Text>
    </TouchableOpacity>
  ))}
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
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={closeSignatureModal}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>

          {isLoading ? (
            <Text>Loading...</Text>
          ) : fssaiUserDetails ? (
            <>
              {!showPreview ? (
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
                        {errors.documentDescription && (
                          <Text style={styles.errorText}>{errors.documentDescription}</Text>
                        )}
                      </View>

                      <View style={styles.inputContainer}>
                        <RequiredLabel text="Document Upload" />
                        <TouchableOpacity style={styles.fileButton} onPress={handleChooseFile}>
                          <Text style={styles.fileButtonText}>Choose File</Text>
                        </TouchableOpacity>
                        {selectedDocument && <Text style={styles.selectedFileText}>{selectedDocument.name}</Text>}
                        {errors.selectedDocument && <Text style={styles.errorText}>{errors.selectedDocument}</Text>}
                      </View>
                    </>
                  )}

                  <View style={styles.buttonRow}>
                    <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.button, styles.proceedButton]}
                      onPress={() => handleProceed(currentOfficerType, currentSecAssignmentId)}
                    >
                      <Text style={styles.buttonText}>Proceed</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              ) : (
                // This is where your preview component would go
                <View>
                  <Text>Preview content goes here</Text>
                </View>
              )}
            </>
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
  actionButtonText: {
    color: '#FFFFFF', // White text for Delete button
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonContainerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#0066cc",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  backButton: {
    backgroundColor: "#0066cc",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  buttonText3: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    padding: 15,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
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
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  viewButton: {
    backgroundColor: "#007bff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  scrollcontainer: {
    flexGrow: 1,
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
  previewContainer: {
    marginTop: 10,
    paddingBottom: 20,
  },
  selectedFileText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  previewItem: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  previewContent: {
    flexDirection: "row",
    marginBottom: 8,
  },
  previewLabel: {
    fontWeight: "500",
    width: "40%",
  },
  previewValue: {
    flex: 1,
  },
  previewActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
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
  buttonContainervd: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
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

