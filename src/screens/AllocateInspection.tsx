'use client';

import type React from "react"
import { useState, useEffect } from "react"
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
} from "react-native"
import { Picker } from "@react-native-picker/picker"
import { Filter } from "lucide-react-native"
import { getDistrictList, searchApplications } from "../database/Districtapi"
import { getStateList, getBusinessTypes } from "../database/Statebusinessapi"
import { getAllocateInspectionDetails } from "../database/ProceedAllocateapi"
import AllocateInspectionDetailsModal from "./AllocateInspectionDetailsModal"

const AllocateInspection: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [referenceNo, setReferenceNo] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [selectedBusinessType, setSelectedBusinessType] = useState("")
  const [districts, setDistricts] = useState<Array<any>>([])
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [states, setStates] = useState<Array<any>>([])
  const [businessTypes, setBusinessTypes] = useState<Array<any>>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any>(null)
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false)
  const [selectedInspectionDetails, setSelectedInspectionDetails] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stateData = await getStateList()
        setStates(stateData)
        const businessTypeData = await getBusinessTypes()
        setBusinessTypes(businessTypeData)
      } catch (err) {
        console.error("Error fetching initial data:", err)
        setError("Failed to fetch initial data")
      }
    }
    fetchData()
  }, [])

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible)
  }

  const handleStateChange = async (stateCode: string) => {
    setSelectedState(stateCode)
    setSelectedDistrict("")
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

  const handleReset = () => {
    setReferenceNo("")
    setCompanyName("")
    setSelectedState("")
    setSelectedDistrict("")
    setSelectedBusinessType("")
    setDistricts([])
    setError(null)
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
            <Text style={styles.modalTitle}>Filter Inspection</Text>

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
                  onValueChange={setSelectedDistrict}
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
                  setIsSearching(true)
                  try {
                    const payload = {
                      fssaiUserId: "10000000016",
                      statusId: 5,
                      licenseCategoryId: 1,
                      displayRefId: "",
                      companyName: "",
                      district: "",
                      subDivision: "257",
                      fromDate: null,
                      toDate: null,
                      categoryId: "",
                      kobId: selectedBusinessType,
                    }
                    const results = await searchApplications(payload)
                    setSearchResults(results)
                    toggleModal()
                  } catch (error) {
                    console.error("Error searching applications:", error)
                    setError("Failed to search applications")
                  } finally {
                    setIsSearching(false)
                  }
                }}
                disabled={isSearching}
              >
                <Text style={styles.applyButtonText}>{isSearching ? "Searching..." : "Search"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <ScrollView>
        {searchResults && searchResults.paginationListRecords ? (
          searchResults.paginationListRecords.map((item, index) => (
            <View key={index} style={styles.recordContainer}>
              <View style={styles.column}>
                <View style={styles.recordRow}>
                  <Text style={styles.recordLabel}>Ref ID:</Text>
                  <Text style={styles.recordValue}>{item.displayRefId}</Text>
                </View>
                <View style={styles.recordRow}>
                  <Text style={styles.recordLabel}>Premises Address:</Text>
                  <Text style={styles.recordValue}>{item.addressPremises}</Text>
                </View>
                <View style={styles.recordRow}>
                  <Text style={styles.recordLabel}>Company Name:</Text>
                  <Text style={styles.recordValue}>{item.companyName}</Text>
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
                    const result = await getAllocateInspectionDetails(item.refId, item.certificateNo)
                    console.log("Allocate Inspection Details Result:", result)
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
          ))
        ) : (
          <Text style={[styles.noRecordsText, { textAlign: "center", marginTop: 20 }]}>No records found</Text>
        )}
      </ScrollView>
      <AllocateInspectionDetailsModal
        isVisible={isDetailsModalVisible}
        onClose={() => setIsDetailsModalVisible(false)}
        data={selectedInspectionDetails}
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
})

export default AllocateInspection
