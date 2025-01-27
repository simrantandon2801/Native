import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, ScrollView, Alert,TouchableOpacity } from "react-native"
import { getOngoingInspectionCount } from "../database/Dashboardapi"
import { useNavigation } from "@react-navigation/native"
interface InspectionItem {
  title: string
  count: number
  isOnline: boolean
}

interface OngoingInspectionData {
  currentPageNo: number
  totalPages: number
  pageLimit: number
  totalRecords: number
  paginationListRecords: any[]
}

const { width } = Dimensions.get("window")
const cardWidth = (width - 80) / 2

const OngoingInspection: React.FC = () => {
  const navigation=useNavigation();
  const [ongoingInspectionData, setOngoingInspectionData] = useState<OngoingInspectionData>({
    currentPageNo: 1,
    totalPages: 0,
    pageLimit: 10,
    totalRecords: 0,
    paginationListRecords: [],
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
 const [showOngoing, setShowOngoing] = useState(false)
  const inspectionItems: InspectionItem[] = [
    {
      title: "Ongoing",
      count: ongoingInspectionData.totalRecords,
      isOnline: true,
    },
  ]

  const fetchOngoingInspections = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const payload: any = {
        statusId: "20", // Assuming 18 is the status ID for Ongoing
        userId: "3816881804355836",
        displayRefId: "",
        companyName: "",
        fromDate: "",
        toDate: "",
        processFlag: true,
        inspectionType: null,
        fsoName: null,
        kobId: null,
      }

      const result = await getOngoingInspectionCount(payload)
      setOngoingInspectionData(result)
    } catch (error) {
      console.error("Error loading data:", error)
      setError("Failed to load data. Please try again.")
      Alert.alert("Error", "Failed to load data. Please check your internet connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOngoingInspections()
  }, [])

  const renderInspectionItem = ({ title, isOnline }: InspectionItem) => (
     <TouchableOpacity style={styles.item} key={title} onPress={() => navigation.navigate("Ongoinglist" as never)}>
         <View style={styles.itemContent}>
           <Text style={styles.title}>Inspection Ongoing</Text>
         </View>
       </TouchableOpacity>
  )

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
   <ScrollView contentContainerStyle={styles.contentContainer}>
  {error && <Text style={styles.errorText}>{error}</Text>}
  <View>
    {/* <Text style={styles.headerTitle}>Ongoing Inspection Dashboard</Text> */}
  </View>
  <View style={styles.grid}>{inspectionItems.map((item) => renderInspectionItem(item))}</View>
  {/* {showOngoing && (
    <>
      <Text style={styles.listTitle}>Ongoing Inspections</Text>
      {ongoingInspectionData.paginationListRecords.length > 0 ? (
        ongoingInspectionData.paginationListRecords.map((item) => (
          <View key={`${item.displayRefId || ""}-${item.companyName}`} style={styles.listItem}>
            <Text style={styles.listItemText}>{item.displayRefId || "N/A"}</Text>
            <Text style={styles.listItemText}>{item.companyName || "N/A"}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.emptyListText}>No ongoing inspections found.</Text>
      )}
    </>
  )} */}
</ScrollView>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    paddingVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    textAlign: "center",
    color: "#000",
    fontFamily: "Outfit",
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  item: {
    width: cardWidth,
    height: cardWidth,
    borderRadius: 12,
    backgroundColor: "#ff9933", // Changed color to represent ongoing status
    marginBottom: 16,
    padding: 16,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemContent: {
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 50,
    color: "#fff",
    fontFamily: "Outfit",
  },
  listTitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 16,
    fontFamily: "Outfit",
  },
  listItem: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  listItemText: {
    fontSize: 14,
    color: "#333",
  },
  emptyListText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
    paddingHorizontal: 16,
  },
})

export default OngoingInspection

