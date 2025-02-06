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
} from "react-native"
import { Picker } from "@react-native-picker/picker"
import { Filter } from "lucide-react-native"
import { getDistrictList,searchApplications } from "../database/Districtapi"
import { getStateList, getBusinessTypes } from "../database/Statebusinessapi"


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
                      displayRefId: referenceNo,
                      companyName: companyName,
                      district: selectedDistrict,
                      subDivision: "109",
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
      {searchResults && (
        <View style={styles.searchResults}>
          <Text style={styles.searchResultsTitle}>Search Results</Text>
        
          <Text>{JSON.stringify(searchResults)}</Text>
        </View>
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
  errorText: {},
  applyButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  loader: {},
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
})

export default AllocateInspection

