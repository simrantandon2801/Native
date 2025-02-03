import type React from "react"
import { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native"
import { getOngoingInspectionCount } from "../database/Dashboardapi"
import { SafeAreaView } from "react-native-safe-area-context"

interface OngoingData {
  currentPageNo: number
  totalPages: number
  pageLimit: number
  totalRecords: number
  paginationListRecords: InspectionItem[]
}

interface InspectionItem {
  inspectionId: string
  inspectionType: string
  displayRefId: string
  companyName: string
  certificateNo: string
  fullAddress?: string // Added fullAddress to InspectionItem
  inspectionDate?: string // Added inspectionDate to InspectionItem
}

const OngoingList: React.FC = () => {
  const [ongoingData, setOngoingData] = useState<OngoingData>({
    currentPageNo: 1,
    totalPages: 0,
    pageLimit: 10,
    totalRecords: 0,
    paginationListRecords: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOngoing()
  }, [])

  const fetchOngoing = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const payload = {
        statusId: "20",
        userId: "3816881804355836",
        displayRefId: "",
        companyName: "",
        fromDate: "",
        toDate: "",
        processFlag: true,
        inspectionType: null,
        fsoName: null,
        kobId: null,
      }

      const result = await getOngoingInspectionCount(payload)
      setOngoingData(result)
    } catch (error) {
      console.error("Error loading data:", error)
      setError("Failed to load data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchOngoing}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.listTitle}>Ongoing Inspections</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {ongoingData.paginationListRecords.length > 0 ? (
          ongoingData.paginationListRecords.map((item) => (
            <TouchableOpacity key={`${item.displayRefId || ""}-${item.companyName}`} style={styles.listItem}>
              <View style={styles.listItemBody}>
                <Text style={styles.listItemText}>Report ID: {item.inspectionId}</Text>
                <Text style={styles.listItemText}>
                  Ref ID/RegistrationNo: {item.displayRefId || "N/A"}/ {item.certificateNo || "N/A"}
                </Text>

                <View style={styles.listItemBody}>
                  <Text style={styles.listItemText}>
                    Company Name/Organization:{item.companyName || "N/A"}/{item.fullAddress || "N/A"}
                  </Text>
                  <Text style={styles.listItemText}>Inspection Date:{item.inspectionDate || "N/A"}</Text>

                  <Text style={styles.listItemText}>Inspection Type:{item.inspectionType || "N/A"}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.resumeButton}>
                <Text style={styles.resumeButtonText}>Resume</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyListText}>No ongoing inspections found.</Text>
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
  scrollViewContent: {
    paddingBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 700,
    fontFamily: "Outfit",
    marginVertical: 16,
    paddingHorizontal: 16,
    color: "#333",
  },
  listItem: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  listItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  inspectionType: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  listItemBody: {
    marginTop: 4,
  },
  listItemText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
  },
  emptyListText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#007AFF",
    borderRadius: 4,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resumeButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  resumeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
})

export default OngoingList

