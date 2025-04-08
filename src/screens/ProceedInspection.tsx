"use client"

import type React from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RouteProp } from "@react-navigation/native"
import { getKobNameReg } from "../database/Previewapi"
import { getScruitnizehistory } from "../database/Proceedscruitnizeinspection"
import { getListSendBackToFBOForClarification } from "../database/Sendbackradioapi" // Import the API function
import { useState, useEffect } from "react"
import { saveAcceptg, saveInspectionclarificationreg, saveRejectscritnize } from "../database/ProceedSubmitapi"

import AsyncStorage from "@react-native-async-storage/async-storage"
import { getListOffsounDerDoForReg } from "../database/Allocateapi"

// Define the type for route params
type ProceedInspectionParams = {
  displayRefId: string
  companyName: string
  inspectionDate: string
  inspectionType: string
  refId: string
  inspectionId: string
}
interface SendBackItem {
  sectionName: string
  observation: string
  score: number
  maximumScore: number
  comments: string
  isSelected: any
  sectionId: number
  assignmentId: number
}
const ProceedInspection: React.FC = () => {
  const route = useRoute<RouteProp<Record<string, ProceedInspectionParams>, string>>()
  const navigation = useNavigation<StackNavigationProp<any>>()
  const [kobData, setKobData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [remarks1, setRemarks1] = useState("")
  const [remarks, setRemarks] = useState("")
  const [remarks3, setRemarks3] = useState("")
  const [remarks5, setRemarks5] = useState("")
    const [loggedInUserId1, setLoggedInUserId1] = useState("")
   const [inspectors, setInspectors] = useState([])
  const [sendbacklist, setSendbacklist] = useState<SendBackItem[]>([])
  const [inspectionHistory, setInspectionHistory] = useState<any[]>([])
  const [selectedOption, setSelectedOption] = useState<string>("sendBack") // Default to "Send back to Applicant"

  const [isLoading, setIsLoading] = useState(false)
  const { displayRefId, companyName, inspectionDate, inspectionType, refId, inspectionId, assignmentId } =
    route.params || {}

  const fetchKobNameReg = async () => {
    try {
      const response = await getKobNameReg(refId)
      setKobData(response[0].kobname)
      console.log("KOB name registration data received:", response)
    } catch (error) {
      console.error("Error fetching KOB name registration data:", error)
    }
  }

  const fetchInspectionHistory = async () => {
    try {
      const response = await getScruitnizehistory(refId)
      setInspectionHistory(response)
      console.log("Inspection history data received:", response)
    } catch (error) {
      console.error("Error fetching inspection history:", error)
      setError("Failed to load inspection history.")
    }
  }

  useEffect(() => {
    const fetchDataFromAsyncStorage = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId")
        console.log("Retrieved User ID:", storedUserId)
      } catch (err) {
        console.error("Error fetching data from AsyncStorage:", err)
        setError("Failed to load data from storage.")
      }
    }

    fetchDataFromAsyncStorage()
    fetchKobNameReg()
    fetchInspectionHistory()
  }, [])

  const handleApiCall = async (refId: string, inspectionId: string) => {
    try {
      console.log("refID==", refId)
      console.log("inspectionID==", inspectionId)
      console.log("asdignmd", assignmentId)

      const response = await getListSendBackToFBOForClarification(refId, inspectionId)
      console.log("refID==", refId)

      console.log("inspectionID==", inspectionId)

      console.log("API Response:", response)
      setSendbacklist(response)

      return response
    } catch (error) {
      console.error("Error in handleApiCall:", error)
    }
  }
  const fetchInspectors = async (userId: string) => {
    try {
      // Make sure these variables are defined before using them
      // const refId = ...; // Define this variable
      // const inspectionId = ...; // Define this variable
      
      const response = await getListOffsounDerDoForReg(userId);
      
      // Only log these if they're defined
      // console.log("refID==", refId);
      // console.log("inspectionID==", inspectionId);
      
      console.log("API Response:", response);
      setSendbacklist(response);
      
      return response;
    } catch (error) {
      console.error("Error fetching inspectors:", error);
      return null; // Return null or appropriate error state
    }
  };
  const handleSubmit1 = async () => {
    if (!remarks1.trim()) {
      Alert.alert("Remarks is a mandatory field.")
      return
    }

    const selectedItems = sendbacklist.filter((item) => item.isSelected)
    if (selectedItems.length === 0) {
      Alert.alert("Please select at least one point to send for clarification.")
      return
    }

    try {
      const payload = {
        inspectionMasterClarificationRegistration: {
          inspectionId: Number.parseInt(inspectionId),
          refId: Number.parseInt(refId),
          roleId: 4,
          doRemarks: remarks1,
          fsoRemarks: null,
          createdBy: userId,
          updatedBy: userId,
        },
        inspectionClarificationRegistrationDetails: selectedItems.map((item) => ({
          sectionId: item.sectionId,
        })),
        assignmentId: assignmentId,
        statusId: "21",
      }

      console.log("Submitting payload:", payload)

      // Call the API
      const response = await saveInspectionclarificationreg(payload)
      console.log("API Response:", response)

      Alert.alert("Success", "Successfully sent for clarification", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Completed Inspection", { result: "success" }),
        },
      ])
    } catch (error) {
      console.error("Error submitting clarification:", error)
      Alert.alert("Failed to send for clarification. Please try again.")
    }
  }
  const handleSubmit2 = async () => {
    if (!remarks1.trim()) {
      Alert.alert("Remarks is a mandatory field.")
      return
    }

    const selectedItems = sendbacklist.filter((item) => item.isSelected)
    if (selectedItems.length === 0) {
      Alert.alert("Please select at least one point to send for clarification.")
      return
    }

    try {
      const payload = {
        inspectionMasterClarificationRegistration: {
          inspectionId: Number.parseInt(inspectionId),
          refId: Number.parseInt(refId),
          roleId: 4,
          doRemarks: remarks1,
          fsoRemarks: null,
          createdBy: userId,
          updatedBy: userId,
        },
        inspectionClarificationRegistrationDetails: selectedItems.map((item) => ({
          sectionId: item.sectionId,
        })),
        assignmentId: assignmentId,
        statusId: "21",
      }

      console.log("Submitting payload:", payload)

      // Call the API
      const response = await saveInspectionclarificationreg(payload)
      console.log("API Response:", response)

      Alert.alert("Success", "Successfully sent for clarification", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Completed Inspection", { result: "success" }),
        },
      ])
    } catch (error) {
      console.error("Error submitting clarification:", error)
      Alert.alert("Failed to send for clarification. Please try again.")
    }
  }
  const handleSubmit3 = async () => {
    if (!remarks3.trim()) {
      Alert.alert("Remarks is a mandatory field.")
      return
    }


    try {
      const payload = {
        statusId: 23,
  assignmentId: assignmentId,
  remarks: remarks3,
  inspectionId: inspectionId,
      }

      console.log("Submijxztting payload:", payload)

      // Call the API
      const response = await saveAcceptg(payload)
      console.log("API Response:", response)

      Alert.alert("Success", "Successfully sent ", [
        {
          text: "OK",
          onPress: () => navigation.pop(1),
        },
      ])
    } catch (error) {
      console.error("Error submitting Accept:", error)
      Alert.alert("Failed to send for Accept. Please try again.")
    }
  }
  const handleSubmit4 = async () => {
    if (!remarks.trim()) {
      Alert.alert("Remarks is a mandatory field.")
      return
    }

    const selectedItems = sendbacklist.filter((item) => item.isSelected)
    if (selectedItems.length === 0) {
      Alert.alert("Please select at least one point to send for clarification.")
      return
    }

    try {
      const payload = {
        inspectionMasterClarificationRegistration: {
          inspectionId: Number.parseInt(inspectionId),
          refId: Number.parseInt(refId),
          roleId: 4,
          doRemarks: remarks1,
          fsoRemarks: null,
          createdBy: userId,
          updatedBy: userId,
        },
        inspectionClarificationRegistrationDetails: selectedItems.map((item) => ({
          sectionId: item.sectionId,
        })),
        assignmentId: assignmentId,
        statusId: "21",
      }

      console.log("Submitting payload:", payload)

      // Call the API
      const response = await saveInspectionclarificationreg(payload)
      console.log("API Response:", response)

      Alert.alert("Success", "Successfully sent for clarification", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Completed Inspection", { result: "success" }),
        },
      ])
    } catch (error) {
      console.error("Error submitting clarification:", error)
      Alert.alert("Failed to send for clarification. Please try again.")
    }
  }
// Import Alert for user notifications

  const handlesubmit5 = async () => {
    console.log("Starting submission process...");
  
    try {
      // Define the payload dynamically
      const payload = {
        refId: refId, // Ensure this is defined elsewhere in your code
        fsoId: userId, // Ensure this is defined elsewhere in your code
        displayRefId: displayRefId, // Ensure this is defined elsewhere in your code
        labAddress: remarks5, // Ensure this is defined elsewhere in your code
        createdBy: userId, // Ensure this is defined elsewhere in your code
        assignmentId: assignmentId, // Ensure this is defined elsewhere in your code
        statusId: "7",
        preStatusId: "21",
      };
  
      console.log("Submitting with payload:", payload);
  
      // Call the API to save the data
      const response = await saveRejectscritnize(payload);
  
      console.log("Submission successful:", response);
  
      // Notify the user of success
      Alert.alert(
        "Success",
        "Document scrutinization processed successfully.",
        [
          {
            text: "OK",
            onPress: () => navigation.pop(1), // Navigate back after user confirms
          },
        ]
      );
  
      console.log("Successfully processed document scrutinization.");
    } catch (error) {
      console.error("Error in submission:", error);
  
      // Notify the user of failure
      Alert.alert(
        "Error",
        "Failed to process document scrutinization. Please try again.",
        [
          {
            text: "OK",
            onPress: () => {}, // No action needed on OK press
          },
        ]
      );
  
      console.log("Failed to process document scrutinization. Please try again.");
    }
  };
  
  // Execute the function

  const handleBack = () => {
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Reference ID:</Text>
            <Text style={styles.value}>{displayRefId || "N/A"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Company Name:</Text>
            <Text style={styles.value}>{companyName || "N/A"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Inspection Date:</Text>
            <Text style={styles.value}>{inspectionDate || "N/A"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Inspection Type:</Text>
            <Text style={styles.value}>{inspectionType || "N/A"}</Text>
          </View>
          <Text>Business Type: {kobData || "N/A"}</Text>
        </View>
        <Text style={styles.sectionTitle}>Inspection History</Text>
        <View style={styles.card}>
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : inspectionHistory.length > 0 ? (
            inspectionHistory.map((item, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.historyText}>Ref Id: {item.displayRefId || "N/A"}</Text>
                <Text style={styles.historyText}>Report Id: {item.inspectionId || "N/A"}</Text>
                <Text style={styles.historyText}>Inspection Officer Name: {item.fsoname || "N/A"}</Text>
                <Text style={styles.historyText}>Category of Inspection: {item.inspectionType || "N/A"}</Text>
                <Text style={styles.historyText}>Start Date Of Inspection: {item.startDateTime || "N/A"}</Text>
                <Text style={styles.historyText}>Remarks: {item.raRemarks || "N/A"}</Text>
                <Text style={styles.historyText}>End Date of Inspection: {item.endDateTime || "N/A"}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No inspection history available</Text>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.radioContainer}>
            <View>
              {/* Radio Button 1: Send Back to Applicant - Always visible */}
              <TouchableOpacity
                style={styles.radioButton}
                onPress={async () => {
                  setSelectedOption("sendBack")

                  try {
                    setIsLoading(true)
                    await handleApiCall(refId, inspectionId)
                  } catch (error) {
                    console.error("Error during API call:", error)
                  } finally {
                    setIsLoading(false)
                  }
                }}
              >
                <View style={styles.radioButtonCircle}>
                  {selectedOption === "sendBack" && <View style={styles.radioButtonInnerCircle} />}
                </View>
                <Text style={styles.radioButtonLabel}>
                  {isLoading ? "Loading..." : "Send Back to Applicant for Clarification"}
                </Text>
              </TouchableOpacity>

             
              {inspectionType !== "POST" && (
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={async () => {
                    setSelectedOption("Generate Certificate")

                    try {
                      setIsLoading(true)
                      // await handleApiCall(refId, inspectionId);
                    } catch (error) {
                      console.error("Error during API call:", error)
                    } finally {
                      setIsLoading(false)
                    }
                  }}
                >
                  <View style={styles.radioButtonCircle}>
                    {selectedOption === "Generate Certificate" && <View style={styles.radioButtonInnerCircle} />}
                  </View>
                  <Text style={styles.radioButtonLabel}>{isLoading ? "Loading..." : "Generate Certificate"}</Text>
                </TouchableOpacity>
              )}

              {/* Radio Button 3: Accept Inspection Report - Only visible if inspectionType is not 'PRE' */}
              {inspectionType !== "PRE" && (
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={async () => {
                    setSelectedOption("Accept Inspection Report")

                    try {
                      setIsLoading(true)
                      // await handleApiCall(refId, inspectionId);
                    } catch (error) {
                      console.error("Error during API call:", error)
                    } finally {
                      setIsLoading(false)
                    }
                  }}
                >
                  <View style={styles.radioButtonCircle}>
                    {selectedOption === "Accept Inspection Report" && <View style={styles.radioButtonInnerCircle} />}
                  </View>
                  <Text style={styles.radioButtonLabel}>{isLoading ? "Loading..." : "Accept Inspection Report"}</Text>
                </TouchableOpacity>
              )}

              {/* Radio Button 4: Re-inspection - Always visible */}
              <TouchableOpacity
  style={styles.radioButton}
  onPress={async () => {
    setSelectedOption("Re-inspection & Assign Inspection Officer");
    
    try {
      setIsLoading(true);
      await fetchInspectors(userId);
    } catch (error) {
      console.error("Error during API call:", error);
   
    } finally {
      setIsLoading(false);
    }
  }}
>
  <View style={styles.radioButtonCircle}>
    {selectedOption === "Re-inspection & Assign Inspection Officer" && (
      <View style={styles.radioButtonInnerCircle} />
    )}
  </View>
  <Text style={styles.radioButtonLabel}>
    {isLoading ? "Loading..." : "Re-inspection & Assign Inspection Officer"}
  </Text>
</TouchableOpacity>

              {/* Radio Button 5: Reject Application - Only visible if inspectionType is not 'POST' */}
              {inspectionType !== "POST" && (
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={async () => {
                    setSelectedOption("Reject Application")

                    try {
                      setIsLoading(true)
                      // await handleApiCall(refId, inspectionId);
                    } catch (error) {
                      console.error("Error during API call:", error)
                    } finally {
                      setIsLoading(false)
                    }
                  }}
                >
                  <View style={styles.radioButtonCircle}>
                    {selectedOption === "Reject Application" && <View style={styles.radioButtonInnerCircle} />}
                  </View>
                  <Text style={styles.radioButtonLabel}>{isLoading ? "Loading..." : "Reject Application"}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {selectedOption === "sendBack" && (
          <View style={styles.card}>
            {sendbacklist.length > 0 ? (
              sendbacklist.map((item, index) => (
                <View key={index} style={styles.historyItem}>
                  <Text style={styles.historyText}>Section: {item.sectionName || "N/A"}</Text>
                  <Text style={styles.historyText}>Observation: {item.observation || "N/A"}</Text>
                  <Text style={styles.historyText}>Maximum: {item.maximumScore || "0"}</Text>
                  <Text style={styles.historyText}>Score: {item.score || "0"}</Text>

                  <Text style={styles.historyText}>Comments: {item.comments || "N/A"}</Text>
                  <Text style={styles.historyText}>AssignmentID: {item.assignmentId || "N/A"}</Text>
                  <Text style={styles.sendBackLabel}>Points to be send for Clarification:</Text>
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => {
                      const updatedList = [...sendbacklist]
                      updatedList[index].isSelected = !updatedList[index].isSelected
                      setSendbacklist(updatedList)
                    }}
                  >
                    <Text style={styles.checkboxText}>{item.isSelected ? "✅" : "⬜"}</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No clarification data available</Text>
            )}
            <View style={styles.remarksContainer}>
              <Text style={styles.remarksLabel}>Remarks:</Text>
              <TextInput
                style={styles.textarea}
                value={remarks1}
                onChangeText={setRemarks1}
                numberOfLines={2}
                textAlignVertical="top"
                placeholder="Enter remarks here..."
              />
            </View>

            <View style={styles.optionButtonContainer}>
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit1}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {selectedOption === "Generate Certificate" && (
          <View style={styles.card}>
            <View style={styles.remarksContainer}>
              <Text style={styles.remarksLabel}>Remarks:</Text>
              <TextInput
                style={styles.textarea}
                value={remarks1}
                onChangeText={setRemarks1}
                numberOfLines={2}
                textAlignVertical="top"
                placeholder="Enter remarks here..."
              />
            </View>

         
            <View style={styles.optionButtonContainer}>
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.submitButton, !remarks3 ? styles.disabledButton : null]}
                onPress={handleSubmit2}
                disabled={!remarks3}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {selectedOption === "Accept Inspection Report" && (
          <View style={styles.card}>
            <View style={styles.remarksContainer}>
              <Text style={styles.remarksLabel}>Remarks:</Text>
              <TextInput
                style={styles.textarea}
                value={remarks3}
                onChangeText={setRemarks3}
                numberOfLines={2}
                textAlignVertical="top"
                placeholder="Enter remarks here..."
              />
            </View>


            <View style={styles.optionButtonContainer}>
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.submitButton, !remarks3 ? styles.disabledButton : null]}
                onPress={handleSubmit3}
                disabled={!remarks3}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {selectedOption === "Re-inspection & Assign Inspection Officer" && (
          <View style={styles.card}>
            <View style={styles.remarksContainer}>
              <Text style={styles.remarksLabel}>Remarks:</Text>
              <TextInput
                style={styles.textarea}
                value={remarks}
                onChangeText={setRemarks}
                numberOfLines={2}
                textAlignVertical="top"
                placeholder="Enter remarks here..."
              />
            </View>

            {/* Submit and Back buttons for Re-inspection option */}
            <View style={styles.optionButtonContainer}>
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.submitButton, !remarks ? styles.disabledButton : null]}
                onPress={handleSubmit4}
                disabled={!remarks}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {selectedOption === "Reject Application" && (
          <View style={styles.card}>
            <View style={styles.remarksContainer}>
              <Text style={styles.remarksLabel}>Remarks:</Text>
              <TextInput
                style={styles.textarea}
                value={remarks5}
                onChangeText={setRemarks5}
                numberOfLines={2}
                textAlignVertical="top"
                placeholder="Enter remarks here..."
              />
            </View>

            {/* Submit and Back buttons for Reject Application option */}
            <View style={styles.optionButtonContainer}>
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.submitButton, !remarks5 ? styles.disabledButton : null]}
                onPress={handlesubmit5}
                disabled={!remarks5}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flex: 1,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkbox: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 4,
    marginRight: 10,
  },
  historyItemContent: {
    flex: 1,
  },
  checkboxText: {
    fontSize: 16,
  },
  sendBackListContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  sendBackItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  remarksContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  remarksLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  textarea: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 14,
    textAlignVertical: "top",
    height: 100,
  },
  sendBackLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  sendBackValue: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  radioButtonCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonInnerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#333",
  },
  radioButtonLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  contentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#000",
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  label: {
    fontWeight: "500",
    width: 120,
    color: "#666",
    fontSize: 15,
  },
  value: {
    flex: 1,
    color: "#333",
    fontSize: 15,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
    textAlign: "center",
  },
  historyItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  historyText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  noDataText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  errorText: {
    fontSize: 14,
    color: "red",
    fontStyle: "italic",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  radioButtonSelected: {
    borderColor: "#007AFF",
  },
  radioButtonInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#007AFF",
  },
  radioLabel: {
    fontSize: 16,
    color: "#333",
  },
  // New styles for the option-specific button containers
  optionButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  backButton: {
    backgroundColor: "#6c757d",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#a0a0a0",
    opacity: 0.7,
  },
})

export default ProceedInspection
