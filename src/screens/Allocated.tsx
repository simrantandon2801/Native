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
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from "@react-native-picker/picker"
import { Filter, X } from "lucide-react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import AsyncStorage from "@react-native-async-storage/async-storage"

import { useFocusEffect } from "@react-navigation/native"
import { searchApplicationsAllocated } from "../database/AllocatedInspectionn/SearchAllocatedApi"
import { getInspectionOfficers } from "../database/AllocatedInspectionn/ooficerapi"
import { getBusinessTypes } from "../database/Statebusinessapi"
import { getSecondaryInspectors } from "../database/SecondaryInspectorapi"
import { getListOffsounDerDoForReg } from "../database/Allocateapi"
import { ReassignModal } from "./ReassignModal"
import { RescheduleModal } from "./RescheduleModal";
const AllocatedInspection: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [referenceNo, setReferenceNo] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [loggedInUserIdd1, setLoggedInUserIdd1] = useState("")
  const [selectedBusinessType, setSelectedBusinessType] = useState("")
  const [fsoName, setfsoName] = useState("")
  const [refId, setRefId] = useState("");
  const [refreshing, setRefreshing] = useState(false)
  const [displayRefId, setdisplayRefId] = useState("")
  const [isRescheduleModalVisible, setIsRescheduleModalVisible] = useState(false)
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
   const [isReassignModalVisible, setIsReassignModalVisible] = useState(false)
   const [selectedAssignmentId, setSelectedAssignmentId] = useState("")
  // const [Totalpage, setTotalpage] = useState()
  const openModal = () => {
    setIsViewModalVisible(true);
  };
  useEffect(() => {
    console.log("Updated refId:", refId);
  }, [refId]);
  // Function to close the modal
  const closeModal = () => {
    setIsViewModalVisible(false);
  };
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
    setShowFromPicker(false);
    if (event.type === 'set') {
      setFromDate(selectedDate);
     
      if (toDate && selectedDate > toDate) {
        setToDate(null);
      }
    }
  };


  const onToDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowToPicker(false);
    if (event.type === 'set' && selectedDate) {
      setToDate(selectedDate);
    }
  };
  // Helper function to display date or placeholder
  const getDisplayDate = (date: Date | null): string => {
    return date ? date.toLocaleDateString() : 'Select Date';
  };
  const today = new Date()
  today.setHours(0, 0, 0, 0)
 
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
    const today = new Date(); 
    setFromDate(null);
    setToDate(null);
  
    setShowFromPicker(false);
    setShowToPicker(false);
  }
  useFocusEffect(
    useCallback(() => {
      handleReset()
      setCurrentPage(1)
      setSearchResults({ paginationListRecords: [] })
    }, []),
  )
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
          fromDate: null,
          toDate: null,
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
      <TouchableOpacity 
        style={styles.input} 
        onPress={() => setShowFromPicker(true)}
      >
        <Text>{getDisplayDate(fromDate)}</Text>
      </TouchableOpacity>
      {showFromPicker && (
        <DateTimePicker
          value={fromDate || today}
          mode="date"
          onChange={onFromDateChange}
          maximumDate={today}
        />
      )}

<Text style={styles.label}>Allocated Date To</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowToPicker(true)}
      >
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
              <View style={styles.recordContainer}>
              <View style={styles.recordRow}>
                <Text style={styles.recordLabel}>Assignment ID:</Text>
                <Text style={styles.recordValue}>{item.assignmentId}</Text>
              </View>
              
              <View style={styles.recordRow}>
                <Text style={styles.recordLabel}>Applicant Name:</Text>
                <Text style={styles.recordValue}>{item.companyName}</Text>
              </View>
              
              <View style={styles.recordRow}>
                <Text style={styles.recordLabel}>Ref ID:</Text>
                <Text style={styles.recordValue}>{item.displayRefId}</Text>
              </View>
              
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
                <Text style={styles.recordValue}>{item.createdOn}</Text>
              </View>
              <View style={styles.recordRow}>
                <Text style={styles.recordLabel}>Inspection Type:</Text>
                <Text style={styles.recordValue}>{item.
inspectionType
}</Text>
              </View>
        
              <View style={styles.buttonContainerp}>
              {item.statusId === 17 && (
  <View style={styles.container5}>
   
    {/* <Text style={styles.proceedButtonText}>pending / </Text> */}
    
   

    <TouchableOpacity
  onPress={async () => {
    try {
      console.log("Reassign button pressed for Assignment ID:", item.assignmentId);
      console.log("Reference ID:", item.refId); // Debugging log

      if (!item?.refId) {
        console.error("Error: refId is undefined or empty");
        return;
      }

      setRefId(item.refId); // Ensure refId is set before opening modal
      setSelectedAssignmentId(item.assignmentId);
      setIsReassignModalVisible(true);
      
    } catch (error) {
      console.error("Error handling Reassign button:", error);
    }
  }}
>
  <Text style={styles.linkText}>Reassign</Text>
</TouchableOpacity>



  </View>
)}
                
                {item.statusId === 18 && (
  <View style={styles.container5}>
  
  <TouchableOpacity
  onPress={async () => { // Make the function async
    try {
      await AsyncStorage.setItem("displayrefID", item.displayRefId.toString());
    } catch (error) {
      console.error("Error saving displayRefID:", error);
    }
    setIsRescheduleModalVisible(true);
    console.log("Reschedule button pressed for Assignment ID:", item.assignmentId);
  }}
>
  <Text style={styles.linkText}>Reschedule</Text>
</TouchableOpacity>


   
    <Text style={styles.proceedButtonText}> / </Text>

   
    <TouchableOpacity
      onPress={() => {
        console.log("View button pressed for Assignment ID:", item.assignmentId);
        openModal()
      }}
    >
      <Text style={styles.linkText}>View</Text>
    </TouchableOpacity>
    <Modal visible={isViewModalVisible} animationType="none" transparent={true}>
  <View style={styles.modalContainerA}>
    <View style={styles.modalContentA}>
  
      <TouchableOpacity 
        style={styles.closeIcon} 
        onPress={closeModal}
      >
        <X size={24} color="#000" />
      </TouchableOpacity>

     
      <Text style={styles.modalTitleA}>Rejected Remarks</Text>
      <Text>{item.rejectedRemarks}</Text>
    </View>
  </View>
</Modal>
  </View>
)}
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
          <View style={styles.overlay}>
          {refId ? (
  <ReassignModal
    isVisible={isReassignModalVisible}
    onClose={() => setIsReassignModalVisible(false)}
    assignmentId={selectedAssignmentId}
    refId={refId}  // Ensure this is not undefined
    inspectors={inspectionOfficers}
    onReassign={async (data) => {
      try {
        console.log("Reassigning:", {
          assignmentId: selectedAssignmentId,
          ...data,
        });
        setIsReassignModalVisible(false);
        handleSearch(currentPage);
      } catch (error) {
        console.error("Error reassigning inspector:", error);
      }
    }}
  />
) : (
  <Text></Text>
)}

            </View>
            <RescheduleModal
        isVisible={isRescheduleModalVisible}
        onClose={() => setIsRescheduleModalVisible(false)}
        inspectors={inspectionOfficers}
        onReschedule={async (data) => {
          try {
            console.log("Rescheduling:", {
              assignmentId: selectedAssignmentId,
              ...data,
            })
            setIsRescheduleModalVisible(false)
            handleSearch(currentPage)
          } catch (error) {
            console.error("Error rescheduling inspector:", error)
          }
        }}
      />
        </SafeAreaView>
      )
    }
const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    backgroundColor: "#f5f5f5",
  },
  modalContainerA: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalContentA: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitleA: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  overlay:{
    flex:1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end', 

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
  buttoncontainer1:{
    // textAlign:'center',
    


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
    left:100,

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
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recordRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    // borderBottomWidth: 1,
    // borderBottomColor: '#eee',
  },
  recordLabel: {
    flex: 0.4,
    fontWeight: '600',
    color: '#666',
  },
  recordValue: {
    flex: 0.6,
    color: '#333',
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
    backgroundColor: '#f5f5f5',
  },
  proceedButtonText: {
    color: '#666',
    fontSize: 14,
  },
  linkText: {
    color: '#007AFF',
    // textDecorationLine: 'underline',
  },
  container5:{
      flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor:'aliceblue',
    padding:10,
    borderRadius:10
  }
})

export default AllocatedInspection

