"use client"

import type React from "react"
// import Toast from "react-native-toast-message"
import { useEffect, useState, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  RefreshControl,Alert
} from "react-native"
import { getAcceptedInspectionAttachmentCount } from "../database/Dashboardapi"
import { getSecondaryOfficerEsignDetails, startInspection } from "../database/Officerviewapi"
import { DataTable } from "react-native-paper"
import ToastManager, { Toast } from "toastify-react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFocusEffect } from "@react-navigation/native"

// import { useFocusEffect } from "@react-navigation/native"

interface AcceptedData {
  currentPageNo: number
  totalPages: number
  pageLimit: number
  totalRecords: number
  paginationListRecords: any[]
}

interface OfficerData {
  fsoName: string
  officerType: string
  id?: any
}

const Acceptedlist: React.FC = () => {
  const [acceptedData, setAcceptedData] = useState<AcceptedData>({
    currentPageNo: 1,
    totalPages: 1,
    pageLimit: 10,
    totalRecords: 0,
    paginationListRecords: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [officerData, setOfficerData] = useState<OfficerData[]>([])
  const [isStartingInspection, setIsStartingInspection] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [startingInspections, setStartingInspections] = useState<{ [key: string]: boolean }>({})
  const itemsPerPage = 10 

  
  const fetchAccepted = async (page: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const payload: any = {
        statusId: "19",
        userId: userId,
        displayRefId: "",
        companyName: "",
        fromDate: "",
        toDate: "",
        processFlag: true,
        inspectionType: null,
        fsoName: null,
        kobId: null,
      }
      const result = await getAcceptedInspectionAttachmentCount(payload, page)
      setAcceptedData(result)
      console.log("=============dh======",result)
    } catch (error) {
      console.error("Error loading data:", error)
      setError("Failed to load data. Please try again.")
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }

 
  useEffect(() => {
    if (userId) {
      fetchAccepted(currentPage)
    }
  }, [userId, currentPage]) 

  // Update the useFocusEffect to use the current page
  // useFocusEffect(
  //   useCallback(() => {
  //     if (userId) {
  //       fetchAccepted(currentPage)
  //     }
  //   }, [userId, currentPage]),
  // )
  // useFocusEffect(
  //   useCallback(() => {
  //     fetchAccepted()
  //   }, [fetchAccepted])
  // )
  useEffect(() => {
    const fetchDataFromAsyncStorage = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const storedUserId = await AsyncStorage.getItem("userId")

        setUserId(storedUserId)

        console.log("Retrieved Data:", {
          userId: storedUserId,
        })
      } catch (err) {
        console.error("Error fetching data from AsyncStorage:", err)
        setError("Failed to load data from storage.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDataFromAsyncStorage()
  }, [])

  // Update the onRefresh function to reset to page 1
  const onRefresh = () => {
    setRefreshing(true)
    setCurrentPage(1)
    fetchAccepted(1)
  }

  const handleViewInspectionOfficers = async (item: any) => {
    try {
      const response = await getSecondaryOfficerEsignDetails(item.assignmentId)
      console.log("Inspection Officer List------------huhluhuh-:", response)
      if (Array.isArray(response)) {
        setOfficerData(response)
      } else {
        console.error("Unexpected response format for officer data")
        setOfficerData([])
      }
      setModalVisible(true)
    } catch (error) {
      console.error("Error fetching inspection officers$$$$$$$$$$$$$$$$$:", error)
      setOfficerData([])
    }
  }
  useEffect(() => {
    console.log("Updated officerData state:", officerData)
  }, [officerData])

  const handleStartInspection = async (item: any) => {
    // Set loading state for this specific item
    setStartingInspections((prev) => ({ ...prev, [item.assignmentId]: true }))

    try {
      // const currentDate = new Date().toISOString()
      const payload = {
        assignmentId: item.assignmentId,
        endDateTime: "",
        finalScore: "",
        refId: item.refId ,
        startDateTime: "",
        dateOfJoining: "",
        updatedOn: "",
        displayRefId: item.displayRefId,
      }
      console.log("Startting inspection Payload",payload)

      const response = await startInspection(payload)
      console.log("Inspection started successfully:", response)
      if (response.statusCode === "200") {
        Alert.alert("Inspection has been started")
        // Update only the specific item in the list
        setAcceptedData((prevData: AcceptedData) => ({
          ...prevData,
          paginationListRecords: prevData.paginationListRecords.map((record) =>
            record.assignmentId === item.assignmentId ? { ...record, statusDesc: "Inspection Started" } : record,
          ),
        }))
      } else {
        Toast.error("Failed to start inspection. Please try again.")
      }
    } catch (error) {
      console.error("Error starting inspection:", error)
      Toast.error("Failed to start inspection. Please try again.")
    } finally {
      // Clear loading state for this specific item
      setStartingInspections((prev) => ({ ...prev, [item.assignmentId]: false }))
    }
  }

  // Update the handlePageChange function
  const handlePageChange = async (newPage: number) => {
    if (newPage >= 1) {
      setCurrentPage(newPage)
      await fetchAccepted(newPage)
    }
  }

  // Update the renderPagination function to use the data from the API
 const renderPagination = () => {
        const hasMorePages =
        acceptedData?.paginationListRecords?.length > 0 &&
        acceptedData?.paginationListRecords?.length >= itemsPerPage 
    
        return (
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              onPress={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
            >
              <Text style={styles.paginationButtonText}>Previous</Text>
            </TouchableOpacity>
    
            <Text style={styles.paginationInfo}>Page {currentPage}</Text>
    
            <TouchableOpacity
              onPress={() => handlePageChange(currentPage + 1)}
              disabled={!hasMorePages}
              style={[styles.paginationButton, !hasMorePages && styles.disabledButton]}
            >
              <Text style={styles.paginationButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        )
      }
      useEffect(() => {
        console.log("Current Page:", currentPage)
        // console.log("Total Pages:", Totalpage)
      }, [currentPage])
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
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
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
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <ToastManager />
              <TouchableOpacity
          key={item.assignmentId}
          style={[
            styles.startInspectionButton,
            (startingInspections[item.assignmentId] || item.statusDesc === "Inspection Started") && { opacity: 0.7 },
          ]}
          onPress={() => handleStartInspection(item)}
          disabled={startingInspections[item.assignmentId] || item.statusDesc === "Inspection Started"}
        >
          <Text style={styles.startInspectionButtonText}>
            {item.statusDesc === "Inspection Started"
              ? "Inspection Started"
              : startingInspections[item.assignmentId]
                ? "Starting..."
                : "Start Inspection"}
          </Text>
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
      {renderPagination()}
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Inspection Officer List</Text>
            <ScrollView style={styles.tableContainer}>
              <DataTable>
                <DataTable.Header style={styles.tableHeader}>
                  <DataTable.Title style={styles.tableHeaderCell}>S.No</DataTable.Title>
                  <DataTable.Title style={styles.tableHeaderCell}>FSO Name</DataTable.Title>
                  <DataTable.Title style={styles.tableHeaderCell}>Officer Type</DataTable.Title>
                </DataTable.Header>

                {officerData.map((officer, index) => (
                  <DataTable.Row key={officer.id || index} style={styles.tableRow}>
                    <DataTable.Cell style={styles.tableCell}>{index + 1}</DataTable.Cell>
                    <DataTable.Cell style={styles.tableCell}>{officer.fsoName}</DataTable.Cell>
                    <DataTable.Cell style={styles.tableCell}>{officer.officerType}</DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  tableContainer: {
    maxHeight: 300,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
  },
  tableHeaderCell: {
    justifyContent: "center",
  },
  tableRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tableCell: {
    justifyContent: "center",
  },
  closeButton: {
    backgroundColor: "#1a73e8",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  paginationButton: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: "#007bff",
  },
  disabledButton: {
    opacity: 0.5,
  },
  paginationButtonText: {
    fontSize: 16,
    color: "#333",
  },
  activeButtonText: {
    color: "#fff",
  },
  paginationInfo: {
    fontSize: 16,
    marginHorizontal: 10,
  },
})

export default Acceptedlist

