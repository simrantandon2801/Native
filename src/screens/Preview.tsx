"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRoute, type RouteProp, useNavigation } from "@react-navigation/native"
import { getInspectionPreviewDetails } from "../database/Previewapi"

interface PreviewDocumentsProps {
  visible: boolean
  onClose: () => void
  sectionId: number | null
  sectionName: string
  inspectionId: string
  assignmentId: any
}

const Preview: React.FC = () => {
  const route = useRoute<RouteProp<Record<string, PreviewDocumentsProps>>>()
  const navigation = useNavigation()
  const { inspectionId, sectionName, assignmentId } = route.params
  console.log("inspectionid",inspectionId,"sectionName",sectionName,"assignmentID",assignmentId)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [inspectonDetails, setInspectionDetails] = useState<any>(null)
  const[documentDetails,setDocumentDetails]=useState<any>(null)
  const[scoreDetails,setscoreDetails]=useState<any>(null)
  const[sectionDetails,setsectionDetails]=useState<any>(null)

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
   
      setDocumentDetails(response[0].documentDetails);
      console.log("sgdd",response[0].documentDetails)

      
setInspectionDetails(response[0].inspectionDetails);
console.log("wad",response[0].inspectonDetails)

setscoreDetails(response[0].scoreDetails,);
console.log("hdd",response[0].scoreDetails)

setsectionDetails(response[0].
  sectionDetails
  )




      console.log("Inspection details received:", response[0].documentDetails)
    } catch (error) {
      console.error("Error fetching inspection details:", error)
      setError("Failed to load inspection details. Please try again.")
      Alert.alert("Error", "Failed to load inspection details. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

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
  
    fetchInspectionPreview()
  }, [inspectionId, assignmentId])

  const handleRetry = () => {
    fetchInspectionPreview()
  }

  return (
<View style={styles.container}>
  <Text style={styles.heading}>Auto Generated Inspection Report</Text>

  {/* Loading State */}
  {isLoading && (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.loadingText}>Loading inspection details...</Text>
    </View>
  )}

  {/* Error State */}
  {error && (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Error: {error}</Text>
      <Text style={styles.retryText} onPress={handleRetry}>
        Tap to retry
      </Text>
    </View>
  )}

  {/* Document Details Section */}
  {documentDetails && !isLoading && (
    <View style={styles.detailsContainer}>
      <Text style={styles.cardTitle}>Upload Documents</Text>
      {documentDetails.length > 0 ? (
        documentDetails.map((document, index) => (
          <View key={index} style={styles.infoCard}>
            <Text style={styles.infoText}>Document Desc: {document.documentDesc || "N/A"}</Text>
            <Text style={styles.infoText}>Report ID: {document.inspectionId || "N/A"}</Text>
            <Text style={styles.infoText}>Document ID: {document.documentId || "N/A"}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>No document data available</Text>
      )}
    </View>
  )}

  {/* Inspection Details Section */}
  {inspectonDetails && !isLoading && (
    <View style={styles.detailsContainer}>
      <Text style={styles.cardTitle}>Inspection Details</Text>
      {inspectonDetails.length > 0 ? (
        inspectonDetails.map((inspection, index) => (
          <View key={index} style={styles.infoCard}>
            <Text style={styles.infoText}>Applicant Name: {inspection.applicantName || "N/A"}</Text>
            <Text style={styles.infoText}>Report ID: {inspection.inspectionId || "N/A"}</Text>
            <Text style={styles.infoText}>Inspection Officer Name: {inspection.fsoName || "N/A"}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>No inspection data available</Text>
      )}
    </View>
  )}

  {/* Score Details Section */}
  {scoreDetails && !isLoading && (
    <View style={styles.detailsContainer}>
      <Text style={styles.cardTitle}>Score Details</Text>
      {scoreDetails.length > 0 ? (
        scoreDetails.map((score, index) => (
          <View key={index} style={styles.infoCard}>
            <Text style={styles.infoText}>Obtained Percentage: {score.obtainedpercentage || "N/A"}</Text>
            <Text style={styles.infoText}>Total Max: {score.totalmax || "N/A"}</Text>
            <Text style={styles.infoText}>Total Obtained: {score.totalobtained || "N/A"}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>No score data available</Text>
      )}
    </View>
  )}
</View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#333",
  },
  subheading: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  errorContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#ff6b6b",
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
  },
  detailsContainer: {
    flex: 1,
    marginTop: 10,
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
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 98,
    color: "#333",
    textAlign:'center'
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 8,
  },
  itemContainer: {
    marginBottom: 12,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: "#ddd",
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#444",
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: "#666",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
})

export default Preview

