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
  RefreshControl,ActivityIndicator
} from "react-native"
import { Picker } from "@react-native-picker/picker"
import { Filter, X } from "lucide-react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import AsyncStorage from "@react-native-async-storage/async-storage"

import { useFocusEffect } from "@react-navigation/native"
import { searchApplicationsAllocated } from "../database/AllocatedInspectionn/SearchAllocatedApi"
import { getInspectionOfficers } from "../database/AllocatedInspectionn/ooficerapi"
import { getBusinessTypes } from "../database/Statebusinessapi"
const AllocatedInspection: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [referenceNo, setReferenceNo] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [loggedInUserIdd1, setLoggedInUserIdd1] = useState("")
  const [selectedBusinessType, setSelectedBusinessType] = useState("")
  const [fsoName, setfsoName] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [displayRefId, setdisplayRefId] = useState("")
  const [itemsPerPage] = useState(10)
  
  const [selectedInspectionOfficerName, setSelectedInspectionOfficerName] = useState("")
   const [currentPage, setCurrentPage] = useState(1)
  const [businessTypes, setBusinessTypes] = useState<Array<any>>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any>(null)
  const [showFromPicker, setShowFromPicker] = useState(false)
  const [selectedInspectionType, setSelectedInspectionType] = useState("")
  const [selectedInspectionOfficer, setSelectedInspectionOfficer] = useState("")
const [isLoading, setIsLoading] = useState(false)
  const [inspectionOfficers, setInspectionOfficers] = useState<Array<any>>([])
  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())
  const [showToPicker, setShowToPicker] = useState(false)
 const [kobId, setKobId] = useState("")
   const [error, setError] = useState<string | null>(null)
  // const [Totalpage, setTotalpage] = useState()
  
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
  const onFromDateChange = (event: any, selectedDate?: Date) => {
    setShowFromPicker(false)
    if (selectedDate) {
      setFromDate(selectedDate)
    }
  }
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const onToDateChange = (event: any, selectedDate?: Date) => {
    setShowToPicker(false)
    if (selectedDate) {
      setToDate(selectedDate)
    }
    setShowFromPicker(true)
  }
  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId")

        if (storedUserId) {
          setLoggedInUserIdd1(storedUserId)
        } else {
          console.warn("No logged-in user found in AsyncStorage.")
        }
      } catch (error) {
        console.error("Error fetching logged-in user:", error)
      }
    }

    fetchLoggedInUser()
  }, [])

  
  // const onRefresh = async () => {
  //   // setRefreshing(true)
  //   setCurrentPage(1)
  //   setSearchResults({ paginationListRecords: [] })

   
  // }
  useEffect(() => {
    const fetchInspectionData = async () => {
      try {
        const inspectionOfficerData = await getInspectionOfficers()
        setInspectionOfficers(inspectionOfficerData)
      } catch (err) {
        console.error("Error fetching inspection data:", err)
      }
    }
    fetchInspectionData()
  }, [])
  const toggleModal = () => {
    if (!isModalVisible) {
    }
    setIsModalVisible(!isModalVisible)
  }

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

 
  const handleReset = () => {
    setReferenceNo("")
    setCompanyName("")
   
    setSelectedBusinessType("")
   
    setSelectedInspectionType("")
    setSelectedInspectionOfficer("")
    setSearchResults({ paginationListRecords: [] })

    setSearchResults("")
  }
  const handlePageChange = async (newPage: number) => {
    if (newPage >= 1) {
      setCurrentPage(newPage);
      await handleSearch(newPage); 
    }
  };

    const handleSearch = async (page: number) => {
      setIsSearching(true)
      setSearchResults([]);
      try {
        const createdBy = loggedInUserIdd1
        const payload = {
          userId: createdBy, //done
          displayRefId: referenceNo,
          companyName: companyName,
          fromDate: fromDate.toISOString().split("T")[0],
          toDate: toDate.toISOString().split("T")[0],
          inspectionType: selectedInspectionType,
          fsoName: fsoName,
          kobId: selectedBusinessType || "",
        }
  
        console.log("Payload before API call:", JSON.stringify(payload, null, 2))
        const results = await searchApplicationsAllocated(payload, page)
        console.log("API response received:", results)
  
     
        if (page === 1) {
          setSearchResults(results)
        } else {
          setSearchResults((prev) => ({
            ...prev,
            paginationListRecords: [...(prev?.paginationListRecords || []), ...(results?.paginationListRecords || [])],
          }))
        }
  
        setCurrentPage(page)
      } catch (error) {
        console.error("Error searching applications:", error)
        setError("Failed to search applications")
      } finally {
        setIsSearching(false)
      }
    }
     useEffect(() => {
        console.log("Updated search results:", searchResults)
      }, [searchResults])
      const renderPagination = () => {
        const hasMorePages =
          searchResults?.paginationListRecords?.length > 0 &&
          searchResults?.paginationListRecords?.length >= itemsPerPage 
    
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
                <TouchableOpacity onPress={toggleModal} style={styles.closeIcon}>
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
                <Text>{fromDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
              {showFromPicker && (
                <DateTimePicker value={fromDate} mode="date" onChange={onFromDateChange} maximumDate={today} />
              )}

              <Text style={styles.label}>Allocated Date To</Text>
              <TouchableOpacity style={styles.input} onPress={() => setShowToPicker(true)}>
                <Text>{toDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
              {showToPicker && (
                <DateTimePicker
                  value={toDate}
                  mode="date"
                  onChange={onToDateChange}
                  // minimumDate={fromDate}
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
                  <Picker.Item label="Pre Inspection" value="pre" />
                  <Picker.Item label="Post Inspection" value="post" />
                  {/* {inspectionTypes.map((type) => (
    <Picker.Item key={type.id} label={type.name} value={type.id} />
  ))} */}
                </Picker>
              </View>

              <Text style={styles.label}>Inspection Officer</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedInspectionOfficer}
                  onValueChange={(itemValue) => {
                    const selectedOfficer = inspectionOfficers.find((officer) => officer.fssaiUserId === itemValue)
                    setSelectedInspectionOfficer(itemValue) // Update the selected officer ID
                    setfsoName(selectedOfficer ? selectedOfficer.fsoName : "") // Update the fsoName
                  }}
                  style={styles.picker}
                  dropdownIconColor="#666"
                >
                  <Picker.Item label="Select Inspection Officer" value="" style={styles.placeholderStyle} />
                  {inspectionOfficers.map((officer) => (
                    <Picker.Item key={officer.fssaiUserId} label={officer.fsoName} value={officer.fssaiUserId} />
                  ))}
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
                               await handleSearch(1)
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

          <ScrollView >
            {searchResults && searchResults.paginationListRecords && searchResults.paginationListRecords.length > 0 ? (
              <View>
                {searchResults.paginationListRecords.map((item, index) => (
               <View key={index} style={styles.recordContainer}>
               <View style={styles.column}>
                 <View style={styles.recordRow}>
                   <Text style={styles.recordLabel}>Assignment ID:</Text>
                   <Text style={styles.recordValue}>{item.assignmentId}</Text>
                 </View>
                 <View style={styles.recordRow}>
                   <Text style={styles.recordLabel}>Aplicnt Name:</Text>
                   <Text style={styles.recordValue}>{item.companyName}</Text>
                 </View>
                 <View style={styles.recordRow}>
                   <Text style={styles.recordLabel}>Ref ID:</Text>
                   <Text style={styles.recordValue}>{item.displayRefId}</Text>
                 </View>
               </View>

               <View style={styles.column}>
                 <View style={styles.recordRow}>
                   <Text style={styles.recordLabel}>Officer Name:</Text>
                   <Text style={styles.recordValue}>{item.fsoName}</Text>
                 </View>
                 <View style={styles.recordRow}>
                   <Text style={styles.recordLabel}>Stage:</Text>
                   <Text style={styles.recordValue}>{item.statusDesc}</Text>
                 </View>
                 <View style={styles.recordRow}>
                   <Text style={styles.recordLabel}>Remarks:</Text>
                   <Text style={styles.recordValue}>{item.raRemarks}</Text>
                 </View>
                 <View style={styles.recordRow}>
                   <Text style={styles.recordLabel}>Inspection Date:</Text>
                   <Text style={styles.recordValue}>{item.inspectionDate}</Text>
                 </View>
               </View>
             </View>

                ))}
              </View>
            ) : (
              <Text style={[styles.noRecordsText, { textAlign: "center", marginTop: 20 }]}>
                {isSearching ? "Searching..." : "No records found"}
              </Text>
            )}
          </ScrollView>
          {searchResults?.paginationListRecords?.length > 0 && renderPagination()}
        
        </SafeAreaView>
      )
    }
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
    paddingTop:12,
    borderRadius: 8,
    backgroundColor: "#fff",
    color: "#333",
  },
  recordContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },
  recordRow: {
    marginBottom: 10,
  },
  recordLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  recordValue: {
    fontSize: 14,
    color: "#333",
    flexShrink: 1,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 16,
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
  proceedButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
    alignSelf: "flex-end",
    width: 100,
  },
  proceedButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
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

export default AllocatedInspection

