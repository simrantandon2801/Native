"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, SafeAreaView, Image, TouchableOpacity, Modal } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRoute, type RouteProp, useNavigation } from "@react-navigation/native"
import { getInspectionPreviewDetails, getKobNameReg, getSignaturePreview } from "../database/Previewapi"
import { viewInspectionDocument } from "../database/DocumentListapi"
import RNHTMLtoPDF from "react-native-html-to-pdf"
import RNFS from "react-native-fs"
import { getWitnessDetailsForRegistration } from "../database/Signatureapi"

interface PreviewDocumentsProps {
  visible: boolean
  onClose: () => void
  sectionId: number | null
  sectionName: string
  inspectionId: string
  assignmentId: any
  refId: any
}
interface OfficerSignature {
  name?: string;
  email?: string;
  mobileNo?: string;
  document_desc?: string;
  documentPath?: string;
  signaturetype?: string;
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
interface SignatureData {
  signaturetype: string;
  name: string;
  // Add other properties as needed
}
const Preview: React.FC = () => {
  const route = useRoute<RouteProp<Record<string, PreviewDocumentsProps>>>()
  const navigation = useNavigation()
  const { inspectionId, sectionName, assignmentId, refId } = route.params
  console.log("inspectionid", inspectionId, "sectionName", sectionName, "assignmentID", assignmentId, "refID", refId)

  const [isLoading, setIsLoading] = useState(false)
  const [signaturedataofficer, setsignaturedataofficer] = useState<SignatureData[]>([]);
  const [error, setError] = useState<string | null>(null)
    const [fetchedData, setfetchedData] = useState<WitnessDetail[]>([]);
  const [userId, setUserId] = useState<string | null>(null)
  const [documentDetails, setDocumentDetails] = useState<any>(null)
  const [inspectonDetails, setInspectonDetails] = useState<any>(null)
  const [scoreDetails, setscoreDetails] = useState<any>(null)
  const [sectionDetails, setsectionDetails] = useState<any>(null)
  const [viewImageModal, setViewImageModal] = useState(false)
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [kobData, setKobData] = useState<any>(null)
  const [signaturedata, setsignaturedata] = useState<any>(null)
  const [signatureofficerdatapreview, setsignatureofficerdatapreview] = useState<OfficerSignature[]>([]);

  const [loadingStates, setLoadingStates] = useState({})

  const fetchInspectionPreview = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const payload = {
        inspectionId: inspectionId,
        assignmentId: assignmentId,
      }

      console.log("Fetching inspection preview with:", payload)
      const response = await getInspectionPreviewDetails(payload)

      setDocumentDetails(response[0].documentDetails)
      console.log("sgdd", response[0].documentDetails)

      setInspectonDetails(response[0].inspectonDetails)
      console.log("wad", response[0].inspectonDetails)

      setscoreDetails(response[0].scoreDetails)
      console.log("hdd", response[0].scoreDetails)

      setsectionDetails(response[0].sectionDetails)
      console.log("hddhsd", response[0].sectionDetails)

      console.log("Inspection details received:", response)
    } catch (error) {
      console.error("Error fetching inspection details:", error)
      setError("Failed to load inspection details. Please try again.")
      Alert.alert("Error", "Failed to load inspection details. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewImage = async (documentPath: string) => {
    setIsLoading(true);
    try {
      const base64String = await viewInspectionDocument(documentPath)
  
      console.log("Base64 String:", base64String)
  
      if (!base64String) {
        throw new Error("Base64 string is undefined or empty")
      }
  
      setCurrentImage(base64String)
      setViewImageModal(true)
    } catch (error) {
      console.error("Error viewing document:", error)
      Alert.alert("Error", "Could not load the document. Please try again.")
    }finally {
      setIsLoading(false);
    }
  }
  
  useEffect(() => {
    console.log("Updated currentImage:", currentImage)
  }, [currentImage])

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

      // Show success message
      Alert.alert("Success", "PDF downloaded successfully to the Downloads folder!")
    } catch (error) {
      console.error("Error generating or saving PDF:", error)
      Alert.alert("Error", "Failed to generate or save PDF. Please try again.")
    }
  }

  const fetchKobNameReg = async () => {
    try {
      const response = await getKobNameReg(refId)
      setKobData(response[0].kobname)
      console.log("KOB name registration data received:", response)
    } catch (error) {
      console.error("Error fetching KOB name registration data:", error)
    }
  }

  const fetchpreviewsignature = async () => {
    try {
      const response = await getSignaturePreview(assignmentId, inspectionId)
      setsignaturedata(response)
      console.log("Signature Appplicant data :", response)
    } catch (error) {
      console.error("Error fetching signature data registration data:", error)
    }
  }

  const fetchpreviewofficersignature = async () => {
    try {
      const response = await getSignaturePreview(assignmentId, inspectionId);
      console.log(response);
  
      // Filter for "Inspection Officer" and "FSO"
      const officerSignatures = Array.isArray(response)
        ? response.filter(item => 
            ["Inspection Officer", "FSO"].includes(item.signaturetype)
          )
        : [];
  
      // Update state with filtered data
      setsignaturedataofficer(officerSignatures);
  
      // Log the filtered data for debugging
      console.log("Officer signature data length:", officerSignatures.length);
      console.log("First officer signature item:", officerSignatures[0]);
    } catch (error) {
      console.error("Error fetching officer signature data:", error);
    }
  };

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
    fetchKobNameReg() 
    fetchpreviewsignature()
    fetchpreviewofficersignature()
    fetchInspectionPreview()
  }, [inspectionId, assignmentId])

  const handleRetry = () => {
    fetchInspectionPreview()
  }
 
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.heading}>Auto Generated Inspection Report</Text>
            {/* <Text style={styles.subheading}>{sectionName}</Text> */}
          </View>

          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0066cc" />
              <Text style={styles.loadingText}>Loading inspection details...</Text>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Error: {error}</Text>
              <Text style={styles.retryText} onPress={handleRetry}>
                Tap to retry
              </Text>
            </View>
          )}

          {!isLoading && !error && (
            <View style={styles.contentContainer}>
              {inspectonDetails && (
                <View style={styles.sectionContainer}>
                  {/* <Text style={styles.sectionTitle}>Inspection Details</Text> */}
                
                  <View style={styles.infoCard}>
                    {/* <Text style={styles.infoText}>Applicant Name: {inspectonDetails.applicantName || "N/A"}</Text> */}
                    <Text style={styles.infoText}>Report ID: {inspectonDetails.inspectionId || "N/A"}</Text>
                    <Text style={styles.infoText}>Inspection Officer Name: {inspectonDetails.fsoName || "N/A"}</Text>
                    <Text style={styles.infoText}>Appliant Name: {inspectonDetails.companyName || "N/A"}</Text>
                    <Text style={styles.infoText}>Address: {inspectonDetails.address || "N/A"}</Text>
                    
                    <Text style={styles.infoText}>Inspection Date: {inspectonDetails.inspectionDate || "N/A"}</Text>
                    
                    <Text style={styles.infoText}>Applicant Certificate Number: {inspectonDetails.certificateNo || "N/A"}</Text>
                    <Text style={styles.infoText}>Inspection Officer UserId: {inspectonDetails.fsoId || "N/A"}</Text>
                    <Text style={styles.infoText}>Start Date Time: {inspectonDetails.startDateTime || "N/A"}</Text> 
                    
                    <Text style={styles.infoText}>End Date Time: {inspectonDetails.endDateTime || "N/A"}</Text> 
                    <Text style={styles.infoText}>Business Type: {kobData || "N/A"}</Text> 
                  </View>
                </View>
              )}

              {scoreDetails && (
                <View style={styles.sectionContainer}>
                  <Text style={styles.infoText}>Final score:</Text>
                
                  <View style={styles.infoCard1}>
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

              {sectionDetails && sectionDetails.length > 0 && (
                <View style={styles.sectionContainer}>
                  <Text style={styles.infoText1}>{sectionDetails[0]?.sectionName || "N/A"}</Text>

                  {/* Access the first section directly */}
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

              {documentDetails && documentDetails.length > 0 && (
                <View style={styles.sectionContainer}>
                  <Text style={styles.infoText1}>{sectionDetails[1]?.sectionName || "N/A"}</Text>
                  {documentDetails.map((document, index) => (
                    <View key={index} style={styles.infoCard}>
                      <Text style={styles.infoText}>Document Desc: {document.documentDesc || "N/A"}</Text>
                      <Text style={styles.infoText}>Report ID: {document.inspectionId || "N/A"}</Text>
                      <View style={styles.actionContainer}>
                        <Text style={styles.infoText}>Action:</Text>
                        <TouchableOpacity
                          style={styles.viewButton}
                          onPress={() => handleViewImage(document.documentPath)}
                        >
                          <Text style={styles.buttonText}>View</Text>
                        </TouchableOpacity>
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
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {signaturedata && signaturedata.length > 0 && (
                <View style={styles.sectionContainer}>
                  <Text style={styles.infoText1}>{sectionDetails[3]?.sectionName || "N/A"}</Text>
                  {signaturedata.map((signature, index) => (
                    <View key={index} style={styles.infoCard}>
                      <Text style={styles.infoText}>Applicant Name: {signature.name || "N/A"}</Text>
                      <Text style={styles.infoText}>Applicant Email: {signature.email || "N/A"}</Text>
                      <Text style={styles.infoText}>Applicant Contact No. {signature.mobileNo || "N/A"}</Text>
                      <Text style={styles.infoText}>Document Desciption: {signature.document_desc || "N/A"}</Text>

                      <View style={styles.actionContainer}>
                        <Text style={styles.infoText}>Action:</Text>
                        <TouchableOpacity
                          style={styles.viewButton}
                          onPress={() => handleViewImage(signature.documentPath)}
                        >
                          <Text style={styles.buttonText}>View</Text>
                        </TouchableOpacity>
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
                      </View>
                    </View>
                  ))}
                </View>
              )}
  <Text style={styles.infoText1}>{sectionDetails[4]?.sectionName || "N/A"}</Text>
{signaturedataofficer && signaturedataofficer.length > 0 && (
                <View style={styles.sectionContainer}>
                
                  {signaturedataofficer.map((signature, index) => (
                    <View key={index} style={styles.infoCard}>
                      <Text style={styles.infoText}>Applicant Name: {signature.name || "N/A"}</Text>
                      {/* <Text style={styles.infoText}>Applicant Email: {signature.email || "N/A"}</Text>
                      <Text style={styles.infoText}>Applicant Contact No. {signature.mobileNo || "N/A"}</Text>
                      <Text style={styles.infoText}>Document Desciption: {signature.document_desc || "N/A"}</Text> */}

                      <View style={styles.actionContainer}>
                        <Text style={styles.infoText}>Action:</Text>
                        <TouchableOpacity
                          style={styles.viewButton}
                          onPress={() => handleViewImage(signature.documentPath)}
                        >
                          <Text style={styles.buttonText}>View</Text>
                        </TouchableOpacity>
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
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
        <View style={styles.buttonContainer}>
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
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  parameterCard: {
    // backgroundColor: "#f9f9f9",
    padding: 10,
    // borderRadius: 5,
    // marginBottom: 6,
    // borderLeftWidth: 2,
    // borderLeftColor: "#0066cc",
  },
  infoText1: {
    fontSize: 18,
    color: "#444",
    marginBottom: 6,
    fontWeight: "500",
    textAlign: "center",
  },
  parameterText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
  buttonContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 10,
    marginBottom: 20,
    backgroundColor: '#f9f9f9', 
  },
  button: {
    flex: 1, 
    marginHorizontal: 5, 
    paddingVertical: 10, 
    backgroundColor: '#0066cc', 
    borderRadius: 5, 
    alignItems: 'center', 
  },
  buttonText: {
    color: '#ffffff', 
    fontSize: 16, 
    fontWeight: 'bold', 
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
    fontWeight: 500,
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
    color: "#ff3333",
    fontSize: 16,
    marginBottom: 8,
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
    // marginBottom: 24,
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
})

export default Preview