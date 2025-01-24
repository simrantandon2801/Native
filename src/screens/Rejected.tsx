import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Alert,
  RefreshControl,
  TouchableOpacity
} from "react-native"
import { getRejectedInspectionAttachmentCount } from "../database/Dashboardapi"

// Types
interface RejectedAttachmentData {
  currentPageNo: number
  totalPages: number
  pageLimit: number
  totalRecords: number
  paginationListRecords: Array<{
    displayRefId: string
    companyName: string
    date?: string
    status?: string
  }>
}

const { width } = Dimensions.get("window")

const RejectedInspections: React.FC = () => {
  // State
  const [data, setData] = useState<RejectedAttachmentData>({
    currentPageNo: 1,
    totalPages: 0,
    pageLimit: 10,
    totalRecords: 0,
    paginationListRecords: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch data
  const fetchData = async (showLoader = true) => {
    if (showLoader) setIsLoading(true)
    setError(null)

    try {
      const payload = {
        statusId: "18",
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

      const result = await getRejectedInspectionAttachmentCount(payload)
      setData(result)
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Failed to load inspections. Please try again.")
      Alert.alert(
        "Error",
        "Unable to load inspections. Please check your connection."
      )
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchData()
  }, [])

  // Pull to refresh
  const onRefresh = () => {
    setIsRefreshing(true)
    fetchData(false)
  }

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#dc3545" />
        <Text style={styles.loadingText}>Loading inspections...</Text>
      </View>
    )
  }

  // Error state
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => fetchData()}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rejected Inspections</Text>
        {/* <View style={styles.statsCard}> */}
          {/* <Text style={styles.statsNumber}>{data.totalRecords}</Text> */}
          <Text style={styles.statsLabel}>Total Rejected</Text>
        {/* </View> */}
      </View>

      {/* List */}
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Recent Rejections</Text>
        
        {data.paginationListRecords.length > 0 ? (
          data.paginationListRecords.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <View>
                <Text style={styles.refId}>
                  Ref: {item.displayRefId || 'N/A'}
                </Text>
                <Text style={styles.companyName}>
                  {item.companyName || 'Unknown Company'}
                </Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Rejected</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No rejected inspections found
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
  fontFamily:'Outfit',
    color: "#212529",
    marginBottom: 20,
    textAlign: "center",
  },
  statsCard: {
    backgroundColor: "#dc3545",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  statsNumber: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
  },
  statsLabel: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
    marginTop: 4,
  },
  listContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 15,
  },
  listItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  refId: {
    fontSize: 15,
    fontWeight: "500",
    color: "#212529",
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    color: "#6c757d",
  },
  statusBadge: {
    backgroundColor: "#dc3545",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  emptyStateText: {
    color: "#6c757d",
    fontSize: 16,
  },
  loadingText: {
    marginTop: 12,
    color: "#6c757d",
    fontSize: 16,
  },
  errorText: {
    color: "#dc3545",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#dc3545",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
})

export default RejectedInspections