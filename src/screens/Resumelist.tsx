"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRoute, useNavigation, useFocusEffect, type RouteProp } from "@react-navigation/native"
// import { getListSendBackToFBOForClarification } from "../database/Sendbackradioapi"
import { getMasterInspectionParameterReg } from "../database/Resumelistapi"
import { getMasterInspectionSection } from "../database/Resumeapi"
import { getInspectionParameterResults } from "../database/Resumelistapi"
import AsyncStorage from "@react-native-async-storage/async-storage"

type RouteParams = {
  data: Section[]
  refId: string
  inspectionId: string
  assignmentId:number
}

interface Section {
  sectionName: string
  submittedFlag: boolean
  updatedBy: number | null
  createdBy: null
  regSectionUrl: string
  sectionId: number
  updatedOn: string
  createdOn: string
  activeFlag: boolean
}

const Resumelist: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute<RouteProp<Record<string, RouteParams>>>()
  const { data: initialData, refId, inspectionId,assignmentId } = route.params
  console.log("assishd",assignmentId)
  console.log("refID",refId)

  const [data, setData] = useState<Section[]>(initialData)
  const [selectedOption, setSelectedOption] = useState("forward")
  const [remarks, setRemarks] = useState("")
  const [parameterRegResults, setParameterRegResults] = useState<any[]>([])
  const [parameterResults, setParameterResults] = useState<any[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchSectionData = async (inspId: string, refId: string) => {
    try {
      setIsRefreshing(true)
      console.log("Refreshing section data for inspectionId:", inspId, "refId:", refId)

      // Use the same API that's used in handleResumePress
      const updatedSections = await getMasterInspectionSection(Number(inspId))
      console.log("Updated sections:", updatedSections)

      if (updatedSections && Array.isArray(updatedSections)) {
        setData(updatedSections)
      }
    } catch (error) {
      console.error("Error refreshing section data:", error)
      Alert.alert("Error", "Failed to refresh section data")
    } finally {
      setIsRefreshing(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      const checkRefreshFlag = async () => {
        try {
          const shouldRefresh = await AsyncStorage.getItem("refreshResumeList")

          if (shouldRefresh === "true") {
           
            const storedInspectionId = (await AsyncStorage.getItem("refreshInspectionId")) || inspectionId
            const storedRefId = (await AsyncStorage.getItem("refreshRefId")) || refId

            
            await AsyncStorage.removeItem("refreshResumeList")
            await AsyncStorage.removeItem("refreshInspectionId")
            await AsyncStorage.removeItem("refreshRefId")

           
            await fetchSectionData(storedInspectionId, storedRefId)
          }
        } catch (error) {
          console.error("Error checking refresh flag:", error)
        }
      }

      checkRefreshFlag()
    }, [inspectionId, refId]),
  )
  
  const handleResumePress = async (inspectionId: number, refId: number,sectionName:string,assignmentId:number,sectionId:number) => {
    try {
      console.log("Resume pressed for inspection ID:", inspectionId, "ref ID:", refId,"sectionName:",sectionName,"assignmentId",assignmentId,"sectionID",sectionId);
  
      const result = await getMasterInspectionSection(inspectionId);
      console.log("Resume API result:", result);
      console.log("dsdj",result)
      // navigation.navigate(sectionName as never, {
      //   parameterRegResults: regresult,
      //   inspectionId: inspectionId,
      //   refId: refId,
      // })
    } catch (error) {
      console.error("Error in resume API call:", error);
      Alert.alert("Error", "Failed to load inspection details. Please try again.");
    }
  };

  const handleSectionTap = async (sectionId: number, submittedFlag: boolean, sectionName: string,assignmentId:number,) => {
    console.log("AssigsddfrsfnmentID",assignmentId)
    console.log("sectionabhishek",sectionId)
    console.log("AssigsddfrsfnmentID",sectionName)
    try {
      const results = await getInspectionParameterResults()
      
      setParameterResults(results)
      console.log("Section details:", results)
      
      if (!refId || !inspectionId) {
        throw new Error("refId or inspectionId is missing")
      }
      
      const regresult = await getMasterInspectionParameterReg(refId, inspectionId, sectionId,)
      console.log("API Response:", regresult)
      console.log("dhs", regresult)
      console.log("sectionID",sectionId)
      
      console.log("Section name for navigation:", sectionName)
      
      const payload = {
        sectionId,
        inspectionId,
        refId,
        sectionName,
        assignmentId
        
      }
      console.log("Paylonad:", payload)//done
      
      if (submittedFlag) {
     
      } else {
      
        navigation.navigate(sectionName as never, {
          parameterRegResults: regresult,
          inspectionId: inspectionId,
          refId: refId,
          sectionName:sectionName,
          assignmentId:assignmentId,
          sectionId:sectionId
        })
        console.log("sectionNamnje",sectionName)
        console.log(assignmentId,"assignmentID")
        console.log("sectionID",sectionId)
      }
    } catch (error) {
      console.error("Error fetching section details:", error)
      Alert.alert("Error", "Failed to fetch section details. Please try again.")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {isRefreshing && (
        <View style={styles.refreshIndicator}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.refreshText}>Refreshing data...</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {data.map((section: Section) => (
          <TouchableOpacity
            key={section.sectionId}
            style={[
              styles.sectionItem,
              { borderLeftWidth: 4, borderLeftColor: section.submittedFlag ? "#4CAF50" : "red" },
              section.submittedFlag && styles.submittedSection,
            ]}
            onPress={() => handleSectionTap(section.sectionId, section.submittedFlag, section.sectionName,assignmentId)}
          >
            <View style={styles.sectionContent}>
              <Text style={styles.sectionName}>{section.sectionName}</Text>
              {section.submittedFlag && <Text style={styles.submittedText}>Submitted</Text>}
            </View>
          </TouchableOpacity>
        ))}
        {parameterRegResults.length > 0 && (
          <View style={styles.registrationResultsContainer}>
            <Text style={styles.resultsHeader}>Registration Results:</Text>
            {parameterRegResults.map((result, index) => (
              <View key={index} style={styles.resultItem}>
                <Text style={styles.resultLabel}>Parameter Value:</Text>
                <Text style={styles.resultValue}>{result.parameterVal}</Text>

                <Text style={styles.resultLabel}>Score:</Text>
                <Text style={styles.resultValue}>{result.score}</Text>

                <Text style={styles.resultLabel}>Group Name:</Text>
                <Text style={styles.resultValue}>{result.groupName}</Text>

                <Text style={styles.resultLabel}>Group ID:</Text>
                <Text style={styles.resultValue}>{result.groupId}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.radioContainer}>
          <TouchableOpacity style={styles.radioButton} onPress={() => setSelectedOption("forward")}>
            <View style={styles.radioButtonCircle}>
              {selectedOption === "forward" && <View style={styles.radioButtonInnerCircle} />}
            </View>
            <Text style={styles.radioButtonLabel}>Forward to NHB</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.radioButton} onPress={handleApiCall} disabled={isLoading}>
            <View style={styles.radioButtonCircle}>
              {selectedOption === "sendBack" && <View style={styles.radioButtonInnerCircle} />}
            </View>
            <Text style={styles.radioButtonLabel}>
              {isLoading ? "Loading..." : "Send Back to Applicant for Clarification"}
            </Text>
          </TouchableOpacity> */}
        </View>

        {selectedOption === "forward" && (
          <>
            <View style={styles.remarksContainer}>
              <Text style={styles.remarksLabel}>Remarks:</Text>
              <TextInput
                style={styles.textarea}
                value={remarks}
                onChangeText={setRemarks}
                multiline={true}
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity style={styles.finishButton}>
              <Text style={styles.finishButtonText}>Finish</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 16,
  },
  refreshIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 10,
    alignItems: "center",
    zIndex: 999,
  },
  refreshText: {
    marginTop: 8,
    color: "#007AFF",
    fontWeight: "500",
  },
  sectionItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionContent: {
    flex: 1,
  },
  sectionName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  radioContainer: {
    marginTop: 16,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
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
    fontSize: 16,
    color: "#333",
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
  finishButton: {
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Outfit",
    color: "#fff",
  },
  registrationResultsContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  resultsHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  resultItem: {
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
  },
  resultValue: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  submittedSection: {
    // borderBottomWidth: 2,
    // borderBottomColor: "#4CAF50",
    // backgroundColor: "rgba(76, 175, 80, 0.05)",
  },
  submittedText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
    marginTop: 4,
  },
})

export default Resumelist