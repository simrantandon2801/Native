import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRoute, type RouteProp } from "@react-navigation/native"
import { getListSendBackToFBOForClarification } from "../database/Sendbackradioapi"
import { getInspectionParameterResults } from "../database/Resumelistapi"

type RouteParams = {
  data: Section[]
  refId: string
  inspectionId: string
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
  const route = useRoute<RouteProp<Record<string, RouteParams>>>()
  const { data, refId, inspectionId } = route.params;
  console.log("data : ", data);
  console.log("-------------------------", refId, inspectionId)

  const [selectedOption, setSelectedOption] = useState<string>("forward")
  const [remarks, setRemarks] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleApiCall = async () => {
    if (!inspectionId || !refId) {
      Alert.alert("Error", "Invalid inspection ID or reference ID")
      return
    }

    setIsLoading(true)
    setSelectedOption("sendBack")

    try {
      const result = await getListSendBackToFBOForClarification(inspectionId, refId)
      console.log("API Response:", result)
      Alert.alert("Success", "API call successful!")
    } catch (error) {
      console.error("API Error:", error)
      Alert.alert("Error", "Failed to fetch data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSectionTap = async (sectionId: number) => {
    try {
      const payload = {
        sectionId: sectionId,
        inspectionId: inspectionId,
        refId: refId
      }
      const result = await getInspectionParameterResults(payload)
      console.log("Section details:", result)
     // navigate to a new screen 
    } catch (error) {
      console.error("Error fetching section details:", error)
      Alert.alert("Error", "Failed to fetch section details. Please try again.")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {data.map((section: Section) => (
          <TouchableOpacity
            key={section.sectionId}
            style={[
              styles.sectionItem,
              { borderLeftWidth: 4, borderLeftColor: section.submittedFlag ? "#4CAF50" : "red" },
            ]}
            onPress={() => handleSectionTap(section.sectionId)}
          >
            <View style={styles.sectionContent}>
              <Text style={styles.sectionName}>{section.sectionName}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.radioContainer}>
          <TouchableOpacity style={styles.radioButton} onPress={() => setSelectedOption("forward")}>
            <View style={styles.radioButtonCircle}>
              {selectedOption === "forward" && <View style={styles.radioButtonInnerCircle} />}
            </View>
            <Text style={styles.radioButtonLabel}>Forward to NHB</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.radioButton} onPress={handleApiCall} disabled={isLoading}>
            <View style={styles.radioButtonCircle}>
              {selectedOption === "sendBack" && <View style={styles.radioButtonInnerCircle} />}
            </View>
            <Text style={styles.radioButtonLabel}>
              {isLoading ? "Loading..." : "Send Back to Applicant for Clarification"}
            </Text>
          </TouchableOpacity>
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
})

export default Resumelist