"use client"

import type React from "react"
import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,TextInput
} from "react-native"
import { Picker } from "@react-native-picker/picker"
import { useRoute, type RouteProp } from "@react-navigation/native"
import { getInspectionParameterResults } from "../database/Resumelistapi"

type RouteParams = {
  parameterRegResults: any[]
}

const ParameterResultsScreen: React.FC = () => {
  const route = useRoute<RouteProp<Record<string, RouteParams>>>()
  const { parameterRegResults } = route.params
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(null)
  const [inspectionData, setInspectionData] = useState<any[]>([])
  const [selectedParameter, setSelectedParameter] = useState<string>("")
  const [selectedScore, setSelectedScore] = useState<number | null>(null)

  const handleProceed = async (index: number) => {
    setCurrentItemIndex(index)
    setModalVisible(true)
    setLoading(true)

    try {
      const results = await getInspectionParameterResults()
      setLoading(false)
      setInspectionData(results || [])
      console.log("Received inspection parameter results for item", index, ":", results)
    } catch (error) {
      setLoading(false)
      console.error("Error fetching inspection parameter results:", error)
      Alert.alert("Error", "Failed to fetch inspection parameter results")
    }
  }

  // Find the score for the selected parameter
  const getScoreForSelectedParameter = () => {
    if (!selectedParameter) return null
    const selectedItem = inspectionData.find((item) => item.parameterResultName === selectedParameter)
    return selectedItem?.score || null
  }

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.registrationResultsContainer}>
          {/* <Text style={styles.resultsHeader}>Registration Results:</Text> */}
          {parameterRegResults.map((result, index) => (
            <View key={index} style={styles.resultItem}>
              <Text style={styles.resultLabel}>Group Name:</Text>
              <Text style={styles.resultValue}>{result.groupName}</Text>
              <Text style={styles.resultLabel}>Parameter:</Text>
              <Text style={styles.resultValue}>{result.parameterVal}</Text>
              <Text style={styles.resultLabel}>Maximum:</Text>
              <Text style={styles.resultValue}>{result.score}</Text>

              <TouchableOpacity style={styles.proceedButton} onPress={() => handleProceed(index)}>
                <Text style={styles.proceedButtonText}>Proceed</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Popup Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          if (!loading) setModalVisible(false)
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
      {/* <Text style={styles.selectedValueText}>{selectedParameter}</Text> */}
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
      setSelectedParameter(itemValue);
      
      // Find the selected parameter item
      const selectedItem = inspectionData.find(item => item.parameterResultName === itemValue);
      
      if (selectedItem) {
        // Apply the scoring logic based on priority and parameterResultId
        const priority = selectedItem.priority || 0;
        const parameterResultId = selectedItem.parameterResultId || 0;
        
        let score = 'NA';
        
        if (priority === 0) {
          if (parameterResultId === 1) score = 2;
          else if (parameterResultId === 2) score = 0;
          else if (parameterResultId === 3) score = 1;
          else if (parameterResultId === 4) score = 0;
        } else if (priority === 1) {
          if (parameterResultId === 1) score = 4;
          else if (parameterResultId === 2) score = 0;
          else if (parameterResultId === 3) score = 2;
          else if (parameterResultId === 4) score = 0;
        }
        
        setSelectedScore(typeof score === 'number' ? score : null);
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
 
                    {/* {selectedParameter && (
                      <View style={styles.scoreContainer}>
                        <Text style={styles.resultLabel}>Selected Score:</Text>
                        <Text style={styles.scoreValue}>{selectedScore !== null ? selectedScore : "N/A"}</Text>
                      </View>
                    )} */}
                  </View>
                ) : (
                  <Text style={styles.modalText}>No data available.</Text>
                )}
              </>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setModalVisible(false)
                setSelectedParameter("")
                setSelectedScore(null)
              }}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
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
  input: {
    padding: 12,
    fontSize: 16,
  },
  selectedValueText:{
color:'#000',
padding:10

  },
  selectedValueText1:{
    color:'#000',
    padding:10,
    fontSize:18
    
      },
  title:{
    fontWeight:500,
    marginTop:20,
    marginBottom:10,

    fontSize:16
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
    height: 20,
    padding:20,
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
    width: "95%",
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
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  textInputContainer: {
    marginBottom: 20,
  },
  textInputLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 8,
  },
  textInput: {
    height: 40,
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

