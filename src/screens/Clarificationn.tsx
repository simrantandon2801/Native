import React, { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native"
import { getClarificationFromOngoingInspection, getClarificationFromScrutinizeInspection } from "../database/Clarificationapi" // Import API functions

interface ClarificationData {
  currentPageNo: number
  totalPages: number
  pageLimit: number
  totalRecords: number
  paginationListRecords: any[] // Adjust the data structure as needed
}

const Clarificationn: React.FC = () => {
  const [activeButton, setActiveButton] = useState<number>(1)
  const [clarificationData, setClarificationData] = useState<ClarificationData | null>(null)

  const fetchClarificationData = async (buttonIndex: number) => {
    const payload = {
      userId: "3816881804355836",  // Replace with actual userId if needed
      statusId: buttonIndex === 1 ? 41 : 50,
      inspectionType: "",
      fromDate: "",
      toDate: "",
      companyName: "",
      licenseNo: "",
      kobId: "",
    }

    try {
      let data;
    
      if (buttonIndex === 1) {
        data = await getClarificationFromOngoingInspection(payload)
        data = await getClarificationFromScrutinizeInspection(payload)
      }
      setClarificationData(data) 
    } catch (error) {
      console.error("Error fetching clarification data:", error)
      setClarificationData(null) // Reset the state if error occurs
    }
  }

  const handlePress = (buttonIndex: number) => {
    setActiveButton(buttonIndex) 
    fetchClarificationData(buttonIndex) 
  }

  useEffect(() => {
    fetchClarificationData(activeButton) 
  }, [activeButton])

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, activeButton === 1 ? styles.activeButton : styles.inactiveButton]}
          onPress={() => handlePress(1)} 
        >
          <Text style={[styles.buttonText, activeButton === 1 ? styles.activeButtonText : styles.inactiveButtonText]}>
            Clarification from ongoing inspection bin 1
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, activeButton === 2 ? styles.activeButton : styles.inactiveButton]}
          onPress={() => handlePress(2)}
        >
          <Text style={[styles.buttonText, activeButton === 2 ? styles.activeButtonText : styles.inactiveButtonText]}>
            Clarification from scrutinize inspection bin
          </Text>
        </TouchableOpacity>
      </View>

  
      {clarificationData && clarificationData.paginationListRecords.length > 0 ? (
        <View>
          <Text>Data available</Text>
          {/* Render the fetched data */}
          {clarificationData.paginationListRecords.map((record, index) => (
            <View key={index} style={styles.recordContainer}>
              <Text>{JSON.stringify(record)}</Text> {/* Render records here */}
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No record found</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#f5f5f5",
    marginTop: 20,
    flex: 1,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    flexWrap: "nowrap",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    width: Dimensions.get("window").width * 0.45,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderStyle: "solid",
  },
  activeButton: {
    backgroundColor: "#0056b3",
    borderColor: "#0056b3",
  },
  inactiveButton: {
    backgroundColor: "white",
    borderColor: "#0056b3",
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  activeButtonText: {
    color: "white",
  },
  inactiveButtonText: {
    color: "#0056b3",
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
  },
  recordContainer: {
    marginBottom: 10,
  }
})

export default Clarificationn
