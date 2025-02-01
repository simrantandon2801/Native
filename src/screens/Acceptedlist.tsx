import type React from "react"
import { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native"
import { getAcceptedInspectionAttachmentCount } from "../database/Dashboardapi"
import { getSecondaryOfficerEsignDetails } from "../database/Officerviewapi" 

interface AcceptedData {
  currentPageNo: number
  totalPages: number
  pageLimit: number
  totalRecords: number
  paginationListRecords: any[]
}

const Acceptedlist: React.FC = () => {
  const [acceptedData, setAcceptedData] = useState<AcceptedData>({
    currentPageNo: 1,
    totalPages: 0,
    pageLimit: 10,
    totalRecords: 0,
    paginationListRecords: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAccepted = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const payload: any = {
          statusId: "19",
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

        const result = await getAcceptedInspectionAttachmentCount(payload)
        setAcceptedData(result)
      } catch (error) {
        console.error("Error loading data:", error)
        setError("Failed to load data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAccepted()
  }, [])

  const handleViewInspectionOfficers = async (item: any) => {
    try {
      const response = await getSecondaryOfficerEsignDetails(item.assignmentId)
      console.log("Inspection Officer List-------------:", response)
   //navigate krega next screen 
    } catch (error) {
      console.error("Error fetching inspection officers$$$$$$$$$$$$$$$$$:", error)
   
    }
  }

  const handleStartInspection = (item: any) => {
    console.log("Starting inspection for:", item.displayRefId)
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.listTitle}>Accepted Inspections</Text>
      {acceptedData.paginationListRecords.length > 0 ? (
        acceptedData.paginationListRecords.map((item) => (
          <View key={item.assignmentId} style={styles.listItem}>
            <View style={styles.content}>
              <View style={styles.leftContent}>
                <Text style={styles.listItemText}>Company Name:{item.companyName || "N/A"}</Text>
                <Text style={styles.listItemText}>Assignment ID: {item.assignmentId || "N/A"}</Text>
                <Text style={styles.listItemText}>Inspection Type: {item.inspectionType || "N/A"}</Text>
                <Text style={styles.listItemText}>Ref: {item.displayRefId || "N/A"}</Text>
              </View>
              <View style={styles.rightContent}>
                <Text style={styles.listItemText}>RA: {item.raRemarks || "N/A"}</Text>
                <Text style={styles.listItemText}>Assigned By: {item.assignedBy || "N/A"}</Text>
                <Text style={styles.listItemText}>Stage: {item.statusDesc || "N/A"}</Text>
                {/* <Text style={styles.statusBadge}>Stage:{item.statusDesc || "N/A"}</Text> */}
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.startInspectionButton} onPress={() => handleStartInspection(item)}>
                <Text style={styles.startInspectionButtonText}>Start Inspection</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.viewOfficerListButton} onPress={() => handleViewInspectionOfficers(item)}>
                <Text style={styles.viewOfficerListButtonText}>
                  <Text style={styles.inspectionOfficerListText}>Inspection Officer List:</Text>
                  <Text style={styles.viewText}> View</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.emptyListText}>No accepted inspections found.</Text>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#0000ff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    fontFamily: "Outfit",
    marginBottom: 15,
    paddingHorizontal: 16,
    color: "#333",
  },
  viewOfficerListButton: {
    paddingVertical: 5,
  },
  listItem: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a73e8",
    flex: 1,
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flex: 1,
  },
  listItemText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  emptyListText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    color: "#d32f2f",
    textAlign: "center",
    fontSize: 16,
  },
  leftContent: {
    flex: 1,
    marginRight: 8,
  },
  rightContent: {
    flex: 1,
    marginLeft: 8,
  },
  startInspectionButton: {
    backgroundColor: "#1a73e8",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  startInspectionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  viewOfficerListButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  inspectionOfficerListText: {
    color: "#000",
  },
  viewText: {
    color: "#1a73e8",
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: 12,
  },
})

export default Acceptedlist

