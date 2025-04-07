"use client"

import type React from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RouteProp } from "@react-navigation/native"
import { getKobNameReg } from "../database/Previewapi"
import { getScruitnizehistory } from "../database/Proceedscruitnizeinspection" // Import the function
import { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
// Define the type for route params
type ProceedInspectionParams = {
  displayRefId: string
  companyName: string
  inspectionDate: string
  inspectionType: string
  refId: string
}

const ProceedInspection: React.FC = () => {
  const route = useRoute<RouteProp<Record<string, ProceedInspectionParams>, string>>()
  const navigation = useNavigation<StackNavigationProp<any>>()
  const [kobData, setKobData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [inspectionHistory, setInspectionHistory] = useState<any[]>([]) // Add state for inspection history

  const { displayRefId, companyName, inspectionDate, inspectionType, refId } = route.params || {}
  console.log(inspectionDate, "inspectionDate")
  console.log(displayRefId, "display")

  const fetchKobNameReg = async () => {
    try {
      const response = await getKobNameReg(refId)
      setKobData(response[0].kobname)
      console.log("KOB name registration data received:", response)
    } catch (error) {
      console.error("Error fetching KOB name registration data:", error)
    }
  }

  // Add function to fetch inspection history
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
    fetchInspectionHistory() // Call the function to fetch inspection history
  }, [])

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        {/* <Text style={styles.headerTitle}>Inspection Details</Text> */}

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
                <Text style={styles.historyText}>Ref Id:{item.displayRefId || "N/A"}</Text>
                <Text style={styles.historyText}>Report Id:{item.inspectionId || "N/A"}</Text>
                <Text style={styles.historyText}>Inspection Officer Name:{item.fsoname
 || "N/A"}</Text>
   <Text style={styles.historyText}>Category of Inspection:{item.inspectionType || "N/A"}</Text>
   <Text style={styles.historyText}>Start Date Of Inspection:{item.startDateTime || "N/A"}</Text>
   <Text style={styles.historyText}>Remarks:{item.raRemarks || "N/A"}</Text>
   <Text style={styles.historyText}>End Date of Inspection:{item.endDateTime || "N/A"}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No inspection history available</Text>
          )}
        
        </View>
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
    textAlign:"center"
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
})

export default ProceedInspection

