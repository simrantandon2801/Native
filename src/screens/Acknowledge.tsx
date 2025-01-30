import type React from "react"
import { useState, useEffect } from "react"
import "react-native-get-random-values"
import { useNavigation } from "@react-navigation/native"
// import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { getAcknowledgedInspectionCount, type InspectionResponse, encryptionPassword } from "../database/Dashboardapi"

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

type RootStackParamList = {
  Acknowledge: undefined
  Acknowledgelist: undefined
}

// type AcknowledgedListNavigationProp = StackNavigationProp<RootStackParamList, "Acknowledgelist">

// Use typed navigation

const { width } = Dimensions.get("window")
const cardWidth = (width - 80) / 2

const Acknowledge: React.FC = () => {
//   const navigation = useNavigation<AcknowledgedListNavigationProp>()
 const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

  const [acknowledgedData, setAcknowledgedData] = useState<AcknowledgedData>({
    currentPageNo: 1,
    totalPages: 0,
    pageLimit: 10,
    totalRecords: 0,
    paginationListRecords: [],
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  // Remove this line
  // const [showAcknowledged, setShowAcknowledged] = useState(false)

  const inspectionItems: InspectionItem[] = [
    {
      title: "Acknowledged",
      count: acknowledgedData.totalRecords,
      iconName: "audit_acknowledgement",
      isOnline: true,
    },
  ]

  const fetchAcknowledgement = async () => {
    setIsLoading(true)
    setError(null)
    try {
      /*      const storedUserId = await AsyncStorage.getItem("userId")
      const storedAccessToken = await AsyncStorage.getItem("accessToken")

      if (!storedUserId || !storedAccessToken) {
        throw new Error("User ID or Access Token not found")
      }

      const xAuthUserId = 'xDjjD+dlhNj/5khvdJ1VIhWQLOZXLKvBB/aWhJoD3Z8=';
      const encryptedUserId = (storedUserId);

      setUserId(encryptedUserId)
      setAccessToken(storedAccessToken) */

      const payload: any = {
        statusId: "17",
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

      const result = await getAcknowledgedInspectionCount(payload)
      setAcknowledgedData(result)
    } catch (error) {
      console.error("Error loading data:", error)
      setError("Failed to load data. Please try again.")
      Alert.alert("Error", "Failed to load data. Please check your internet connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAcknowledgement()
  }, [])

  const renderInspectionItem = ({ title, isOnline }: InspectionItem) => (
    <TouchableOpacity
      style={styles.item}
      key={title}
      onPress={() => navigation.navigate("Acknowledgelist" as never)}
    >
      <View style={styles.itemContent}>
        <Text style={styles.title}>Inspection Acknowledgment</Text>
      </View>
    </TouchableOpacity>
  );

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
        <View style={styles.header}>
          {/* <Image source={require("../assets/img/Board.png")} style={styles.logo} /> */}
          {/* <Text style={styles.headerTitle}>Inspection Dashboard</Text> */}
        </View>

        <View style={styles.grid}>{inspectionItems.map((item) => renderInspectionItem(item))}</View>
       
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
    // flexDirection: "row",
    alignItems: "center",
    // paddingHorizontal: 16,
    // marginBottom: 20,
  },
  logo: {
    height: 30,
    width: 30,
    resizeMode: "contain",
    marginRight: 12,
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
    // alignItems:'center',
    justifyContent:'center',
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
  title: {
    fontSize: 16,
    textAlign: "center",
    // alignItems:'center',
    // justifyContent:'center',
    marginTop: 40,
    color: "#fff",
    fontFamily: "Outfit",
  },
})

export default Acknowledge

