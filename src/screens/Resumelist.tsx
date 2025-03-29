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
import { getListSendBackToFBOForClarification } from "../database/Sendbackradioapi"
import { Checkbox } from 'react-native-paper';
import { saveFinishForward, saveInspectionClarificationReg } from "../database/OfficerSignatureapi"
type RouteParams = {
  data: Section[]
  refId: string
  inspectionId: string
  assignmentId:number
}
interface SendBackItem {
  sectionName: string;
  observation: string;
  score: number;
  maximumScore:number
  comments:string
  isSelected:any // Assuming score is a number, adjust if it's a string
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
  const { data: initialData, refId, inspectionId,assignmentId, } = route.params
  console.log("assishd",assignmentId)
  console.log("refID",refId)
  

  const [data, setData] = useState<Section[]>(initialData)
  const [selectedOption, setSelectedOption] = useState("forward")
 const [sendbacklist, setSendbacklist] = useState<SendBackItem[]>([]); 
  const [remarks, setRemarks] = useState("")
  const [remarks1, setRemarks1] = useState("")
   const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState()
  const [parameterRegResults, setParameterRegResults] = useState<any[]>([])
  const [parameterResults, setParameterResults] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
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
      console.log("Resume pressed for inspection IDss:", inspectionId, "ref ID:", refId,"sectionName:",sectionName,"assignmentId",assignmentId,"sectionID",sectionId);
  
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
  const handleFinish2 = async (sendbacklist, signatureType) => {
    console.log("handlefinish called with", { sendbacklist, signatureType })

    if (!selectedOption) {
      Alert.alert("Please select an option (Forward or Send Back).")
      return
    }

   
    const selectedSections = sendbacklist.filter((item) => item.isSelected).map((item) => item.sectionId)

    if (selectedOption === "sendBack" && selectedSections.length === 0) {
      Alert.alert("Please select at least one reason for sending back")
      return
    }

   
    const isAllSectionsFilled = !data.some(
      (x) =>
        x.submittedFlag === false && x.sectionId !== 12 && x.sectionId !== 6 && x.sectionId !== 13 && x.sectionId !== 7,
    )

    if (!isAllSectionsFilled) {
      Alert.alert("Please fill all section fields.")
      return
    }

    try {
      setIsLoading(true)

      let roleId: number
      let doRemarks = ""
      let fsoRemarks = ""

      if (signatureType === "FSO") {
        fsoRemarks = remarks1
        roleId = 3
      } else {
        doRemarks = remarks1
        roleId = 4
      }

  
      const inspectionClarificationDetails = selectedSections.map((sectionId) => ({
        sectionId: sectionId,
      }))

      console.log("Selected sections for clarification:", inspectionClarificationDetails)

      const payload = {
        inspectionMasterClarificationRegistration: {
          inspectionId: inspectionId,
          refId: refId,
          roleId: roleId,
          doRemarks: doRemarks,
          fsoRemarks: fsoRemarks,
          createdBy: userId,
          updatedBy: userId,
        },
        inspectionClarificationRegistrationDetails: inspectionClarificationDetails,
        assignmentId: assignmentId,
        statusId: "20",
      }

      console.log("Sending payload:", payload)

      const response = await saveInspectionClarificationReg(payload)
      console.log("API response:", response)

      if (response.statusCode === "200") {
        Alert.alert("Success", "Inspection clarification sent successfully to Applicant.")
       
        setRemarks1("")
        navigation.navigate('Ongoinglist' as never);
      } else {
        Alert.alert("Error", "Some issue occurred. Kindly contact Administrator.")
      }
    } catch (error) {
      console.error("Error saving inspection clarification:", error)
      Alert.alert("Error", "Failed to save inspection clarification. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  const handleFinishPress = async () => {
    // Validate remarks field
    if (!remarks.trim()) {
      Alert.alert("Please fill Remarks.");
      return;
    }

    // Set loading state to true
    setIsLoading(true);

    // Prepare payload
    const payload = {
      statusId: "21",
      assignmentId: assignmentId,
      remarks: remarks,
      inspectionId: inspectionId,
    };

    try {
     
      const response = await saveFinishForward(payload);
      console.log("API Response:", response);

      setRemarks("");

      Alert.alert("Success", "Data saved successfully!");
      navigation.navigate('Ongoinglist' as never);
    } catch (error) {
      console.error("Error while saving data:", error);
      Alert.alert("Error", "Failed to save data. Please try again.");
    } finally {
     
      setIsLoading(false);
    }
  };
  const handleApiCall = async (refId:string,inspectionId:string) => {
    try {
      console.log("refID==",refId)
      console.log("inspectionID==",inspectionId)
     
      const response = await getListSendBackToFBOForClarification(refId, inspectionId);
      console.log("refID==",refId)
      console.log("inspectionID==",inspectionId)

  
   
      console.log("API Response:", response);
      setSendbacklist(response)
  
     
      return response; 
    } catch (error) {
     
      console.error("Error in handleApiCall:", error);
      Alert.alert("Error", "Failed to fetch data. Please try again.");
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

  
  <TouchableOpacity
    style={styles.radioButton}
    onPress={async () => {
      setSelectedOption("sendBack");

      try {
        setIsLoading(true);
        await handleApiCall(refId, inspectionId);
      } catch (error) {
        console.error("Error during API call:", error);
        Alert.alert("Error", "Failed to fetch data. Please try again.");
      } finally {
        setIsLoading(false);
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


  {selectedOption === "sendBack" && (
  <View style={styles.sendBackListContainer}>
    {sendbacklist.length > 0 ? (
      sendbacklist.map((item, index) => (
        <View key={index} style={styles.sendBackItem}>
         
          <Text style={styles.sendBackLabel}>Section Name:</Text>
          <Text style={styles.sendBackValue}>{item.sectionName || "N/A"}</Text>

       
          <Text style={styles.sendBackLabel}>Observation:</Text>
          <Text style={styles.sendBackValue}>{item.observation || "N/A"}</Text>

      
          <Text style={styles.sendBackLabel}>Score:</Text>
          <Text style={styles.sendBackValue}>{item.score || "N/A"}</Text>

          <Text style={styles.sendBackLabel}>Maximum:</Text>
          <Text style={styles.sendBackValue}>{item.maximumScore || "N/A"}</Text>

    
          <Text style={styles.sendBackLabel}>Remarks:</Text>
          <Text style={styles.sendBackValue}>{item.comments || "N/A"}</Text>

          <Text style={styles.sendBackLabel}>Points to be send for Clarification:</Text>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => {
            
              const updatedList = [...sendbacklist];
              updatedList[index].isSelected = !updatedList[index].isSelected;
              setSendbacklist(updatedList); 
            }}
          >
            <Text style={styles.checkboxText}>
              {item.isSelected ? "✅" : "⬜"}
            </Text>
          </TouchableOpacity>
        </View>
      ))
    ) : (
      <Text style={styles.noDataText}>No data available</Text>
    )}
  </View>
)}
</View>
{selectedOption === "forward" && (
        <>
          <View style={styles.remarksContainer}>
            <Text style={styles.remarksLabel}>Remarks:</Text>
            <TextInput
              style={styles.textarea}
              value={remarks}
              onChangeText={setRemarks}
              numberOfLines={2}
              textAlignVertical="top"
              placeholder="Enter remarks (mandatory)"
            />
          </View>

          {/* Conditional rendering of loader */}
          {isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#007BFF" />
            </View>
          ) : (
            <TouchableOpacity
              style={styles.finishButton}
              onPress={handleFinishPress}
              disabled={isLoading} // Disable button while loading
            >
              <Text style={styles.finishButtonText}>Finish</Text>
            </TouchableOpacity>
          )}
          </>
        )}
      {selectedOption === "sendBack" && (
  <>
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

    <TouchableOpacity
      style={styles.finishButton}
      onPress={() => handleFinish2(sendbacklist, "FSO")}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={styles.finishButtonText}>Finish</Text>
      )}
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
  loaderContainer: {
    alignItems: "center",
    justifyContent: "center",
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
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    marginTop: 20,
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
  checkbox: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    // borderWidth: 1,
    // borderColor: "#000",
    borderRadius: 5,
    marginBottom: 10,
  },
  checkboxText: {
    fontSize: 16,
  },
})

export default Resumelist