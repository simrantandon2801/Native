import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, ScrollView, Alert } from "react-native"
import { getAcceptedInspectionAttachmentCount,  } from "../database/Dashboardapi"


interface InspectionAttachmentItem {
  title: string
  count: number
  isOnline: boolean
}

interface AcceptedAttachmentData {
  currentPageNo: number
  totalPages: number
  pageLimit: number
  totalRecords: number
  paginationListRecords: any[]
}

const { width } = Dimensions.get("window")
const cardWidth = (width - 48) / 2

const Accepted: React.FC = () => {
  const [acceptedAttachmentData, setAcceptedAttachmentData] = useState<AcceptedAttachmentData>({
    currentPageNo: 1,
    totalPages: 0,
    pageLimit: 10,
    totalRecords: 0,
    paginationListRecords: [],
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const inspectionAttachmentItems: InspectionAttachmentItem[] = [
    {
      title: "Accepted",
      count: acceptedAttachmentData.totalRecords,
      isOnline: true,
    },
  ]

  const fetchAcceptedAttachments = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const payload: any = {
        statusId: "18", // Assuming 18 is the status ID for Accepted
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

      const result = await getAcceptedInspectionAttachmentCount(payload)
      setAcceptedAttachmentData(result)
    } catch (error) {
      console.error("Error loading data:", error)
      setError("Failed to load data. Please try again.")
      Alert.alert("Error", "Failed to load data. Please check your internet connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAcceptedAttachments()
  }, [])

  const renderInspectionAttachmentItem = ({ title, isOnline }: InspectionAttachmentItem) => (
    <View style={styles.item} key={title}>
      <View style={styles.itemContent}>
        <Text style={styles.title}>Inspection Attachment</Text>
      </View>
    </View>
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
          <Text style={styles.headerTitle}>Inspection Attachment Dashboard</Text>
        </View>
        <View style={styles.grid}>{inspectionAttachmentItems.map((item) => renderInspectionAttachmentItem(item))}</View>
        <Text style={styles.listTitle}>Accepted Inspection Attachments</Text>

        {acceptedAttachmentData.paginationListRecords.length > 0 ? (
          acceptedAttachmentData.paginationListRecords.map((item) => (
            <View key={`${item.displayRefId || ""}-${item.companyName}`} style={styles.listItem}>
              <Text style={styles.listItemText}>{item.displayRefId || "N/A"}</Text>
              <Text style={styles.listItemText}>{item.companyName || "N/A"}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyListText}>No accepted inspection attachments found.</Text>
        )}
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
    backgroundColor: "#8cbed6",
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

export default Accepted

