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
  RefreshControl,
  Alert,
} from "react-native"
import { Picker } from "@react-native-picker/picker"
import { Filter, X } from "lucide-react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getBusinessTypes } from "../database/Statebusinessapi"
import { DataTable } from "react-native-paper" // Added missing import for DataTable
import { useFocusEffect } from "@react-navigation/native"
import { getClarificationFromOngoingInspection } from "../database/Clarificationapi"
import { getListSendBackToFBOForClarification } from "../database/Sendbackradioapi"

interface ClarificationData {
  currentPageNo: number
  totalPages: number
  pageLimit: number
  totalRecords: number
  paginationListRecords: any[]
}

// Modal Component
interface ClarificationModalProps {
  isVisible: boolean
  onClose: () => void
  data: any
  refId: any
}

// Main Component
const Clarificationn: React.FC = () => {
  const [Clarification, setclarification] = useState<ClarificationData>({
    currentPageNo: 1,
    totalPages: 0,
    pageLimit: 10,
    totalRecords: 0,
    paginationListRecords: [],
  })
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [referenceNo, setReferenceNo] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [IsViewClarificationModalVisible, setIsViewClarificationModalVisible] = useState(false) 
  const [activeButton, setActiveButton] = useState<number>(1)
  const [selectedBusinessType, setSelectedBusinessType] = useState("")
  const [displayRefId, setdisplayRefId] = useState("")
  const [sendbacklist, setSendbacklist] = useState("")
  const [userId, setUserId] = useState<string | null>(null)
  const [view1, setview] = useState<any[]>([]) // Initialize as empty array
  const [refId, setRefId] = useState("")
  const [refreshing, setRefreshing] = useState(false)

  const [hasSearched, setHasSearched] = useState(false)
  const [itemsPerPage] = useState(10)

  const [currentPage, setCurrentPage] = useState(1)
  const [businessTypes, setBusinessTypes] = useState<Array<any>>([])
  const [isSearching, setIsSearching] = useState(false)

  const [showFromPicker, setShowFromPicker] = useState(false)
  const [selectedInspectionType, setSelectedInspectionType] = useState("")

  const [isLoading, setIsLoading] = useState(false)

  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  const [showToPicker, setShowToPicker] = useState(false)
  const [kobId, setKobId] = useState("")
  const [error, setError] = useState<string | null>(null)


  const fetchclarification = useCallback(
    async (page: number) => {
      setIsLoading(true)
      setError(null)
      try {
        const payload: any = {
          statusId: activeButton === 1 ? 41 : 50,
          userId: userId,
          displayRefId: displayRefId,
          companyName: companyName,
          fromDate: formatDate(fromDate),
          toDate: formatDate(toDate),
          processFlag: true,
          inspectionType: selectedInspectionType || null,
          fsoName: null,
          kobId: selectedBusinessType || null,
        }
        console.log("payload for Reject", payload)
        const result = await getClarificationFromOngoingInspection(payload, page)
        setclarification(result)
        setHasSearched(true)
        console.log("============Clarification ongoing=====", result)
      } catch (error) {
        console.error("Error loading data:", error)
        setError("Failed to load data. Please try again.")
      } finally {
        setIsLoading(false)
        setRefreshing(false)
      }
    },
    [userId, displayRefId, companyName, fromDate, toDate, selectedInspectionType, selectedBusinessType, activeButton],
  )
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
  useEffect(() => {
    const loadCompanyName = async () => {
      try {
        const savedCompanyName = await AsyncStorage.getItem("displayrefID")
        if (displayRefId) {
          setdisplayRefId(displayRefId)
        }
      } catch (error) {
        console.error("Error loading companyName from AsyncStorage:", error)
      }
    }

    loadCompanyName()
  }, [])
  useEffect(() => {
    console.log("Updated refId:", refId)
  }, [refId])

  useFocusEffect(
    useCallback(() => {
      // handleReset()
      setCurrentPage(1)
      setclarification({
        currentPageNo: 1,
        totalPages: 0,
        pageLimit: 10,
        totalRecords: 0,
        paginationListRecords: [],
      })
    }, []),
  )
  
  const openViewModal = (refId: string, inspectionId: string) => {
    setRefId(refId)
    handleApiCall(inspectionId, refId)
  }
  
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

  const formatDate = (date) => {
    if (!date) return null
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
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

  // useEffect(() => {
  //   const loadCompanyName = async () => {
  //     try {
  //       const savedCompanyName = await AsyncStorage.getItem("companyName")
  //       if (savedCompanyName) {
  //         setCompanyName(savedCompanyName)
  //       }
  //     } catch (error) {
  //       console.error("Error loading companyName from AsyncStorage:", error)
  //     }
  //   }

  //   loadCompanyName()
  // }, [])

  const onFromDateChange = (event, selectedDate) => {
    setShowFromPicker(false)
    if (event.type === "set") {
      setFromDate(selectedDate)

      if (toDate && selectedDate > toDate) {
        setToDate(null)
      }
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    setCurrentPage(1)
    if (hasSearched) {
      fetchclarification(1)
    } else {
      setRefreshing(false)
    }
  }

  const onToDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowToPicker(false)
    if (event.type === "set" && selectedDate) {
      if (!fromDate || selectedDate >= fromDate) {
        setToDate(selectedDate)
      }
    }
  }

  const getDisplayDate = (date: Date | null): string => {
    return date ? date.toLocaleDateString() : "Select Date"
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const toggleModal = () => {
    if (!isModalVisible) {
      // handleReset()
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
    setHasSearched(false)
    setdisplayRefId("")
    setCurrentPage(1)
   
  }

  const handlePress = (buttonIndex: number) => {
    setActiveButton(buttonIndex)

    setHasSearched(false)
    setCurrentPage(1)
    setclarification({
      currentPageNo: 1,
      totalPages: 0,
      pageLimit: 10,
      totalRecords: 0,
      paginationListRecords: [],
    })
  }

  const handlePageChange = async (newPage: number) => {
    if (newPage >= 1) {
      setCurrentPage((prevPage) => prevPage + 1)
      await fetchclarification(newPage)
    }
  }

  useEffect(() => {
    if (userId && hasSearched) {
      fetchclarification(currentPage)
    }
  }, [userId, currentPage, fetchclarification, hasSearched])

  const renderPagination = () => {
    const hasMorePages =
      Clarification?.paginationListRecords?.length > 0 && Clarification?.paginationListRecords?.length >= itemsPerPage

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
  }, [currentPage])

  const handleApiCall = async (inspectionId: any, refId: any) => {
    try {
      console.log("refID==", refId)
      console.log("inspectionID==", inspectionId)

      const response = await getListSendBackToFBOForClarification(refId, inspectionId)
      console.log("API Response:", response)
      
      // Ensure response is an array
      const responseData = Array.isArray(response) ? response : []
      setview(responseData)
      
      // Open the modal
      setIsViewClarificationModalVisible(true)

      return response
    } catch (error) {
      console.error("Error in handleApiCall:", error)
      Alert.alert("Error", "Failed to fetch data. Please try again.")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleModal} style={styles.filterIcon}>
          <Filter size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, activeButton === 1 ? styles.activeButton : styles.inactiveButton]}
            onPress={() => handlePress(1)}
          >
            <Text style={[styles.buttonText, activeButton === 1 ? styles.activeButtonText : styles.inactiveButtonText]}>
              Clarification from ongoing inspection bin 1
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, activeButton === 2 ? styles.activeButton : styles.inactiveButton]}
            onPress={() => handlePress(2)}
          >
            <Text style={[styles.buttonText, activeButton === 2 ? styles.activeButtonText : styles.inactiveButtonText]}>
              Clarification from scrutinize inspection bin
            </Text>
          </TouchableOpacity>
        </View>
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
                  minimumDate={fromDate || undefined}
                  // maximumDate={today}
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
                      if ((fromDate && !toDate) || (!fromDate && toDate)) {
                                          Alert.alert("Please select both From and To dates")
                                          return
                                        }
                    setCurrentPage(1)
                    setHasSearched(true)
                    setdisplayRefId(referenceNo)
                    // setCompanyName(companyName)
                    await fetchclarification(1)
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
        style={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {!hasSearched ? (
          <Text style={styles.emptyListText}>No record found</Text>
        ) : Clarification.paginationListRecords.length > 0 ? (
          Clarification.paginationListRecords.map((item) => (
            <View
              key={`item-${item.assignmentId || ""}-${Math.random().toString(36).substr(2, 9)}`}
              style={styles.listItem}
            >
              <View style={styles.listItemContent}>
                <View style={styles.leftContent}>
                  <Text style={styles.boldText}>
                    Assignment ID: <Text style={styles.normalText}>{item.assignmentId || "N/A"}</Text>
                  </Text>

                  <Text style={styles.boldText}>
                    Status Description: <Text style={styles.normalText}>{item.statusDesc || "N/A"}</Text>
                  </Text>
                  <Text style={styles.boldText}>
                    Date of Inspection: <Text style={styles.normalText}>{item.inspectionDate || "N/A"}</Text>
                  </Text>

                  <View style={styles.companyy}>
                    <Text style={styles.boldText}>Company Name/Organization:</Text>
                    <Text style={styles.normalText}>{item.companyName || "N/A"}</Text>
                    <Text style={styles.normalText}>{item.fullAddress || "N/A"}</Text>
                  </View>
                </View>

                <View style={styles.rightContent}>
                  <Text style={styles.boldText}>
                    Inpsection Type: <Text style={styles.normalText}>{item.inspectionType || "N/A"}</Text>
                  </Text>
                  <Text style={styles.boldText}>
                    Ref No:/Applicant No:{" "}
                    <Text style={styles.normalText}>
                      {item.displayRefId || "N/A"}/{item.certificateNo || "N/A"}
                    </Text>
                  </Text>
                </View>
              </View>
              <View style={styles.buttonview}>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => openViewModal(item.refId, item.inspectionId)}
                >
                  <Text style={styles.viewButtonText}>View</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyListText}>No inspections found.</Text>
        )}
      </ScrollView>

      {hasSearched && Clarification?.paginationListRecords?.length > 0 && renderPagination()}
      
      {/* View Clarification Modal */}
      <Modal
        animationType="none"
        transparent={true}
        visible={IsViewClarificationModalVisible}
        onRequestClose={() => setIsViewClarificationModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, styles.officerModalContent]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Points to be checklist</Text>
              <TouchableOpacity onPress={() => setIsViewClarificationModalVisible(false)} style={styles.closeIcon}>
                <X size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.tableContainer}>


  {view1 && view1.length > 0 ? (
    view1.map((officer, index) => (
      <View key={officer.id || index} style={styles.tableRow}>
        {/* <Text style={styles.tableCell}>{index + 1}</Text> */}
        <Text style={styles.tableCell}>Section Name: {officer.sectionName || 'N/A'}</Text>
        <Text style={styles.tableCell}>Score: {officer.maximumScore || 'N/A'}</Text>
        
        <Text style={styles.tableCell}>Observation: {officer.observation || 'N/A'}</Text>
        <Text style={styles.tableCell}>Maximum score: {officer.maximumScore || 'N/A'}</Text>
        <Text style={styles.tableCell}>Score: {officer.score || 'N/A'}</Text>
          {/* <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => {
                    
                      const updatedList = [...sendbacklist];
                      updatedList[index].isSelected = !updatedList[index].isSelected;
                      setSendbacklist(updatedList); 
                    }}
                  >
                    <Text style={styles.checkboxText}>
                      {item.isSelected ? "✅" : "⬜"}
                    </Text>
                  </TouchableOpacity> */}
        <Text style={styles.tableCell}>Remarks: {officer.comments || 'N/A'}</Text>
      </View>
    ))
  ) : (
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, { textAlign: 'center', flex: 1 }]}>
        No officers found
      </Text>
    </View>
  )}
</ScrollView>

            <TouchableOpacity style={styles.closeButtonView} onPress={() => setIsViewClarificationModalVisible(false)}>
              <Text style={styles.closeButtonText6}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    // flex: 1,
  },
  buttonContainer: {
    // padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    flexWrap: "nowrap",
    paddingLeft: 20,
    paddingRight: 20,
    gap: 20,
  },
  button: {
    flex: 1,
    padding: 5,
    borderRadius: 6,
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#007bff",
  },
  inactiveButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#007bff",
  },
  buttonText: {
    fontSize: 12,
    textAlign: "center",
  },
  activeButtonText: {
    color: "white",
  },
  inactiveButtonText: {
    color: "#007bff",
  },
  listItemText: {
    fontSize: 16,
    color: "#333",
  },
  viewcontainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  companyy: {
    width: 260,
  },
  boldText: {
    fontWeight: "400",
    color: "#000",
    marginTop: 20,
    fontSize: 14,
  },
  buttonview: {
    marginTop: 10,
    alignItems: "flex-start",
  },
  viewButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    width: 100,
    alignItems: "center",
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  viewButtonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
  },
  remarksModalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
    alignSelf: "center",
  },
  remarksScrollView: {
    maxHeight: 300,
    marginVertical: 10,
  },
  remarksText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  closeFullButton: {
    backgroundColor: "#007AFF",
    width: 100,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  closeFullButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  normalText: {
    fontWeight: "normal",
    color: "#666",
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
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  listItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    padding: 10,
    borderBottomWidth: 0,
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
  buttoncontainer1: {},
  column: {
    flex: 1,
    minWidth: "45%",
    maxWidth: "48%",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "90%",
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
    color: "#999",
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
  disabledButton: {
    opacity: 0.5,
  },
  paginationButtonText: {
    fontSize: 16,
    color: "#333",
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
  buttonContainers: {
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
  },
  container5: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "aliceblue",
    padding: 10,
    borderRadius: 10,
  },
  // Modal container styles
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  officerModalContent: {
    width: "100%",
    maxHeight: "80%",
    borderRadius: 12,
  },
  tableContainer: {
    maxHeight: 400,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
  },
  tableRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tableCell: {
    padding: 8,
  },
  closeButtonView: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
})

// Modal component styles


export default Clarificationn