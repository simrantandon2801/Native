import type React from "react"
import { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { getRejectedInspectionAttachmentCount } from "../database/Dashboardapi"

interface RejectedData {
  currentPageNo: number
  totalPages: number
  pageLimit: number
  totalRecords: number
  paginationListRecords: any[]
}

const RejectedList: React.FC = () => {
  const [rejectedData, setRejectedData] = useState<RejectedData>({
    currentPageNo: 1,
    totalPages: 0,
    pageLimit: 10,
    totalRecords: 0,
    paginationListRecords: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRejected = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const payload: any = {
          statusId: "18", // Status ID for Rejected
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

        const result = await getRejectedInspectionAttachmentCount(payload)
        setRejectedData(result)
      } catch (error) {
        console.error("Error loading data:", error)
        setError("Failed to load data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRejected()
  }, [])

  if (isLoading) {
    return <Text>Loading...</Text>
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.listTitle}>Rejected Inspections</Text>
      {rejectedData.paginationListRecords.length > 0 ? (
        rejectedData.paginationListRecords.map((item) => (
          <View key={`${item.displayRefId || ""}-${item.companyName}`} style={styles.listItem}>
            <Text style={styles.listItemText}>{item.displayRefId || "N/A"}</Text>
            <Text style={styles.listItemText}>{item.companyName || "N/A"}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.emptyListText}>No rejected inspections found.</Text>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listTitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 16,
    fontFamily: "Outfit",
  },
  listItem: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  listItemText: {
    fontSize: 14,
    color: "#333",
  },
  emptyListText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
    paddingHorizontal: 16,
  },
})

export default RejectedList