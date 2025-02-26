"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native"
import { Picker } from "@react-native-picker/picker"
import { Filter, X } from "lucide-react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getBusinessTypes } from "../database/Statebusinessapi"
import { getAcceptedInspectionAttachmentCount } from "../database/Dashboardapi"
import { getSecondaryOfficerEsignDetails, startInspection } from "../database/Officerviewapi"
import { DataTable } from "react-native-paper"

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
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [referenceNo, setReferenceNo] = useState("")
  const [OfficermodalVisible, setOfficerModalVisible] = useState(false)
  const [companyName, setCompanyName] = useState("")
  const [hasSearched, setHasSearched] = useState(false)

  const [selectedBusinessType, setSelectedBusinessType] = useState("")
  const [userId, setUserId] = useState<string | null>(null)
  const [startingInspections, setStartingInspections] = useState<{ [key: string]: boolean }>({})
  const [refId, setRefId] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [displayRefId, setdisplayRefId] = useState("")

  const [itemsPerPage] = useState(10)

  const [currentPage, setCurrentPage] = useState(1)
  const [businessTypes, setBusinessTypes] = useState<Array<any>>([])
  const [isSearching, setIsSearching] = useState(false)

  const [showFromPicker, setShowFromPicker] = useState(false)
  const [selectedInspectionType, setSelectedInspectionType] = useState("")

  const [isLoading, setIsLoading] = useState(false)

  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())
  const [showToPicker, setShowToPicker] = useState(false)
  const [kobId, setKobId] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [officerData, setOfficerData] = useState<OfficerData[]>([])
  // const [Totalpage, setTotalpage] = useState()
  const fetchAccepted = useCallback(
    async (page: number) => {
      setIsLoading(true)
      setError(null)
      try {
        const payload: any = {
          statusId: "19",
          userId: userId,
          displayRefId: displayRefId,
          companyName: companyName,
          fromDate: "",
          toDate: "",
          processFlag: true,
          inspectionType: null,
          fsoName: null,
          kobId: null,
        }
        const result = await getAcceptedInspectionAttachmentCount(payload, page)
        setAcceptedData(result)
        setHasSearched(true)
        console.log("=============dh======", result)
      } catch (error) {
        console.error("Error loading data:", error)
        setError("Failed to load data. Please try again.")
      } finally {
        setIsLoading(false)
        setRefreshing(false)
      }
    },
    [userId, displayRefId, companyName],
  )

  useEffect(() => {
    console.log("Updated refId:", refId)
  }, [refId])
  // Function to close the modal

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
  const onRefresh = () => {
    setRefreshing(true)
    setCurrentPage(1)
    if (hasSearched) {
      fetchAccepted(1)
    } else {
      setRefreshing(false)
    }
  }
  useEffect(() => {
    const fetchKobId = async () => {
      try {
        const storedKobId = await AsyncStorage.getItem("kobId")
        console.log("Stored kobId from AsyncStorage:", storedKobId)

        if (storedKobId) {
          setKobId(storedKobId)
        } else {
          console.warn("No kobId found in AsyncStorage. Using fallback value.")
          setKobId(selectedBusinessType)
        }
      } catch (err) {
        console.error("Error fetching kobId from AsyncStorage:", err)
      }
    }

    fetchKobId()
  }, [selectedBusinessType])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const businessTypeData = await getBusinessTypes()
        setBusinessTypes(businessTypeData)
      } catch (err) {
        console.error("Error fetching initial data:", err)
      }
    }
    fetchData()
  }, [])
  useEffect(() => {
    const loadCompanyName = async () => {
      try {
        const savedCompanyName = await AsyncStorage.getItem("companyName")
        if (savedCompanyName) {
          setCompanyName(savedCompanyName)
        }
      } catch (error) {
        console.error("Error loading companyName from AsyncStorage:", error)
      }
    }

    loadCompanyName()
  }, [])
  const onFromDateChange = (event, selectedDate) => {
    setShowFromPicker(false)
    if (event.type === "set") {
      setFromDate(selectedDate)

      if (toDate && selectedDate > toDate) {
        setToDate(null)
      }
    }
  }

  const onToDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowToPicker(false)
    if (event.type === "set" && selectedDate) {
      setToDate(selectedDate)
    }
  }

  const getDisplayDate = (date: Date | null): string => {
    return date ? date.toLocaleDateString() : "Select Date"
  }
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // const onRefresh = async () => {
  //   // setRefreshing(true)
  //   setCurrentPage(1)
  //   setSearchResults({ paginationListRecords: [] })

  // }

  const toggleModal = () => {
    if (!isModalVisible) {
    }
    setIsModalVisible(!isModalVisible)
  }
  const handleReset = async () => {
    setReferenceNo("")
    setCompanyName("")
    setSelectedBusinessType("")
    setSelectedInspectionType("")
    setFromDate(null)
    setToDate(null)
    setShowFromPicker(false)
    setShowToPicker(false)
    setCurrentPage(1)
    setHasSearched(false)
  }
  // useFocusEffect(
  //   useCallback(() => {
  //     handleReset()
  //     setCurrentPage(1)
  //     setAcceptedData({ paginationListRecords: [] })
  //   }, []),
  // )
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
      setOfficerModalVisible(true)
    } catch (error) {
      console.error("Error fetching inspection officers$$$$$$$$$$$$$$$$$:", error)
      setOfficerData([])
    }
  }
  useEffect(() => {
    console.log("Updated officerData state:", officerData)
  }, [officerData])

  const handleStartInspection = async (item: any) => {
    setStartingInspections((prev) => ({ ...prev, [item.assignmentId]: true }))
    try {
      const payload = {
        assignmentId: item.assignmentId,
        endDateTime: "",
        finalScore: "",
        refId: item.refId,
        startDateTime: "",
        dateOfJoining: "",
        updatedOn: "",
        displayRefId: item.displayRefId,
      }
      console.log("Startting inspection Payload", payload)
      const response = await startInspection(payload)
      console.log("Inspection started successfully:", response)
      if (response.statusCode === "200") {
        Alert.alert("Inspection has been started")
        // Remove the started inspection from the list
        setAcceptedData((prevData: AcceptedData) => ({
          ...prevData,
          paginationListRecords: prevData.paginationListRecords.filter(
            (record) => record.assignmentId !== item.assignmentId,
          ),
        }))
      } else {
        console.error("Failed to start inspection. Please try again.")
      }
    } catch (error) {
      console.error("Error starting inspection:", error)
      console.error("Failed to start inspection. Please try again.")
    } finally {
      setStartingInspections((prev) => ({ ...prev, [item.assignmentId]: false }))
    }
  }
  const handlePageChange = async (newPage: number) => {
    if (newPage >= 1) {
      setCurrentPage((prevPage) => prevPage + 1)
      await fetchAccepted(newPage)
    }
  }

  useEffect(() => {
    if (userId && hasSearched) {
      fetchAccepted(currentPage)
    }
  }, [userId, currentPage, fetchAccepted, hasSearched])
  const renderPagination = () => {
    const hasMorePages =
      acceptedData?.paginationListRecords?.length > 0 && acceptedData?.paginationListRecords?.length >= itemsPerPage

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleModal} style={styles.filterIcon}>
          <Filter size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <Modal visible={isModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Filter Inspection</Text>
                <TouchableOpacity onPress={toggleModal} style={styles.closeIcon5}>
                  <X size={24} color="#000" />
                </TouchableOpacity>
              </View>
              {/* <Text style={styles.modalTitle}>Filter Inspection</Text> */}

              <Text style={styles.label}>Reference Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter reference number"
                value={referenceNo}
                onChangeText={setReferenceNo}
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>Company Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter company name"
                value={companyName}
                onChangeText={setCompanyName}
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>Allocated Date From</Text>
              <TouchableOpacity style={styles.input} onPress={() => setShowFromPicker(true)}>
                <Text>{getDisplayDate(fromDate)}</Text>
              </TouchableOpacity>
              {showFromPicker && (
                <DateTimePicker value={fromDate || today} mode="date" onChange={onFromDateChange} maximumDate={today} />
              )}

              <Text style={styles.label}>Allocated Date To</Text>
              <TouchableOpacity style={styles.input} onPress={() => setShowToPicker(true)}>
                <Text>{getDisplayDate(toDate)}</Text>
              </TouchableOpacity>
              {showToPicker && (
                <DateTimePicker
                  value={toDate || today}
                  mode="date"
                  onChange={onToDateChange}
                  // minimumDate={fromDate || today}
                  maximumDate={today}
                />
              )}

              <Text style={styles.label}>Inspection Type</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedInspectionType}
                  onValueChange={setSelectedInspectionType}
                  style={styles.picker}
                  dropdownIconColor="#666"
                >
                  <Picker.Item label="Select Inspection Type" value="" style={styles.placeholderStyle} />
                  <Picker.Item label="PRE" value="PRE" />
                  <Picker.Item label="POST" value="POST" />
                  {/* {inspectionTypes.map((type) => (
    <Picker.Item key={type.id} label={type.name} value={type.id} />
  ))} */}
                </Picker>
              </View>

              <Text style={styles.label}>Business Type</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedBusinessType}
                  onValueChange={setSelectedBusinessType}
                  style={styles.picker}
                  dropdownIconColor="#666"
                >
                  <Picker.Item label="Select Business Type" value="" style={styles.placeholderStyle} />
                  {businessTypes.map((type) => (
                    <Picker.Item key={type.kobId} label={type.kobName} value={type.kobId} />
                  ))}
                </Picker>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleReset} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={async () => {
                    setCurrentPage(1)
                    setHasSearched(true)
                    await fetchAccepted(1)
                    toggleModal()
                  }}
                  disabled={isSearching}
                >
                  <Text style={styles.applyButtonText}>{isSearching ? "Searching..." : "Search"}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.listTitle}>Accepted Inspections</Text>
        {!hasSearched ? (
          <Text style={styles.emptyListText}>No records found</Text>
        ) : acceptedData.paginationListRecords.length > 0 ? (
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
                {/* <ToastManager /> */}
                <TouchableOpacity
                  key={item.assignmentId}
                  style={[
                    styles.startInspectionButton,
                    (startingInspections[item.assignmentId] || item.statusDesc === "Inspection Started") && {
                      opacity: 0.7,
                    },
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
              </View>
              <View>
                <TouchableOpacity
                  style={styles.viewOfficerListButton}
                  onPress={() => handleViewInspectionOfficers(item)}
                >
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

        <Modal
          animationType="none"
          transparent={true}
          visible={OfficermodalVisible}
          onRequestClose={() => setOfficerModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, styles.officerModalContent]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Inspection Officer List</Text>
                <TouchableOpacity onPress={() => setOfficerModalVisible(false)} style={styles.closeIcon}>
                  <X size={24} color="#000" />
                </TouchableOpacity>
              </View>
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
              <TouchableOpacity style={styles.closeButtonView} onPress={() => setOfficerModalVisible(false)}>
                <Text style={styles.closeButtonText6}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
      {hasSearched && acceptedData?.paginationListRecords?.length > 0 && renderPagination()}
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#f5f5f5",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 16,
  },
  tableContainer: {
    marginVertical: 10,
    width: "100%",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  tableHeaderCell: {
    justifyContent: "center",
    padding: 8,
  },
  nameColumn: {
    flex: 2,
  },
  tableRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tableCell: {
    justifyContent: "center",
    padding: 8,
  },
  viewText: {
    color: "#1a73e8",
  },
  viewOfficerListButton: {
    paddingVertical: 5,
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
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  listItemText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
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
  emptyListText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666",
  },
  leftContent: {
    flex: 1,
    marginRight: 8,
  },
  rightContent: {
    flex: 1,
    marginLeft: 8,
  },
  modalContainerA: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContentA: {
    width: "80%",
    padding: 30,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitleA: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  overlay: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  filterIcon: {
    padding: 8,
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  buttoncontainer1: {
    // textAlign:'center',
  },
  // column: {
  //   flex: 1,
  //   minWidth: "45%",
  //   maxWidth: "48%",
  // },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    // maxHeight: "90%",
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 8,
  },
  input: {
    height: 45,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingTop: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    color: "#333",
  },

  noRecordsText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#999",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    color: "#333",
    height: 50,
  },
  placeholderStyle: {
    fontSize: 14,
    color: "#fff",
  },

  closeButton: {
    flex: 1,
    padding: 14,
    backgroundColor: "transparent",
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#007bff",
  },
  closeButtonView: {
    backgroundColor: "#1a73e8",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: "center",
  },
  applyButton: {
    flex: 1,
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#007bff",
    fontWeight: "600",
    fontSize: 16,
  },
    closeButtonText6: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  applyButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  loader: {
    marginVertical: 10,
  },
  searchResults: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  searchResultsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  officerModalContent: {
    width: "90%",
    maxHeight: "80%",
    borderRadius: 12,
    padding: 16,
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
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  closeIcon: {
    padding: 8,
    left: 100,
    //  top:20
  },
  closeIcon5: {
    padding: 8,
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
  recordContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recordRow: {
    flexDirection: "row",
    paddingVertical: 6,
    // borderBottomWidth: 1,
    // borderBottomColor: '#eee',
  },
  recordLabel: {
    flex: 0.4,
    fontWeight: "600",
    color: "#666",
  },
  recordValue: {
    flex: 0.6,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 16,
  },
  buttonContainerp: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 16,
  },
  proceedButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: "#f5f5f5",
  },
  proceedButtonText: {
    color: "#666",
    fontSize: 14,
  },
  linkText: {
    color: "#007AFF",
    // textDecorationLine: 'underline',
  },
  container5: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "aliceblue",
    padding: 10,
    borderRadius: 10,
  },
})

export default Acceptedlist

