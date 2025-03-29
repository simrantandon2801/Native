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
import AllocateInspectionDetailsModal from "./AllocateInspectionDetailsModal"
import { useFocusEffect } from "@react-navigation/native"
const AllocateInspection: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [referenceNo, setReferenceNo] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  
  const [displayrefId1, setdisplayRefId1] = useState("")
  const [loggedInUserId1, setLoggedInUserId1] = useState("")
  const [selectedBusinessType, setSelectedBusinessType] = useState("")
  const [districts, setDistricts] = useState<Array<any>>([])
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false)
  const [districtName, setDistrictName] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [states, setStates] = useState<Array<any>>([])
  const [businessTypes, setBusinessTypes] = useState<Array<any>>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any>(null)
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false)
  const [selectedInspectionDetails, setSelectedInspectionDetails] = useState<AllocateInspectionDetailsResponse | null>(
    null,
  )
  const [refreshing, setRefreshing] = useState(false)
  const [kobId, setKobId] = useState("")
  const [stateCode, setstatecode] = useState("")
  const [certificateNo, setCertificateNo] = useState<string>("")
  const [refId, setRefId] = useState<string>("")
  const [displayRefId, setdisplayRefId] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  // const [Totalpage, setTotalpage] = useState()
  interface AllocateInspectionDetailsResponse {
    refId: string
    certificateNo: string
    kobDetails?: { kobname: string }[]
    inspectionDetails?: { key: string; value: string }[]
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
      setdisplayRefId1(storedDisplayrefID || "")
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
  const handlePageChange = async (newPage: number) => {
    if (newPage >= 1) {
      setCurrentPage(newPage)
      await handleSearch(newPage)
    }
  }

  const handleSearch = async (page: number) => {
    setIsSearching(true)
    setSearchResults([]);
    try {
      const createdBy = loggedInUserId1
      const payload = {
        fssaiUserId: createdBy,
        statusId: 5,
        licenseCategoryId: 1,
        displayRefId: displayRefId,
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
      searchResults?.paginationListRecords?.length >= itemsPerPage * currentPage

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
                  if (!selectedState) {
                    Alert.alert("Please select State")
                    return
                  } else if (!selectedDistrict) {
                    Alert.alert("Please select District")
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
                    <Text style={styles.recordValue}>{item.displayRefId}/{item.certificateNo}</Text>
                  </View>
                  {/* <View style={styles.recordRow}>
                    <Text style={styles.recordLabel}>Premises Address:</Text>
                    <Text style={styles.recordValue}>{item.fullAddress}</Text>
                  </View> */}
                  <View style={styles.recordRow}>
                    <Text style={styles.recordLabel}>Company Name:/Organization</Text>
                    <Text style={styles.recordValue}>{item.companyName}/{item.fullAddress}</Text>
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
                  onPress={async () => {
                    try {
                    

                      const result = await getAllocateInspectionDetails(item.refId, item.CertificateNo)
                      console.log(result)
                      setSelectedInspectionDetails(result)
                     
                      setIsDetailsModalVisible(true)
                    } catch (error) {
                      console.error("Error fetching Allocate Inspection Details:", error)
                    }
                  }}
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
      <AllocateInspectionDetailsModal
        isVisible={isDetailsModalVisible}
        onClose={() => setIsDetailsModalVisible(false)}
        data={selectedInspectionDetails || {}}
        refId={refId}
        certificateNo={certificateNo}
        displayRefId={displayRefId}
      />
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

export default AllocateInspection

