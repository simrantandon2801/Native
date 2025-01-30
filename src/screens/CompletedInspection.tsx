import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native"
import { getCompletedInspectionReports } from "../database/Completeapi"
// import  { PaginatedResponse, ApiPayload } from "../database/Completeapi"
export interface InspectionReport {
    id: string
    companyName: string
    inspectionDate: string
    status: string
    inspectionId:string
  }
  
  interface PaginatedResponse {
    paginationListRecords: InspectionReport[]
    totalRecords: number
    pageNumber: number
    pageSize: number
  }
  
  interface ApiPayload {
    userId: string
    companyName: string
    fromDate: string
    toDate: string
    statusId: number
    inspectionType: string
    groupId: string
    kobId: string
    riskType: string
    licenseNo: string
  }
const CompletedInspection: React.FC = () => {
  const [reports, setReports] = useState<PaginatedResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchCompletedInspections()
  }, []) 

  const fetchCompletedInspections = async () => {
    try {
      setLoading(true)
      const payload: ApiPayload = {
        userId: "3816881804355836",
        companyName: "",
        fromDate: "",
        toDate: "",
        statusId: 21,
        inspectionType: "",
        groupId: "",
        kobId: "",
        riskType: "",
        licenseNo: "",
      }

      const data = await getCompletedInspectionReports(payload)
      setReports(data)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching completed inspections:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setLoading(false)
    }
  }

  const handleNextPage = () => {
    if (reports && page < Math.ceil(reports.totalRecords / reports.pageSize)) {
      setPage(page + 1)
    }
  }

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completed Inspections</Text>
      <ScrollView>
        {reports && reports.paginationListRecords.length > 0 ? (
          reports.paginationListRecords.map((item) => (
            <View key={item.inspectionId} style={styles.reportItem}>
              <Text style={styles.companyName}>{item.companyName}</Text>
              <Text>Inspection ID: {item.inspectionId}</Text>
              <Text>Date: {item.inspectionDate}</Text>
              <Text>Status: {item.statusId}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No completed inspections found.</Text>
        )}
      </ScrollView>
      {/* <View style={styles.paginationContainer}>
        <TouchableOpacity
          onPress={handlePreviousPage}
          disabled={page === 1}
          style={[styles.paginationButton, page === 1 && styles.disabledButton]}
        >
          <Text style={styles.paginationButtonText}>Previous</Text>
        </TouchableOpacity>
        <Text style={styles.pageIndicator}>Page {page}</Text>
        <TouchableOpacity
          onPress={handleNextPage}
          disabled={!reports || page >= Math.ceil(reports.totalRecords / reports.pageSize)}
          style={[
            styles.paginationButton,
            (!reports || page >= Math.ceil(reports.totalRecords / reports.pageSize)) && styles.disabledButton,
          ]}
        >
          <Text style={styles.paginationButtonText}>Next</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 18,
   fontFamily:"Outfit",
    marginBottom: 16,
  },
  reportItem: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  paginationButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
  },
  paginationButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
  },
  pageIndicator: {
    fontSize: 16,
  },
})

export default CompletedInspection

