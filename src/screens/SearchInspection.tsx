import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { getInspectionSearchReport } from "../database/Searchapi";


interface InspectionItem {
  displayRefId: string;
  apptype: string;
  inspectionType: string;
  startInspectionDate: string;
  endInspectionDate: string;
  assignmentId: number;
  certificateNo: string | null;
  fsoName: string;
  fsoId: number;
  inspectionId: number;
  statusId: number;
}


interface ApiResponse {
  paginationListRecords: InspectionItem[];
}

const SearchInspection: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inspectionData, setInspectionData] = useState<ApiResponse>({ paginationListRecords: [] });

  
  const fetchInspectionData = async () => {
    setLoading(true);
    setError(null);
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
      };
      const result = await getInspectionSearchReport(payload);
      console.log("Inspection search report:", result);
      if (result && typeof result === "object" && "paginationListRecords" in result) {
        setInspectionData(result);
      } else {
        setError("Invalid data received from the server.");
      }
    } catch (error) {
      console.error("Error fetching inspection data:", error);
      setError("Failed to fetch inspection data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
        <Text style={styles.title}>Inspection Search Results</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={fetchInspectionData}
          disabled={loading}
          accessible={true}
          accessibilityLabel="Fetch Inspection Data Button"
        >
          <Text style={styles.buttonText}>
            {loading ? "Loading..." : "Fetch Inspection Data"}
          </Text>
        </TouchableOpacity>

      
        {loading && <ActivityIndicator size="large" color="#0000ff" />}

        {/* Error Message */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Render Inspection Data */}
        {inspectionData.paginationListRecords?.length ? (
          <View>
            {inspectionData.paginationListRecords.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                <Text>Ref ID: {item.displayRefId}</Text>
                <Text>Assignment ID: {item.assignmentId}</Text>
                <Text>Fso Name: {item.fsoName}</Text>
                <Text>Fso Id: {item.fsoId}</Text>
                <Text>Inspection ID: {item.inspectionId}</Text>
                <Text>Status ID: {item.statusId}</Text>
                <Text>Inspection Start Date: {item.startInspectionDate}</Text>
                <Text>Inspection Type: {item.inspectionType}</Text>
              </View>
            ))}
          </View>
        ) : (
          !loading && <Text style={styles.noDataText}>No inspection data available</Text>
        )}
      </ScrollView>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  scrollView: {
    flex: 1, 
    backgroundColor: '#fff', // Optional: Set a background color
  },
  container: {
    // flexGrow: 1, 
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
    // textAlign:'center'
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    // width:200,
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
  itemContainer: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

export default SearchInspection;