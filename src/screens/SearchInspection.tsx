import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList } from "react-native"
import { getInspectionSearchReport } from "../database/Searchapi"

interface InspectionItem {
  displayRefId: string
  apptype: string
  inspectionType: string
  startInspectionDate: string
  endInspectionDate: string
  assignmentId: number
  certificateNo: string | null
  fsoId: number
  inspectionId: number
  statusId: number
}

const SearchInspection: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [inspectionData, setInspectionData] = useState<InspectionItem[]>([])

  const fetchInspectionData = async () => {
    setLoading(true)
    setError(null)
    try {
      const payload = {
        refId: "",
        licenseNo: "",
        txtCompliance: "",
        kobId: "",
        fromDate: "",
        toDate: "",
        fsoId: "3816881804355836",
        inspectionType: "",
        licenseCategoryId: 1,
        processFlag: false,
        groupId: "",
        companyName: "",
        riskType: "",
        categoryId: "",
        fsoName: "",
      }

      const result = await getInspectionSearchReport(payload)
      console.log("Inspection search report:", result)

      // Assuming the API returns an array of inspection items directly
      setInspectionData(result || [])
    } catch (error) {
      console.error("Error fetching inspection data:", error)
      setError("Failed to fetch inspection data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const renderInspectionItem = ({ item }: { item: InspectionItem }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>Ref ID: {item.displayRefId}</Text>
      <Text>
        Type: {item.apptype} - {item.inspectionType}
      </Text>
      <Text>Start: {item.startInspectionDate}</Text>
      <Text>End: {item.endInspectionDate}</Text>
      <Text>Assignment ID: {item.assignmentId}</Text>
      <Text>Certificate: {item.certificateNo || "N/A"}</Text>
      <Text>Inspection ID: {item.inspectionId}</Text>
      <Text>Status ID: {item.statusId}</Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inspection Search Results</Text>
      <TouchableOpacity style={styles.button} onPress={fetchInspectionData} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Loading..." : "Fetch Inspection Data"}</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {inspectionData.length > 0 ? (
        <FlatList
          data={inspectionData}
          renderItem={renderInspectionItem}
          keyExtractor={(item) => item.inspectionId.toString()}
          style={styles.list}
        />
      ) : (
        <Text style={styles.noDataText}>No inspection data available</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 16,
    fontFamily:'Outfit',
    fontWeight:700,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
})

export default SearchInspection

