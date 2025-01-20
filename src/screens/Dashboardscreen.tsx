import React, { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  Image,
  StyleSheet,
  RefreshControl,
  Alert,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getAcknowledgedInspectionCount, type InspectionPayload } from "../database/Dashboardapi"

interface InspectionItem {
  title: string
  count: number
  iconName: string
  isOnline: boolean
}

interface AcknowledgedData {
  currentPageNo: number
  totalPages: number
  pageLimit: number
  totalRecords: number
  paginationListRecords: any[]
}

const { width } = Dimensions.get("window")
const cardWidth = (width - 48) / 2

export default function DashboardScreen() {
  const [acknowledgedData, setAcknowledgedData] = useState<AcknowledgedData>({
    currentPageNo: 1,
    totalPages: 0,
    pageLimit: 10,
    totalRecords: 0,
    paginationListRecords: [],
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  const inspectionItems: InspectionItem[] = [
    {
      title: "Acknowledged",
      count: acknowledgedData.totalRecords,
      iconName: "audit_acknowledgement",
      isOnline: true,
    },
  ]

  const fetchloadData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const userId = await AsyncStorage.getItem("userId")
      const accessToken = await AsyncStorage.getItem("accessToken")

      if (!userId || !accessToken) {
        throw new Error("User ID or access token not found")
      }

      const payload: InspectionPayload = {
        token: accessToken,
        userID: Number.parseInt(userId, 10),
        authuserID: "",
        statusID: "17",
        displayRefId: "",
        companyName: "",
        fromDate: `${new Date().getFullYear()}-01-01`,
        toDate: `${new Date().getFullYear()}-12-31`,
        processFlag: true,
        inspectionType: null,
        fsoName: null,
      }

      const data = await getAcknowledgedInspectionCount(payload)
      setAcknowledgedData(data)
      if (data.paginationListRecords.length === 0) {
        setError("No inspection data found for the given period.")
      }
    } catch (error) {
      console.error("Error loading data:", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
      Alert.alert(
        "Error",
        `Failed to load inspection data: ${error instanceof Error ? error.message : "Unknown error"}`,
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken")
        const id = await AsyncStorage.getItem("userId")

        if (token && id) {
          setAccessToken(token)
          setUserId(id)
          fetchloadData()
        } else {
          console.log("No user data found in AsyncStorage")
        }
      } catch (error) {
        console.error("Error fetching data from AsyncStorage:", error)
      }
    }

    fetchData()
  }, [fetchloadData, userId, accessToken])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchloadData().then(() => setRefreshing(false))
  }, [fetchloadData])

  const renderInspectionItem = ({ title, count, iconName, isOnline }: InspectionItem) => (
    <View style={styles.item} key={title}>
      <View style={styles.itemContent}>
        <Image source={require("../assets/img/bg.png")} style={styles.icon} />
        <Text style={styles.count}>{count}</Text>
        <Text style={styles.subtitle}>{title}</Text>
      </View>
      <View style={styles.onlineStatus}>
        <View style={[styles.statusDot, { backgroundColor: isOnline ? "#01DB31" : "#DE9300" }]} />
        <Text style={styles.statusText}>{isOnline ? "Online" : "Offline"}</Text>
      </View>
    </View>
  )

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {error && <Text style={styles.errorText}>{error}</Text>}
        <View style={styles.header}>
          <Image source={require("../assets/img/splash.png")} style={styles.logo} />
          <Text style={styles.headerTitle}>Inspection Dashboard</Text>
        </View>
        <View style={styles.grid}>{inspectionItems.map((item) => renderInspectionItem(item))}</View>
        <Text style={styles.listTitle}>Acknowledged Inspections</Text>
        {acknowledgedData.paginationListRecords.length > 0 ? (
          acknowledgedData.paginationListRecords.map((item) => (
            <View key={`${item.displayRefId || ""}-${item.companyName}`} style={styles.listItem}>
              <Text style={styles.listItemText}>{item.displayRefId || "N/A"}</Text>
              <Text style={styles.listItemText}>{item.companyName || "N/A"}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyListText}>No acknowledged inspections found.</Text>
        )}
        {__DEV__ && (
          <>
            <Text style={styles.debugTitle}>Debug Information:</Text>
            <Text style={styles.debugText}>
              Current Page: {acknowledgedData.currentPageNo}
              {"\n"}
              Total Pages: {acknowledgedData.totalPages}
              {"\n"}
              Page Limit: {acknowledgedData.pageLimit}
              {"\n"}
              Total Records: {acknowledgedData.totalRecords}
              {"\n"}
              Pagination List Records: {JSON.stringify(acknowledgedData.paginationListRecords, null, 2)}
              {"\n"}
            </Text>
          </>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  logo: {
    height: 40,
    width: 40,
    resizeMode: "contain",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
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
    backgroundColor: "#fff",
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
  icon: {
    width: 48,
    height: 48,
    resizeMode: "contain",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  count: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  onlineStatus: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  statusText: {
    fontSize: 12,
    color: "#666",
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 16,
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
  debugTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  debugText: {
    fontSize: 12,
    color: "#666",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
    paddingHorizontal: 16,
  },
})

