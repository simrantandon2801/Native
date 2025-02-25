

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity } from "react-native"
import { getAcknowledgedInspectionCount } from "../database/Dashboardapi"
import AcceptModal from "./AcceptModal"
import RejectModal from "./RejectModal"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFocusEffect } from "@react-navigation/native"

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
  const [userId, setUserId] = useState<string | null>(null)
  const [displayRefId, setDisplayRefId] = useState<string | null>(null)
  const [companyName, setCompanyName] = useState<string | null>(null)
  const [inspectionType, setInspectionType] = useState<string | null>(null)
   const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10 

  useEffect(() => {
    const fetchDataFromAsyncStorage = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const storedUserId = await AsyncStorage.getItem("userId")
        const storedDisplayRefId = await AsyncStorage.getItem("displayRefId")
        const storedCompanyName = await AsyncStorage.getItem("companyName")
        const storedInspectionType = await AsyncStorage.getItem("inspectionType")

        setUserId(storedUserId)
        setDisplayRefId(storedDisplayRefId)
        setCompanyName(storedCompanyName)
        setInspectionType(storedInspectionType)

        console.log("Retrieved Data:", {
          userId: storedUserId,
          displayRefId: storedDisplayRefId,
          companyName: storedCompanyName,
          inspectionType: storedInspectionType,
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

  const fetchAcknowledgement = async (page: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const payload = {
        statusId: "17",
        userId: userId,
        displayRefId: displayRefId,
        companyName: companyName,
        fromDate: "",
        toDate: "",
        processFlag: true,
        inspectionType: inspectionType,
        fsoName: null,
        kobId: null,
      }
      console.log("======payload", payload)
      const result = await getAcknowledgedInspectionCount(payload,page)
      console.log("+++++++Acknowledge", result)
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
    if (userId) {
      fetchAcknowledgement(currentPage)
    }
  }, [userId, currentPage]) 

  // useEffect(() => {
  //   fetchAcknowledgement()
  // }, [userId, displayRefId, companyName, inspectionType])
  // useFocusEffect(
  //   useCallback(() => {
  //     fetchAcknowledgement()
  //   }, []),
  // )
  // const onRefresh = () => {
  //   setRefreshing(true)
  //   // fetchAcknowledgement()
  // }

  const refreshData = useCallback(() => {
    // fetchAcknowledgement()
  }, [userId, displayRefId, companyName, inspectionType])

  const handleAcceptPress = (item: any) => {
    setSelectedItem(item)
    setIsAcceptModalVisible(true)
  }

  const handleRejectPress = (item: any) => {
    setSelectedItem(item)
    setIsRejectModalVisible(true)
  }
  const onAcceptSuccess = () => {
    setCurrentPage(1);
    fetchAcknowledgement(1);
  };
  const onRejectSuccess = () => {
    setCurrentPage(1);
    fetchAcknowledgement(1);
  };
  const closeAcceptModal = () => {
    setIsAcceptModalVisible(false)
  }

  const closeRejectModal = () => {
    setIsRejectModalVisible(false)
  }
  const onRefresh = () => {
    setRefreshing(true)
    setCurrentPage(1)
    fetchAcknowledgement(1)
  }
 const removeItemFromList = useCallback((itemId: number) => {
  setAcknowledgedData((prevData) => ({
    ...prevData,
    paginationListRecords: prevData.paginationListRecords.filter((item) => item.assignmentId !== itemId),
    totalRecords: prevData.totalRecords > 0 ? prevData.totalRecords - 1 : 0,
  }))
}, [])
 const handlePageChange = async (newPage: number) => {
    if (newPage >= 1) {
      setCurrentPage(newPage)
      await fetchAcknowledgement(newPage)
    }
  }

  // Update the renderPagination function to use the data from the API
 const renderPagination = () => {
        const hasMorePages =
        acknowledgedData?.paginationListRecords?.length > 0 &&
        acknowledgedData?.paginationListRecords?.length >= itemsPerPage 
    
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
                  <Text style={styles.listItemText}>Assignment ID: {item.assignmentId || "N/A"}</Text>
                  <Text style={styles.listItemText}>Company Name: {item.companyName || "N/A"}</Text>
                  <Text style={styles.listItemText}>Stage: {item.statusDesc || "N/A"}</Text>
                </View>
                <View style={styles.rightContent}>
                  <Text style={styles.listItemText}>Type: {item.inspectionType || "N/A"}</Text>
                  <Text style={styles.listItemText}>Ref: {item.displayRefId || "N/A"}</Text>
                  <Text style={styles.listItemText}>RA: {item.raRemarks || "N/A"}</Text>
                  <Text style={styles.listItemText}>Assigned By: {item.assignedBy || "N/A"}</Text>
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
          {renderPagination()}
      </ScrollView>

      <AcceptModal
  visible={isAcceptModalVisible}
  onClose={closeAcceptModal}
  item={selectedItem}
  onAcceptSuccess={onAcceptSuccess}
/>

      <RejectModal
        visible={isRejectModalVisible}
        onClose={closeRejectModal}
        item={selectedItem}
    onRejectSuccess={onRejectSuccess}
      />
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
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 15,
    paddingHorizontal: 16,
    fontFamily: "Outfit",
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
    justifyContent: "center",
    marginTop: 12,
    width: 180,
    alignItems: "center",
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "#007AFF",
    marginRight: 6,
    padding: 10,
  },
  rejectButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    marginLeft: 6,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Source Sans Pro",
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

export default AcknowledgeList

