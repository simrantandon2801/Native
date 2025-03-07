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
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native"
import { Picker } from "@react-native-picker/picker"
import { useRoute, type RouteProp } from "@react-navigation/native"
import { getInspectionParameterResults } from "../database/Resumelistapi"
import { saveInspectionAsDraft } from "../database/SaveDraftapi"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { submitInspectionSection } from "../database/SubmitSectionapi"

type RouteParams = {
  parameterRegResults: any[]
}

const ParameterResultsScreen: React.FC = () => {
  const route = useRoute<RouteProp<Record<string, RouteParams>>>()
  const { parameterRegResults } = route.params
  const [modalVisible, setModalVisible] = useState(false)
  const [observation, setObservation] = useState("")
  const [comments, setComments] = useState("")
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(null)
  const [inspectionData, setInspectionData] = useState<any[]>([])
  const [selectedParameter, setSelectedParameter] = useState<string>("")
  const [selectedScore, setSelectedScore] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Track selected parameters and scores for each item
  const [parameterSelections, setParameterSelections] = useState<{
    [key: number]: {
      parameterName: string
      score: number | null
    }
  }>({})

  
  useEffect(() => {
    const loadSavedSelections = async () => {
      try {
        const savedSelectionsString = await AsyncStorage.getItem("parameterSelections")
        if (savedSelectionsString) {
          const savedSelections = JSON.parse(savedSelectionsString)
          setParameterSelections(savedSelections)
          console.log("Loaded saved selections:", savedSelections)
        }
      } catch (error) {
        console.error("Error loading saved selections:", error)
      }
    }

    loadSavedSelections()
  }, [])

  const handleProceed = async (index: number) => {
    setCurrentItemIndex(index)
    setModalVisible(true)
    setLoading(true)

    try {
      const results = await getInspectionParameterResults()
      setLoading(false)
      setInspectionData(results || [])

    
      if (parameterSelections[index]) {
        setSelectedParameter(parameterSelections[index].parameterName)
        setSelectedScore(parameterSelections[index].score)
      } else {
        setSelectedParameter("")
        setSelectedScore(null)
      }

      console.log("Received inspection parameter results for item", index, ":", results)
    } catch (error) {
      setLoading(false)
      console.error("Error fetching inspection parameter results:", error)
      Alert.alert("Error", "Failed to fetch inspection parameter results")
    }
  }
  const handleDone = () => {
    if (!selectedParameter) {
      return
    }

    console.log("Selected Parameter:", selectedParameter)
    console.log("Selected Score:", selectedScore)//fine

    handleCloseModal()
  }
  useEffect(() => {
    const fetchDataFromAsyncStorage = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const storedUserId = await AsyncStorage.getItem("userId")

        setUserId(storedUserId)

        console.log("Retrieved Data:", {
          userId: storedUserId,
        })
      } catch (err) {
        console.error("Error fetching data from AsyncStorage:", err)
        setError("Failed to load data from storage.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDataFromAsyncStorage()
  }, [])

  const handleCloseModal = async () => {
    if (currentItemIndex !== null && selectedParameter) {
      const updatedSelections = {
        ...parameterSelections,
        [currentItemIndex]: {
          parameterName: selectedParameter,
          score: selectedScore,
        },
      }

      setParameterSelections(updatedSelections)

      try {
        await AsyncStorage.setItem("parameterSelections", JSON.stringify(updatedSelections))
        console.log("Saved selections to AsyncStorage:", updatedSelections)
      } catch (error) {
        console.error("Error saving selections to AsyncStorage:", error)
      }
    }
    setModalVisible(false)
  }

  const handleSaveAsDraft = async () => {
    setLoading(true);

    try {
        const payload = {
            inspectionDetailsParametersRegistration: parameterRegResults.map((element, index) => ({
                updatedBy: userId,
                createdBy: userId,
                groupId: element.groupId,
                parameterVal: element.parameterVal,
                sectionId: element.sectionId,
                priority: element.priority,
                groupName: element.groupName,
                id: {
                    inspectionId: element.inspectionId,
                    parameterId: element.parameterId,
                },
                refId: element.refId ,
                parameterResultId: element.parameterResultId ,
                score: element.score,
                maxScore: element.maxScore || element.score || "",
                obtainedScore: selectedScore,
            })),
        };

        console.log("Save as draft payload:", payload);

        const response = await saveInspectionAsDraft(payload);
        console.log("Save as draft response:", response);

        try {
            await AsyncStorage.setItem("parameterSelections", JSON.stringify(parameterSelections));
        } catch (error) {
            console.error("Error saving selections to AsyncStorage:", error);
        }

        setLoading(false);
        Alert.alert("Draft saved successfully");
    } catch (error) {
        setLoading(false);
        console.error("Error saving draft:", error);
        Alert.alert("Error", "Failed to save draft");
    }
};


  const handleSubmitSection = async () => {
    if (!observation.trim()) {
      Alert.alert("Non-Conformance Observations is a required field")
      return
    }

    if (!comments.trim()) {
      Alert.alert("Comments is a required field")
      return
    }

    setLoading(true)

    try {
      const payload = {
        inspectionDetailsParametersRegistration: parameterRegResults.map((element, index) => ({
          updatedBy: userId,
          createdBy: userId,
          groupId: element.groupId,
          parameterVal: element.parameterVal,
          sectionId: element.sectionId,
          priority: element.priority,
          groupName: element.groupName,
          id: {
            inspectionId: element.inspectionId,
            parameterId: element.parameterId,
          },
          refId: element.refId || "",
          parameterResultId: element.parameterResultId,
          score: element.score,
          maxScore: element.score || "",
          obtainedScore: selectedScore,
        })),

        inspectionDetailsSectionRegistration: {
          id: {
            inspectionId: parameterRegResults[0]?.inspectionId,
            sectionId: parameterRegResults[0]?.sectionId,
          },
          createdBy: userId,
          updatedBy: userId,
          refId: parameterRegResults[0]?.refId || 0,
          observation: observation,
          isSubmitted: true,
          commnets: comments,
        },
      }

      console.log("Submit section payload:", payload)

      const response = await submitInspectionSection(payload)
      console.log("Submit section response:", response)

      setLoading(false)
      Alert.alert("Success", "Section submitted successfully")
    } catch (error) {
      setLoading(false)
      console.error("Error submitting section:", error)
      Alert.alert("Error", "Failed to submit section")
    }
  }

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.registrationResultsContainer}>
          {parameterRegResults.map((result, index) => (
            <View key={index} style={styles.resultItem}>
              <Text style={styles.resultLabel}>Group Name:</Text>
              <Text style={styles.resultValue}>{result.groupName}</Text>
              <Text style={styles.resultLabel}>Parameter:</Text>
              <Text style={styles.resultValue}>{result.parameterVal}</Text>
              <Text style={styles.resultLabel}>Maximum:</Text>
              <Text style={styles.resultValue}>{result.score}</Text>

              {parameterSelections[index] && (
                <View style={styles.selectionContainer}>
                  <Text style={styles.selectionLabel}>Selected Parameter:</Text>

                  <View style={styles.rowContainer}>
                    <Text style={styles.selectionValue}>{parameterSelections[index].parameterName}</Text>
                    <Text style={styles.selectionLabel}>Score:</Text>
                    <Text style={styles.selectionValue}>
                      {parameterSelections[index].score !== null ? parameterSelections[index].score : "N/A"}
                    </Text>
                  </View>
                </View>
              )}

              <TouchableOpacity style={styles.proceedButton} onPress={() => handleProceed(index)}>
                <Text style={styles.proceedButtonText}>Proceed</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <View style={styles.textInputContainer}>
          <Text style={styles.textInputLabel}>Non-Conformance Observations *</Text>
          <TextInput
            style={[styles.textInput, { textAlignVertical: "top" }]}
            multiline
            placeholder="Enter your observation"
            value={observation}
            onChangeText={setObservation}
          />
        </View>

        <View style={styles.textInputContainer}>
          <Text style={styles.textInputLabel}>Comments *</Text>
          <TextInput
            style={[styles.textInput, { textAlignVertical: "top" }]}
            multiline
            placeholder="Enter your comments"
            value={comments}
            onChangeText={setComments}
          />
        </View>
        <View>
          <Text style={styles.text}>
            Note: In the case of [Save As Draft], only changes done in verification dropdown list will be saved. Text
            entered in Non-Conformance observations and Comments fields will not be saved.
          </Text>
        </View>
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.draftButton} onPress={handleSaveAsDraft}>
            <Text style={styles.draftButtonText}>Save as Draft</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitSection}>
            <Text style={styles.submitButtonText}>Submit Section</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          if (!loading) handleCloseModal()
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            ) : (
              <>
                {inspectionData.length > 0 ? (
                  <View>
                    <Text style={styles.modalTitle}>Select Verification</Text>

                    {currentItemIndex !== null && (
                      <View style={styles.parameterDataContainer}>
                        <Text style={styles.resultLabel}>Group Name:</Text>
                        <Text style={styles.resultValue}>{parameterRegResults[currentItemIndex]?.groupName}</Text>
                        <Text style={styles.resultLabel}>Parameter:</Text>
                        <Text style={styles.resultValue}>{parameterRegResults[currentItemIndex]?.parameterVal}</Text>
                        <Text style={styles.resultLabel}>Maximum </Text>
                        <Text style={styles.resultValue}>{parameterRegResults[currentItemIndex]?.score}</Text>
                      </View>
                    )}
                    {selectedParameter && (
                      <View>
                        {selectedScore !== null && (
                          <Text style={styles.selectedValueText1}>Score: {selectedScore}</Text>
                        )}
                      </View>
                    )}
                    <Text style={styles.title}>Parameter result Name:</Text>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={selectedParameter}
                        onValueChange={(itemValue) => {
                          setSelectedParameter(itemValue)

                          const selectedItem = inspectionData.find((item) => item.parameterResultName === itemValue)

                          if (selectedItem) {
                            const priority = selectedItem.priority || 0
                            const parameterResultId = selectedItem.parameterResultId 

                            let score = "NA"

                            if (priority === 0) {
                              if (parameterResultId === 1) score = 2
                              else if (parameterResultId === 2) score = 0
                              else if (parameterResultId === 3) score = 1
                              else if (parameterResultId === 4) score = 0
                            } else if (priority === 1) {
                              if (parameterResultId === 1) score = 4
                              else if (parameterResultId === 2) score = 0
                              else if (parameterResultId === 3) score = 2
                              else if (parameterResultId === 4) score = 0
                            }

                            setSelectedScore(typeof score === "number" ? score : null)
                          }
                        }}
                        style={styles.picker}
                        dropdownIconColor="#666"
                      >
                        <Picker.Item label="Select Parameter" value="" />
                        {inspectionData.map((item, idx) => (
                          <Picker.Item key={idx} label={item.parameterResultName} value={item.parameterResultName} />
                        ))}
                      </Picker>
                      {selectedParameter && (
                        <View>
                          <Text style={styles.selectedValueText}>{selectedParameter}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                ) : (
                  <Text style={styles.modalText}>No data available.</Text>
                )}
              </>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.DoneButton} onPress={handleDone}>
                <Text style={styles.closeDoneText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  DoneButton: {
    // paddingLeft:20,
    paddingRight: 40,
  },
  closeDoneText: {},
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  rowContainer: {
    flexDirection: "row",
    gap: 50,

    marginTop: 5,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 20,
  },
  selectionContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  selectionLabel: {
    // fontSize: 14,
    fontWeight: "bold",
    color: "#555",
  },
  selectionValue: {
    fontSize: 14,
    color: "#1a1a1a",
    // marginBottom: 4,
  },
  draftButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  draftButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  text: {
    fontSize: 12,
    color: "grey",
  },
  input: {
    padding: 12,
    fontSize: 16,
  },
  selectedValueText: {
    color: "#000",
    padding: 10,
  },
  selectedValueText1: {
    color: "#000",
    padding: 10,
    fontSize: 18,
  },
  title: {
    fontWeight: "500",
    marginTop: 20,
    marginBottom: 10,
    fontSize: 16,
  },
  registrationResultsContainer: {
    // padding: 16,
    // backgroundColor: "#fff",
    // borderRadius: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  resultsHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  resultItem: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 6,
    // borderLeftWidth: 3,
    // borderLeftColor: "#007AFF",
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  proceedButton: {
    // backgroundColor: "#007AFF",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  proceedButtonText: {
    color: "#007AFF",
    fontSize: 14,
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
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingContainer: {
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
  closeButton: {
    paddingVertical: 12,

    width: 100,
    borderRadius: 6,
    alignItems: "center",
  },
  closeButtonText: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
  },
  textInputContainer: {
    marginBottom: 20,
  },
  textInputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 8,
  },
  textInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  parameterDataContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 6,
    // borderLeftWidth: 3,
    // borderLeftColor: "#007AFF",
  },
  scoreContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f0f8ff",
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#28a745",
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#28a745",
  },
})

export default ParameterResultsScreen

