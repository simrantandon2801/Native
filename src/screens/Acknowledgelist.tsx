import type React from "react"
import { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity } from "react-native"
import { getAcknowledgedInspectionCount } from "../database/Dashboardapi"
import AcceptModal from "./AcceptModal"
import RejectModal from "./RejectModal"

interface AcknowledgedData {
  currentPageNo: number
  totalPages: number
  pageLimit: number
  totalRecords: number
  paginationListRecords: any[]
}

const AcknowledgeList: React.FC = () => {
  const [acknowledgedData, setAcknowledgedData] = useState<AcknowledgedData>({
    currentPageNo: 1,
    totalPages: 0,
    pageLimit: 10,
    totalRecords: 0,
    paginationListRecords: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [isAcceptModalVisible, setIsAcceptModalVisible] = useState(false)
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any | null>(null)

  const fetchAcknowledgement = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const payload: any = {
        statusId: "17",
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
      const result = await getAcknowledgedInspectionCount(payload)
      setAcknowledgedData(result)
    } catch (error) {
      console.error("Error loading data:", error)
      setError("Failed to load data. Please try again.")
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAcknowledgement()
  }, []) //Fixed: Added empty dependency array to run only once on mount

  const onRefresh = () => {
    setRefreshing(true)
    fetchAcknowledgement()
  }

  const handleAcceptPress = (item: any) => {
    setSelectedItem(item)
    setIsAcceptModalVisible(true)
  }

  const handleRejectPress = (item: any) => {
    setSelectedItem(item)
    setIsRejectModalVisible(true)
  }

  const closeAcceptModal = () => {
    setIsAcceptModalVisible(false)
  }

  const closeRejectModal = () => {
    setIsRejectModalVisible(false)
  }

  if (isLoading && !refreshing) {
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
    <>
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.listTitle}>Acknowledged Inspections</Text>
        {acknowledgedData.paginationListRecords.length > 0 ? (
          acknowledgedData.paginationListRecords.map((item) => (
            <View key={`${item.displayRefId || ""}-${item.companyName}`} style={styles.listItem}>
              <View style={styles.listItemContent}>
                <View style={styles.leftContent}>
                  <Text style={styles.companyName}>Company: {item.companyName || "N/A"}</Text>
                  <Text style={styles.statusDesc}>{item.statusDesc || "N/A"}</Text>
                  <Text style={styles.listItemText}>ID: {item.assignmentId || "N/A"}</Text>
                </View>
                <View style={styles.rightContent}>
                  <Text style={styles.listItemText}>Type: {item.inspectionType || "N/A"}</Text>
                  <Text style={styles.listItemText}>Ref: {item.displayRefId || "N/A"}</Text>
                  <Text style={styles.listItemText}>RA: {item.raRemarks || "N/A"}</Text>
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => handleAcceptPress(item)}>
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={() => handleRejectPress(item)}>
                  <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyListText}>No acknowledged inspections found.</Text>
        )}
      </ScrollView>

      <AcceptModal visible={isAcceptModalVisible} onClose={closeAcceptModal} selectedItem={selectedItem} />
      <RejectModal visible={isRejectModalVisible} onClose={closeRejectModal} selectedItem={selectedItem} />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    color: "#D32F2F",
    textAlign: "center",
    fontSize: 16,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 15,
    paddingHorizontal: 16,
    color: "#333",
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
  listItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftContent: {
    flex: 1,
    marginRight: 8,
  },
  rightContent: {
    flex: 1,
    marginLeft: 8,
  },
  companyName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  statusDesc: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
    marginBottom: 4,
  },
  listItemText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  emptyListText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    marginRight: 6,
  },
  rejectButton: {
    backgroundColor: "#F44336",
    marginLeft: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
})

export default AcknowledgeList

