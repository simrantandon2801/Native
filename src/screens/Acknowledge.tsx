import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity,Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";

interface InspectionItem {
  title: string;
  count: number;
  iconName: string;
  isOnline: boolean;
}

interface AcknowledgedData {
  currentPageNo: number;
  totalPages: number;
  pageLimit: number;
  totalRecords: number;
  paginationListRecords: any[];
}

type RootStackParamList = {
  Acknowledge: undefined;
  Acknowledgelist: undefined;
};

const { width } = Dimensions.get("window");
const cardWidth = (width - 80) / 2;

const Acknowledge: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [acknowledgedData, setAcknowledgedData] = useState<AcknowledgedData>({
    currentPageNo: 1,
    totalPages: 0,
    pageLimit: 10,
    totalRecords: 0,
    paginationListRecords: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // States to store data retrieved from AsyncStorage
  // const [userId, setUserId] = useState<string | null>(null);
  // const [displayRefId, setDisplayRefId] = useState<string | null>(null);
  // const [companyName, setCompanyName] = useState<string | null>(null);
  // const [inspectionType, setInspectionType] = useState<string | null>(null);


  // useEffect(() => {
  //   const fetchDataFromAsyncStorage = async () => {
  //     try {
  //       setIsLoading(true);
  //       setError(null);

    
  //       const storedUserId = await AsyncStorage.getItem("userId");
  //       const storedDisplayRefId = await AsyncStorage.getItem("displayRefId");
  //       const storedCompanyName = await AsyncStorage.getItem("companyName");
  //       const storedInspectionType = await AsyncStorage.getItem("inspectionType");

      
  //       setUserId(storedUserId);
  //       setDisplayRefId(storedDisplayRefId);
  //       setCompanyName(storedCompanyName);
  //       setInspectionType(storedInspectionType);

  //       console.log("Retrieved Data:", {
  //         userId: storedUserId,
  //         displayRefId: storedDisplayRefId,
  //         companyName: storedCompanyName,
  //         inspectionType: storedInspectionType,
  //       });
  //     } catch (err) {
  //       console.error("Error fetching data from AsyncStorage:", err);
  //       setError("Failed to load data from storage.");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchDataFromAsyncStorage();
  // }, []);

  const inspectionItems: InspectionItem[] = [
    {
      title: "Acknowledged",
      count: acknowledgedData.totalRecords,
      iconName: "audit_acknowledgement",
      isOnline: true,
    },
  ];

  const renderInspectionItem = ({ title, isOnline }: InspectionItem) => (
    <TouchableOpacity
      style={styles.item}
      key={title}
      onPress={() => navigation.navigate("Inspection Acknowledgement" as never)}
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
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <View style={styles.header}>
          {/* Header content */}
        </View>
        <View style={styles.grid}>
          {inspectionItems.map((item) => renderInspectionItem(item))}
        </View>

        {/* Display Retrieved Data for Debugging */}
        {/* <View style={styles.debugSection}>
          <Text style={styles.debugText}>User ID: {userId || "N/A"}</Text>
          <Text style={styles.debugText}>Company Name: {companyName || "N/A"}</Text>
          <Text style={styles.debugText}>Inspection Type: {inspectionType || "N/A"}</Text>
          <Text style={styles.debugText}>Display Ref ID: {displayRefId || "N/A"}</Text>
        </View> */}
      </ScrollView>
    </View>
  );
};

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
    alignItems: "center",
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
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
    color: "#fff",
    fontFamily: "Outfit",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
    paddingHorizontal: 16,
  },
  debugSection: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  debugText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
});

export default Acknowledge;