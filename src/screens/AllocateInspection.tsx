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
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native"
import { Picker } from "@react-native-picker/picker"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Filter, X } from "lucide-react-native"
import { getDistrictList, searchApplications } from "../database/Districtapi"
import { getStateList, getBusinessTypes } from "../database/Statebusinessapi"
import { getAllocateInspectionDetails } from "../database/ProceedAllocateapi"
import { useFocusEffect } from "@react-navigation/native"
import { getListOffsounDerDoForReg } from "../database/Allocateapi"
import { getSecondaryInspectors } from "../database/SecondaryInspectorapi"
import { createInspection } from "../database/CreateInspection"

interface SelectedInspectionDetails {
  kobDetails?: KobDetail[]
  inspectionDetails?: InspectionDetail[]
}
interface KobDetail {
  kobname: string
}
interface User {
  fssaiUserId: string;
}
interface InspectionDetail {
  key: string
  value: string
  totalobtained: any
  inspectiondate: any
  obtainedpercentage: any
}

const AllocateInspection: React.FC = () => {
  // All state variables must be declared at the top level
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [referenceNo, setReferenceNo] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [loggedInUserId, setLoggedInUserId] = useState("")
  const [loggedInUser, setLoggedInUser] = useState({ name: "Default Logged-In User" })
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false)
  const [displayrefId1, setdisplayRefId1] = useState("")
  const [userId, setUserId] = useState<string | null>(null)
  const [loggedInUserId1, setLoggedInUserId1] = useState("")
  const [selectedBusinessType, setSelectedBusinessType] = useState("")
  const [districts, setDistricts] = useState<Array<any>>([])
  // const [displayrefID1, setdisplayRefID1] = useState("")
  const [refId1, setRefId5] = useState("")
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false)
  const [districtName, setDistrictName] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [states, setStates] = useState<Array<any>>([])
  const [businessTypes, setBusinessTypes] = useState<Array<any>>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any>(null)
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false)
  const [selectedInspectionDetails, setSelectedInspectionDetails] = useState<SelectedInspectionDetails | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [kobId, setKobId] = useState("")
  const [stateCode, setstatecode] = useState("")
  const [certificateNo, setCertificateNo] = useState<string>("")
  const [refId, setRefId] = useState<string>("")
  const [displayRefId, setdisplayRefId] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  // Add these new state variables for the Allocate modal
  const [isAllocateModalVisible, setIsAllocateModalVisible] = useState(false)
  const [selectedInspector, setSelectedInspector] = useState("")
  const [remarks, setRemarks] = useState("")
  const [inspectors, setInspectors] = useState([])
  const [secondaryInspectors, setSecondaryInspectors] = useState([])
  const [selectedSecondaryInspectors, setSelectedSecondaryInspectors] = useState([])
  const [isSecondaryPickerVisible, setIsSecondaryPickerVisible] = useState(false)

  // All functions that use hooks or state
  const openAllocateModal = () => {
    setIsAllocateModalVisible(true)
    setSelectedInspector("")
    setSecondaryInspectors([])
    fetchInspectors()
    fetchSecondaryInspectors()
  }

  const closeAllocateModal = () => {
    setIsAllocateModalVisible(false)
    setSelectedInspector("")
    setSecondaryInspectors([])
    setRemarks("")
  }

  const fetchInspectors = async () => {
    try {
      const userId = loggedInUserId1
      const response = await getListOffsounDerDoForReg(userId)
      setInspectors(response)
    } catch (error) {
      console.error("Error fetching inspectors:", error)
    }
  }

  const fetchSecondaryInspectors = async () => {
    try {
      const userId = loggedInUserId1
      const response = await getSecondaryInspectors(userId)
      const filteredInspectors = response.filter((inspector) => inspector.fssaiUserId !== selectedInspector)
      setSelectedSecondaryInspectors(filteredInspectors)
    } catch (error) {
      console.error("Error fetching secondary inspectors:", error)
    }
  }

  const toggleSecondaryPicker = () => {
    setIsSecondaryPickerVisible(!isSecondaryPickerVisible)
  }

  const handleSecondaryInspectorSelection = (inspectorId) => {
    if (inspectorId === selectedInspector) return
    setSecondaryInspectors((prevInspectors) => {
      const isSelected = prevInspectors.some((inspector) => inspector.fssaiUserId === inspectorId)
      if (isSelected) {
        return prevInspectors.filter((inspector) => inspector.fssaiUserId !== inspectorId)
      } else {
        const inspector = selectedSecondaryInspectors.find((i) => i.fssaiUserId === inspectorId)
        return inspector ? [...prevInspectors, inspector] : prevInspectors
      }
    })
  }
  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const storedUserName = await AsyncStorage.getItem("loggedInUserName")
        if (storedUserName) {
          setLoggedInUser({ name: storedUserName })
        } else {
          console.warn("No logged-in user found in AsyncStorage.")
        }
      } catch (error) {
        console.error("Error fetching logged-in user:", error)
      }
    }

    fetchLoggedInUser()
  }, [])
  // useEffect hooks
  useEffect(() => {
    const fetchDataFromAsyncStorage = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const storedUserId = await AsyncStorage.getItem("userId")
        setUserId(storedUserId)
        console.log("Retrieved Data:", { userId: storedUserId })
      } catch (err) {
        console.error("Error fetching data from AsyncStorage:", err)
        setError("Failed to load data from storage.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDataFromAsyncStorage()
  }, [])

  const handleCreateInspection = () => {
    if (!selectedInspector) {
      Alert.alert("Error", "Please select a primary inspector")
      return
    }

    if (!remarks.trim()) {
      Alert.alert("Error", "Please enter remarks")
      return
    }

    setIsConfirmModalVisible(true)
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
    const fetchLoggedInUser = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId")

        if (storedUserId) {
          setLoggedInUserId1(storedUserId)
        } else {
          console.warn("No logged-in user found in AsyncStorage.")
        }
      } catch (error) {
        console.error("Error fetching logged-in user:", error)
      }
    }

    fetchLoggedInUser()
  }, [])

  const handleProceed = async (refId: string, certificateNo: string) => {
    try {
      // Store values in AsyncStorage
      await AsyncStorage.setItem("refIdddd", refId.toString())
      await AsyncStorage.setItem("certificatenoproceed", certificateNo.toString())
      await AsyncStorage.setItem("displayrefIddddd", displayRefId.toString())

      // Call the API function
      const result = await getAllocateInspectionDetails(refId, certificateNo)
      console.log("ref'idafsa", refId, "certifdifFA", certificateNo)
      console.log(result)

      // Update state variables
      setSelectedInspectionDetails(result)
      setCertificateNo(certificateNo)
      setRefId(refId)
      setdisplayRefId(displayRefId)

      // Retrieve values from AsyncStorage for logging
      const refuda = await AsyncStorage.getItem("refIdddd")
      const certuda = await AsyncStorage.getItem("certificatenoproceed")
      const certuda11 = await AsyncStorage.getItem("displayrefIddddd")
      console.log("simranda : ", refuda, " ,", certuda,",",certuda11)

      // Show the modal
      setIsDetailsModalVisible(true)
    } catch (error) {
      console.error("Error fetching Allocate Inspection Details:", error)
    }
  }

  const fetchData = useCallback(async () => {
    try {
      const stateData = await getStateList()
      setStates(stateData)
      const businessTypeData = await getBusinessTypes()
      setBusinessTypes(businessTypeData)
    } catch (err) {
      console.error("Error fetching initial data:", err)
      setError("Failed to fetch initial data")
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useFocusEffect(
    useCallback(() => {
      setSearchResults({ paginationListRecords: [] })
      fetchData()

      return () => {}
    }, [fetchData]),
  )

  useEffect(() => {
    const func = async () => {
      const storedDisplayrefID = await AsyncStorage.getItem("displayrefID")
      setdisplayRefId(storedDisplayrefID || "")
    }
    func()
  }, [])

  const onRefresh = async () => {
    setRefreshing(true)
    setCurrentPage(1)
    setSearchResults({ paginationListRecords: [] })

    try {
      await fetchData()
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setRefreshing(false)
    }
  }

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible)
  }

  const handleStateChange = async (stateCode: string) => {
    setSelectedState(stateCode)
    setDistrictName("")
    setSelectedDistrict("")
    setCompanyName("")
    setError(null)

    if (!stateCode) {
      setDistricts([])
      return
    }

    setIsLoadingDistricts(true)
    try {
      const districtData = await getDistrictList(stateCode)
      setDistricts(districtData)
    } catch (err) {
      setError("Failed to fetch districts")
      console.error("Error fetching districts:", err)
      setDistricts([])
    } finally {
      setIsLoadingDistricts(false)
    }
  }

  const handleDistrictChange = async (districtCode: string) => {
    setSelectedDistrict(districtCode)

    const selectedDistrictObj = districts.find((district) => district.districtCode === districtCode)
    if (selectedDistrictObj) {
      const newDistrictName = selectedDistrictObj.districtName
      setDistrictName(newDistrictName)
      await AsyncStorage.setItem("districtName", newDistrictName)
    }
  }

  const onClose = () => {
    setIsDetailsModalVisible(false)
  }

  useEffect(() => {
    const loadDistrictName = async () => {
      try {
        const storedDistrictName = await AsyncStorage.getItem("districtName")
        if (storedDistrictName) {
          setDistrictName(storedDistrictName)
        }
      } catch (err) {
        console.error("Error loading districtName from AsyncStorage:", err)
      }
    }
    loadDistrictName()
  }, [])

  const handleReset = () => {
    setReferenceNo("")
    setCompanyName("")
    setSelectedState("")
    setSelectedDistrict("")
    setSelectedBusinessType("")
    setDistricts([])
    setError(null)
    setSearchResults("")
  }

  const handleSearch = async (page: number) => {
    setIsSearching(true)
    try {
      const payload = {
        fssaiUserId: userId,
        statusId: 5,
        licenseCategoryId: 1,
        displayRefId: referenceNo,
        companyName: companyName,
        district: selectedState,
        subDivision: selectedDistrict,
        fromDate: null,
        toDate: null,
        categoryId: "",
        kobId: selectedBusinessType,
      }

      console.log("Payload before API call:", JSON.stringify(payload, null, 2))
      const results = await searchApplications(payload, page)
      console.log("API response received:", results)
      setSearchResults(results)
    } catch (error) {
      console.error("Error searching applications:", error)
      Alert.alert("Error", "Failed to search applications. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }

  const handlePageChange = async (newPage: number) => {
    if (newPage >= 1) {
      setCurrentPage(newPage)
      await handleSearch(newPage)
    }
  }

  const renderPagination = () => {
    const hasMorePages =
      searchResults?.paginationListRecords?.length > 0 && searchResults?.paginationListRecords?.length >= itemsPerPage

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

  // Render the component - no early returns before all hooks are called
  return (
    <SafeAreaView style={styles.container}>
      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={toggleModal} style={styles.filterIcon}>
              <Filter size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <Modal visible={isModalVisible}>
            <View style={styles.modalOverlayF}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Filter Inspection</Text>
                  <TouchableOpacity onPress={toggleModal} style={styles.closeIcon}>
                    <X size={24} color="#000" />
                  </TouchableOpacity>
                </View>

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
                  onChangeText={async (text) => {
                    setCompanyName(text)
                    await AsyncStorage.setItem("companyName", text)
                  }}
                  placeholderTextColor="#999"
                />

                <Text style={styles.label}>State</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={selectedState}
                    onValueChange={handleStateChange}
                    style={styles.picker}
                    dropdownIconColor="#666"
                  >
                    <Picker.Item label="Please Select State" value="" style={styles.placeholderStyle} />
                    {states.map((state) => (
                      <Picker.Item key={state.stateCode} label={state.stateName} value={state.stateCode} />
                    ))}
                  </Picker>
                </View>

                <Text style={styles.label}>District</Text>
                <View style={styles.pickerWrapper}>
                  {isLoadingDistricts ? (
                    <ActivityIndicator style={styles.loader} />
                  ) : (
                    <Picker
                      selectedValue={selectedDistrict}
                      onValueChange={handleDistrictChange}
                      style={styles.picker}
                      dropdownIconColor="#666"
                      enabled={!isLoadingDistricts && districts.length > 0}
                    >
                      <Picker.Item label="Please Select District" value="" style={styles.placeholderStyle} />
                      {districts.map((district, index) => (
                        <Picker.Item key={index} label={district.districtName} value={district.districtCode} />
                      ))}
                    </Picker>
                  )}
                </View>
                {error && <Text style={styles.errorText}>{error}</Text>}

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
                      if (
                        !referenceNo &&
                        !companyName &&
                        !selectedState &&
                        !selectedDistrict &&
                        !selectedBusinessType
                      ) {
                        Alert.alert("Please select State name ")
                        return
                      }

                      if (selectedState && !selectedDistrict) {
                        Alert.alert("Please select a District")
                        return
                      }

                      setCurrentPage(1)
                      await handleSearch(1)
                      toggleModal()
                    }}
                    disabled={isSearching}
                  >
                    <Text style={styles.applyButtonText}>{isSearching ? "Searching..." : "Search"}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            {searchResults && searchResults.paginationListRecords && searchResults.paginationListRecords.length > 0 ? (
              <View>
                {searchResults.paginationListRecords.map((item, index) => (
                  <View key={index} style={styles.recordContainer}>
                    <View style={styles.column}>
                      <View style={styles.recordRow}>
                        <Text style={styles.recordLabel}>Ref ID:/Certificate No.</Text>
                        <Text style={styles.recordValue}>
                          {item.displayRefId}/{item.certificateNo}
                        </Text>
                      </View>
                      <View style={styles.recordRow}>
                        <Text style={styles.recordLabel}>Company Name:/Organization</Text>
                        <Text style={styles.recordValue}>
                          {item.companyName}/{item.fullAddress}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.column}>
                      <View style={styles.recordRow}>
                        <Text style={styles.recordLabel}>Issue Date:</Text>
                        <Text style={styles.recordValue}>{item.issuedDate}</Text>
                      </View>
                      <View style={styles.recordRow}>
                        <Text style={styles.recordLabel}>Expiry Date:</Text>
                        <Text style={styles.recordValue}>{item.expiryDate}</Text>
                      </View>
                      <View style={styles.recordRow}>
                        <Text style={styles.recordLabel}>Status:</Text>
                        <Text style={styles.recordValue}>{item.statusDesc}</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.proceedButton}
                      onPress={() => handleProceed(item.refId, item.certificateNo)}
                    >
                      <Text style={styles.proceedButtonText}>Proceed</Text>
                    </TouchableOpacity>
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
          <Modal visible={isDetailsModalVisible} transparent={true} animationType="slide" onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <ScrollView>
                  <Text style={styles.modalTitle}>Inspection Details</Text>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Registration Number:</Text>
                    <Text style={styles.detailValue}>{certificateNo}</Text>
                  </View>

                  {selectedInspectionDetails &&
                    selectedInspectionDetails.kobDetails &&
                    selectedInspectionDetails.kobDetails.length > 0 && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Business Type:</Text>
                        <Text style={styles.detailValue}>{selectedInspectionDetails.kobDetails[0].kobname}</Text>
                      </View>
                    )}

                  {selectedInspectionDetails &&
                  selectedInspectionDetails.inspectionDetails &&
                  selectedInspectionDetails.inspectionDetails.length > 0 ? (
                    <View>
                      <Text style={styles.sectionTitle}>Inspection Details</Text>
                      {selectedInspectionDetails.inspectionDetails.map((item, index) => (
                        <View key={index} style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Inspection Date:</Text>
                          <Text style={styles.detailValue}>{item.inspectiondate}</Text>
                          <Text style={styles.detailLabel}>Inspection Date:</Text>
                          <Text style={styles.detailValue}>{item.obtainedpercentage}</Text>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <View>
                      <Text style={styles.sectionTitle}>Inspection Details</Text>
                      <Text style={styles.detailValue}>N/A</Text>
                    </View>
                  )}
                </ScrollView>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.AllocateButton} onPress={openAllocateModal}>
                    <Text style={styles.AllocateButtonText}>Allocate</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <Modal visible={isAllocateModalVisible} transparent={true} onRequestClose={closeAllocateModal}>
            <View style={styles.allocateModalContainer}>
              <View style={styles.allocateModalContent}>
                <Text style={styles.allocateModalTitle}>Allocate Inspection</Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Primary Inspector</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={selectedInspector}
                      onValueChange={(itemValue) => {
                        setSelectedInspector(itemValue)
                        setSecondaryInspectors([])
                      }}
                      style={styles.picker}
                    >
                      <Picker.Item label="Select Primary Inspector" value="" />
                      {inspectors.map((inspector, index) => (
                        <Picker.Item key={index} label={inspector.fsoName} value={inspector.fssaiUserId} />
                      ))}
                    </Picker>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Secondary Inspectors</Text>
                  <View style={styles.secondaryInspectorContainer}>
                    <TouchableOpacity
                      onPress={selectedInspector ? toggleSecondaryPicker : undefined}
                      style={[styles.pickerContainer, !selectedInspector && styles.disabledPicker, { flex: 1 }]}
                    >
                      <TextInput
                        style={styles.input}
                        value={
                          !selectedInspector
                            ? "No data available"
                            : secondaryInspectors.length > 0
                              ? secondaryInspectors.map((inspector) => inspector.fsoName).join(", ")
                              : "Select Secondary Inspectors"
                        }
                        editable={false}
                        placeholder="Select Secondary Inspectors"
                      />
                    </TouchableOpacity>
                  </View>

                  {isSecondaryPickerVisible && selectedInspector && (
                    <View style={[styles.pickerContainer, styles.multiSelectPicker]}>
                      <ScrollView style={{ maxHeight: 200 }}>
                        {selectedSecondaryInspectors
                          .filter((inspector) => inspector.fssaiUserId !== selectedInspector)
                          .map((inspector, index) => (
                            <TouchableOpacity
                              key={index}
                              style={[
                                styles.multiSelectItem,
                                secondaryInspectors.some((si) => si.fssaiUserId === inspector.fssaiUserId) &&
                                  styles.multiSelectItemSelected,
                              ]}
                              onPress={() => handleSecondaryInspectorSelection(inspector.fssaiUserId)}
                            >
                              <Text style={styles.multiSelectItemText}>{inspector.fsoName}</Text>
                            </TouchableOpacity>
                          ))}
                      </ScrollView>

                      <TouchableOpacity onPress={() => setIsSecondaryPickerVisible(false)} style={styles.closeIcon}>
                        <X size={20} color="black" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Remarks</Text>
                  <TextInput
                    style={styles.remarksInput}
                    placeholder="Enter remarks"
                    value={remarks}
                    onChangeText={setRemarks}
                    multiline
                  />
                </View>
                <View style={styles.allocateButtonContainer}>
                  <TouchableOpacity style={styles.cancelButton} onPress={closeAllocateModal}>
                    <Text style={styles.buttonTextC}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.createButton} onPress={handleCreateInspection}>
                    <Text style={styles.buttonText}>Create Inspection</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <Modal
            visible={isConfirmModalVisible}
            transparent={true}
            onRequestClose={() => setIsConfirmModalVisible(false)}
            animationType="fade"
          >
            <View style={styles.confirmModalContainer}>
              <Text style={styles.confirmModalTitle}>Confirm Allocation</Text>
              <Text style={styles.confirmModalText}>Are you sure you want to Continue?</Text>
              <View style={styles.confirmButtonContainer}>
                <TouchableOpacity
                  style={[styles.confirmButton, styles.cancelButton]}
                  onPress={() => setIsConfirmModalVisible(false)}
                >
                  <Text style={styles.buttonTextC}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.confirmButton, styles.createButton]}
                  onPress={async () => {
                    setIsConfirmModalVisible(false)

                    try {
                      const selectedInspectorDetails = inspectors.find((i) => i.fssaiUserId === selectedInspector)
                      const createdById1 = loggedInUserId
                      const createdByName = loggedInUser?.name

                      const staticAssignment = {
                        refId: refId,
                        fsoId: selectedInspector,
                        createdBy: userId,
                        updatedBy: userId,
                        inspectionType: "POST",
                        fsoName: selectedInspectorDetails?.fsoName || "",
                        createdByName: createdByName,
                        doRemarks: remarks,
                        officerType: "P",
                      }

                      const dynamicAssignments = secondaryInspectors.map((inspector) => ({
                        refId: refId,
                        fsoId: inspector.fssaiUserId,
                        createdBy: userId,
                        updatedBy: userId,
                        inspectionType: "POST",
                        fsoName: inspector.fsoName,
                        createdByName: createdByName,
                        doRemarks: remarks,
                        officerType: "S",
                      }))

                      const fsoAssignmentSecondaryOfficerRegistration = [staticAssignment, ...dynamicAssignments]

                      // Final Payload
                      const payload = {
                        refId: refId,
                        doRemarks: remarks,
                        inspectionDate: "",
                        displayRefId: displayRefId,
                        fsoId: selectedInspector,
                        statusId: 17,
                        fsoAcknowledgement: true,
                        createdBy: userId,
                        updatedBy: userId,
                        fsoName: selectedInspectorDetails?.fsoName || "",
                        createdByName: createdByName,
                        fsoAssignmentSecondaryOfficerRegistration: fsoAssignmentSecondaryOfficerRegistration,
                        inspectionType: "POST",
                        checkReschedule: false,
                      }

                      console.log("Final payload:", JSON.stringify(payload, null, 2))
                      const result = await createInspection(payload)
                      console.log("Inspection created:", result)
                      closeAllocateModal()
                    } catch (error) {
                      console.error("Error creating inspection:", error)
                      Alert.alert("Error", "Failed to create inspection. Please try again.")
                    }
                  }}
                >
                  <Text style={styles.buttonText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      )}
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
  modalOverlayF: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    width: "100%",
  },
  modalContainer: {
    width: "100%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  detailLabel: {
    fontWeight: "bold",
    width: "40%",
    fontSize: 16,
  },
  detailValue: {
    width: "60%",
    fontSize: 16,
  },
  AllocateButton: {
    backgroundColor: "#007bff",
    padding: 20,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  AllocateButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "90%",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 8,
  },
  input: {
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
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
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  recordValue: {
    fontSize: 16,
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
    top: -140,
    left: 250,
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
  allocateModalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  allocateModalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "100%",
  },
  allocateModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  disabledPicker: {
    opacity: 0.5,
  },
  secondaryInspectorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  multiSelectPicker: {
    position: "absolute",
    top: 70,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 5,
    maxHeight: 200,
    padding: 10,
  },
  multiSelectItem: {
    padding: 10,
  },
  multiSelectItemSelected: {
    backgroundColor: "#e6f7ff",
  },
  multiSelectItemText: {
    fontSize: 16,
  },
  remarksInput: {
    height: 100,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
  },
  allocateButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "transparent",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007bff",
    width: 150,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  createButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    marginLeft: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonTextC: {
    color: "#007bff",
    fontWeight: "bold",
    fontSize: 16,
  },
  confirmModalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  confirmModalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  confirmButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  confirmButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: 100,
  },
})

export default AllocateInspection

