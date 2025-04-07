"use client";

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Image
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute ,useNavigation} from '@react-navigation/native';

import { getInspectionPreviewDetails, getKobNameReg, getSignaturePreview } from "../database/Previewapi";
import { viewInspectionDocument } from "../database/DocumentListapi";
import RNHTMLtoPDF from "react-native-html-to-pdf"
import RNFS from "react-native-fs"
// Define TypeScript interfaces for API responses
interface DocumentDetails {
  [key: string]: any; // Replace with actual structure if known
}

interface InspectionDetails {
  inspectionId: string;
  fsoName: string;
  companyName: string;
  address: string;
  inspectionDate: string;
  certificateNo: string;
  fsoId: string;
  startDateTime: string;
  endDateTime: string;
}

interface ScoreDetails {
  [key: string]: any; // Replace with actual structure if known
}

interface SectionDetails {
  [key: string]: any; // Replace with actual structure if known
}

interface KobNameData {
  kobData?: string;
}

const SearchClick: React.FC = () => {
  const route = useRoute();
  const params = route.params || {};
   const navigation = useNavigation()
  const inspectionId = params.inspectionId || "";
   const assignmentId = params.assignmentId || "";
   const refId=params.refId||""
   
  
  const [documentDetails, setDocumentDetails] = useState<DocumentDetails[] | null>(null);
  const [inspectonDetails, setInspectionDetails] = useState<InspectionDetails | null>(null);
  const [scoreDetails, setScoreDetails] = useState<ScoreDetails | null>(null);
  const [sectionDetails, setSectionDetails] = useState<SectionDetails[] | null>(null);
  const [kobNameData, setKobNameData] = useState<KobNameData | null>(null);
  const [signaturedata, setsignaturedata] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewImageModal, setViewImageModal] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
 const [kobData, setKobData] = useState<any>(null)
  // Fetch inspection preview details
  const fetchInspectionsearch = async (inspectionId: string, assignmentId: number) => {
    if (!inspectionId || !assignmentId) {
      console.log("Missing inspectionId or assignmentId");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const payload = { inspectionId, assignmentId };
      console.log("Fetching inspection preview with payload:", payload);
      const response = await getInspectionPreviewDetails(payload);

      if (response && response[0]) {
        setDocumentDetails(response[0]?.documentDetails || []);
        setInspectionDetails(response[0]?.inspectonDetails || null);
        setScoreDetails(response[0]?.scoreDetails || null);
        setSectionDetails(response[0]?.sectionDetails || []);
      }

      console.log("Inspection details received:", response);
    } catch (error) {
      console.error("Error fetching inspection details:", error);
      setError("Failed to load inspection details. Please try again.");
      Alert.alert("Error", "Failed to load inspection details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleDownloadPrintDate = async () => {
    try {
      // Generate HTML content for the PDF
      const htmlContent = `
        <h1>Auto Generated Inspection Report</h1>
        <h2>Upload Documents</h2>
        ${documentDetails && documentDetails.length > 0
          ? documentDetails.map((doc, index) => `<p>Document Desc: ${doc.documentDesc || "N/A"}</p>`).join("")
          : "<p>No documents available</p>"}
        <h2>Inspection Details</h2>
        <p>Report ID: ${inspectonDetails?.inspectionId || "N/A"}</p>
        <p>Inspection Officer Name: ${inspectonDetails?.fsoName || "N/A"}</p>
        <p>Applicant Name: ${inspectonDetails?.companyName || "N/A"}</p>
        <p>Address: ${inspectonDetails?.address || "N/A"}</p>
        <p>Inspection Date: ${inspectonDetails?.inspectionDate || "N/A"}</p>
        <p>Applicant Certificate Number: ${inspectonDetails?.certificateNo || "N/A"}</p>
        <p>Inspection Officer UserId: ${inspectonDetails?.fsoId || "N/A"}</p>
        <p>Start Date Time: ${inspectonDetails?.startDateTime || "N/A"}</p>
        <p>End Date Time: ${inspectonDetails?.endDateTime || "N/A"}</p>
        <p>Business Type: ${kobData || "N/A"}</p>
        <p>Obtained Percentage: ${scoreDetails?.obtainedpercentage || "N/A"}</p>
        <p>Total Max: ${scoreDetails?.totalmax || "N/A"}</p>
        <p>Total Obtained: ${scoreDetails?.totalobtained || "N/A"}</p>
        <h2>Update Inspection Checklist</h2>
        ${sectionDetails && sectionDetails.length > 0
          ? sectionDetails.map((section, index) => `<p>Observation: ${section.observation || "N/A"}</p>`).join("")
          : "<p>No section details available</p>"}
        
        <h2>Applicant Signatures</h2>
        ${signaturedata && signaturedata.length > 0
          ? signaturedata
              .filter(signature => signature && signature.signatureType === "APPLICANT")
              .map((signature, index) => `
                <p>Applicant Name: ${signature.name || "N/A"}</p>
                <p>Applicant Email: ${signature.email || "N/A"}</p>
                <p>Applicant Contact No: ${signature.mobileNo || "N/A"}</p>
                <p>Document Description: ${signature.document_desc || "N/A"}</p>
              `).join("<hr>")
          : "<p>No applicant signatures available</p>"}
        
        <h2>Officer Signatures</h2>
        ${signaturedata && signaturedata.length > 0
          ? signaturedata
              .filter(signature => signature && (signature.signatureType === "FSO" || signature.signatureType === "Inspection Officer"))
              .map((signature, index) => `
                <p>Officer Name: ${signature.name || "N/A"}</p>
                <p>Officer Email: ${signature.email || "N/A"}</p>
                <p>Officer Contact No: ${signature.mobileNo || "N/A"}</p>
                <p>Document Description: ${signature.document_desc || "N/A"}</p>
              `).join("<hr>")
          : "<p>No officer signatures available</p>"}
      `
  
      // Generate PDF using react-native-html-to-pdf
      const pdfOptions = {
        html: htmlContent,
        fileName: `Inspection_Report_${inspectionId}`,
        directory: "Documents", // Temporary directory
      }
  
      const pdf = await RNHTMLtoPDF.convert(pdfOptions)
      console.log("PDF generated at:", pdf.filePath)
  
      // Define the Downloads directory path
      const downloadDir = `${RNFS.DownloadDirectoryPath}/Inspection_Report_${inspectionId}.pdf`
  
      // Move the file to the Downloads directory
      await RNFS.moveFile(pdf.filePath, downloadDir)
      console.log("PDF moved to Downloads folder:", downloadDir)
  
      Alert.alert("Success", "PDF downloaded successfully to the Downloads folder!")
    } catch (error) {
      console.error("Error generating or saving PDF:", error)
      Alert.alert("Error", "Failed to generate or save PDF. Please try again.")
    }
  }
  const handleViewImage = async (documentPath: string) => {
    if (!documentPath) {
      Alert.alert("Error", "Document path is missing");
      return;
    }
    
    setIsLoading(true);
    try {
      const base64String = await viewInspectionDocument(documentPath);
  
      console.log("Base64 String received");
  
      if (!base64String) {
        throw new Error("Base64 string is undefined or empty");
      }
  
      setCurrentImage(base64String);
      setViewImageModal(true);
    } catch (error) {
      console.error("Error viewing document:", error);
      Alert.alert("Error", "Could not load the document. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    console.log("Updated currentImage status:", currentImage ? "received" : "not set");
  }, [currentImage]);
  
  //  const fetchKobNameReg = async (refId:string) => {
  //   console.log(refId,"jsa")
  //    try {
  //      const response = await getKobNameReg(refId)
  //      setKobData(response[0].kobname)
  //      console.log("KOB name registration data received:", response)
  //    } catch (error) {
  //      console.error("Error fetching KOB name registration data:", error)
  //    }
  //  }

  const fetchpreviewsignature = async () => {
    if (!assignmentId || !inspectionId) {
      console.log("Missing assignmentId or inspectionId for signature preview");
      return;
    }
    
    try {
      const response = await getSignaturePreview(assignmentId, inspectionId);
      if (Array.isArray(response)) {
        setsignaturedata(response);
        console.log("Signature Applicant data received:", response.length, "items");
      } else {
        setsignaturedata([]);
        console.log("Signature data is not an array, setting to empty array");
      }
    } catch (error) {
      console.error("Error fetching signature data:", error);
      setsignaturedata([]);
    }
  };

  useEffect(() => {
    const fetchDataFromAsyncStorage = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        console.log("Retrieved User ID:", storedUserId);
      } catch (err) {
        console.error("Error fetching data from AsyncStorage:", err);
        setError("Failed to load data from storage.");
      };
    };

    fetchDataFromAsyncStorage();
    
    if (inspectionId && assignmentId) {
      fetchInspectionsearch(inspectionId, assignmentId);
      fetchpreviewsignature();
      // fetchKobNameReg();
   
    } else {
      console.log("Missing inspectionId or assignmentId, cannot fetch data");
    }
  }, [inspectionId, assignmentId,refId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.heading}>Auto Generated Inspection Report</Text>
          </View>

          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0066cc" />
              <Text style={styles.loadingText}>Loading inspection details...</Text>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {inspectonDetails && (
            <View style={styles.sectionContainer}>
              <View style={styles.infoCard}>
                <Text style={styles.infoText}>Report ID: {inspectonDetails.inspectionId || "N/A"}</Text>
                <Text style={styles.infoText}>Inspection Officer Name: {inspectonDetails.fsoName || "N/A"}</Text>
                <Text style={styles.infoText}>Applicant Name: {inspectonDetails.companyName || "N/A"}</Text>
                <Text style={styles.infoText}>Address: {inspectonDetails.address || "N/A"}</Text>
                <Text style={styles.infoText}>Inspection Date: {inspectonDetails.inspectionDate || "N/A"}</Text>
                <Text style={styles.infoText}>Applicant Certificate Number: {inspectonDetails.certificateNo || "N/A"}</Text>
                <Text style={styles.infoText}>Inspection Officer UserId: {inspectonDetails.fsoId || "N/A"}</Text>
                <Text style={styles.infoText}>Start Date Time: {inspectonDetails.startDateTime || "N/A"}</Text>
                <Text style={styles.infoText}>End Date Time: {inspectonDetails.endDateTime || "N/A"}</Text>
             
              </View>
            </View>
          )}
          
          {scoreDetails && (
            <View style={styles.sectionContainer}>
              <Text style={styles.infoText}>Final score:</Text>
            
              <View>
                <Text style={styles.infoText}>
                  Obtained Percentage: {scoreDetails.obtainedpercentage || "N/A"}
                </Text>
                <Text style={styles.infoText}>
                  Total Max: {scoreDetails.totalmax || "N/A"}
                </Text>
                <Text style={styles.infoText}>
                  Total Obtained: {scoreDetails.totalobtained || "N/A"}
                </Text>
              </View>
            </View>
          )}
          
          {sectionDetails && sectionDetails.length > 0 && sectionDetails[0] && (
            <View style={styles.sectionContainer}>
              <Text style={styles.infoText1}>{sectionDetails[0]?.sectionName || "N/A"}</Text>

              <View style={styles.infoCard}>
                <Text style={styles.infoText}>
                  Observation: {sectionDetails[0].observation || "N/A"}
                </Text>
                <Text style={styles.infoText}>
                  Comments: {sectionDetails[0].commnets || "N/A"}
                </Text>
                <Text style={styles.infoText}>
                  Submission Date: {sectionDetails[0].endDateTime || "N/A"}
                </Text>

                {sectionDetails[0].parameterDetails && sectionDetails[0].parameterDetails.length > 0 ? (
                  <View style={{ marginTop: 10 }}>
                    {sectionDetails[0].parameterDetails.map((param, paramIndex) => (
                      <View key={paramIndex} style={styles.parameterCard}>
                        <Text style={styles.parameterText}>
                          Group Name: {param.groupName || "N/A"}
                        </Text>
                        <Text style={styles.parameterText}>
                          Parameters: {param.parameterVal || "N/A"}
                        </Text>
                        <Text style={styles.parameterText}>
                          Max Score: {param.maxScore || "N/A"}
                        </Text>
                        <Text style={styles.parameterText}>
                          Score Obtained: {param.obtainedScore || "N/A"}
                        </Text>
                        <Text style={styles.parameterText}>
                          Inspection: {param.parameterResultName || "N/A"}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.noDataText}></Text>
                )}
              </View>
            </View>
          )}
                        
          {documentDetails && documentDetails.length > 0 ? (
            <View style={styles.sectionContainer}>
              <Text style={styles.infoText1}>
                {sectionDetails && sectionDetails.length > 1 && sectionDetails[1] 
                  ? sectionDetails[1].sectionName || "Documents" 
                  : "Documents"}
              </Text>
              {documentDetails.map((document, index) => (
                <View key={index} style={styles.infoCard}>
                  <Text style={styles.infoText}>Document Desc: {document.documentDesc || "N/A"}</Text>
                  <View style={styles.actionContainer}>
                    <Text style={styles.infoText}>Action:</Text>
                    <TouchableOpacity 
                      style={styles.viewButton} 
                      onPress={() => document.documentPath ? handleViewImage(document.documentPath) : Alert.alert("Error", "Document path is missing")}
                    >
                      <Text style={styles.buttonText}>View</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.sectionContainer}>
              <Text style={styles.infoText1}>Documents</Text>
              <View style={styles.infoCard}>
                <Text style={styles.infoText}>No documents available</Text>
              </View>
            </View>
          )}
          
          {signaturedata && signaturedata.length > 0 && (
  <View style={styles.sectionContainer}>
    <Text style={styles.infoText1}>
      {sectionDetails && sectionDetails.length > 3 && sectionDetails[3] 
        ? sectionDetails[3].sectionName || "Signatures" 
        : "Signatures"}
    </Text>
    {signaturedata
      .filter(signature => 
        signature && 
        (signature.signatureType === "APPLICANT")
      )
      .map((signature, index) => (
        <View key={index} style={styles.infoCard}>
          <Text style={styles.infoText}>Applicant Name: {signature.name || "N/A"}</Text>
          <Text style={styles.infoText}>Applicant Email: {signature.email || "N/A"}</Text>
          <Text style={styles.infoText}>Applicant Contact No. {signature.mobileNo || "N/A"}</Text>
          <Text style={styles.infoText}>Document Desciption: {signature.document_desc || "N/A"}</Text>

          <View style={styles.actionContainer}>
            <Text style={styles.infoText}>Action:</Text>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => signature.documentPath ? handleViewImage(signature.documentPath) : Alert.alert("Error", "Document path is missing")}
            >
              <Text style={styles.buttonText}>View</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
  </View>
)}
          
          {/* Filtered signature data section */}
          {signaturedata && signaturedata.length > 0 && (
            (() => {
              // Filter the data safely
              const filteredData = signaturedata.filter(
                (signature) => 
                  signature && 
                  (signature.signatureType === "FSO" || signature.signatureType === "Inspection Officer")
              );
              
              return filteredData.length > 0 ? (
                <View style={styles.sectionContainer}>
                  <Text style={styles.infoText1}>
                    {sectionDetails && sectionDetails.length > 4 && sectionDetails[4] 
                      ? sectionDetails[4].sectionName || "Officer Signatures" 
                      : "Officer Signatures"}
                  </Text>
                  {filteredData.map((signature, index) => (
                    <View key={index} style={styles.infoCard}>
                      <Text style={styles.infoText}>Applicant Name: {signature.name || "N/A"}</Text>
                      <Text style={styles.infoText}>Applicant Email: {signature.email || "N/A"}</Text>
                      <Text style={styles.infoText}>Applicant Contact No. {signature.mobileNo || "N/A"}</Text>
                      <Text style={styles.infoText}>Document Desciption: {signature.document_desc || "N/A"}</Text>

                      <View style={styles.actionContainer}>
                        <Text style={styles.infoText}>Action:</Text>
                        <TouchableOpacity
                          style={styles.viewButton}
                          onPress={() => signature.documentPath ? handleViewImage(signature.documentPath) : Alert.alert("Error", "Document path is missing")}
                        >
                          <Text style={styles.buttonText}>View</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              ) : null;
            })()
          )}
          
          {/* Single modal for all image viewing */}
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
              <View style={styles.buttonContainerD}>
                    <TouchableOpacity 
                      style={styles.button}
                      onPress={() => handleDownloadPrintDate()} 
                    >
                      <Text style={styles.buttonText}>Download Print Date</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.button}
                      onPress={() => navigation.goBack()} 
                    >
                      <Text style={styles.buttonText}>Back</Text>
                    </TouchableOpacity>
                  </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
  infoText1: {
    fontSize: 18,
    color: "#444",
    marginBottom: 6,
    fontWeight: "500",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    padding: 15,
  },
  buttonContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 10,
    marginBottom: 20,
    backgroundColor: '#f9f9f9', 
  },
  buttonContainerD: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    // paddingHorizontal: 20, 
    // paddingVertical: 10,
    marginBottom: 20,
 
    backgroundColor: '#f9f9f9', 
  },
  button: {
    flex: 1, 
    marginHorizontal: 5, 
    paddingVertical: 10, 
    backgroundColor: '#0066cc', 
    borderRadius: 5, 
    width:100,
    alignItems: 'center', 
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
  scrollView: {
    flex: 1,
  },
  buttonText: {
    color: '#ffffff', 
    fontSize: 14, 
    fontWeight: 'bold', 
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
  },
  parameterCard: {
    padding: 10,
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
  parameterText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  heading: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 8,
    textAlign: "center",
    color: "#333",
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
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#ff4d4d",
    fontSize: 16,
    textAlign: "center",
  },
  sectionContainer: {
    marginTop: 20,
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
});

export default SearchClick;