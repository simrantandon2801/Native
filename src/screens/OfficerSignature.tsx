"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Modal, Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRoute, type RouteProp, useNavigation } from "@react-navigation/native"
import { getSecEsignDetails, updateSendInvitation } from "../database/OfficerSignatureapi"

interface PreviewDocumentsProps {
  visible: boolean
  onClose: () => void
  sectionId: number | null
  sectionName: string
  inspectionId: string
  assignmentId: any
  refId: any
}

const OfficerSignature: React.FC = () => {
  const route = useRoute<RouteProp<Record<string, PreviewDocumentsProps>>>()
  const navigation = useNavigation()
  const { inspectionId, assignmentId } = route.params

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [fetchedOfficerData, setFetchedOfficerData] = useState<any>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [invitationSent, setinvitationSent] = useState(false)

  useEffect(() => {
    const fetchDataFromAsyncStorage = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId")
        setUserId(storedUserId)
        console.log("Retrieved User ID:", storedUserId)
      } catch (err) {
        console.error("Error fetching data from AsyncStorage:", err)
        setError("Failed to load data from storage.")
      }
    }
    fetchDataFromAsyncStorage()
  }, [inspectionId, assignmentId])

  const fetchEsignOfficer = async () => {
    try {
      setIsLoading(true)
      const data = await getSecEsignDetails(Number.parseInt(assignmentId))
      console.log("Officer signature details fetched:", data)
      setFetchedOfficerData(data)
    } catch (err) {
      console.error("Error fetching officer signature details:", err)
      setError("Failed to load officer signature details.")
    } finally {
      setIsLoading(false)
    }
  }

  const openModal = () => {
    setIsModalVisible(true)
    fetchEsignOfficer()
  }

  const closeModal = () => {
    setIsModalVisible(false)
  }
  const handleSendForSignature = async (secAssignmentId: number, email: string) => {
    try {
      if (!email) {
        console.error("Email is missing.")
        Alert.alert("Error", "Email is missing. Please provide a valid email.")
        return
      }

      const response = await updateSendInvitation(secAssignmentId, email)
      console.log("sdgsuydgsahshek", response)

      if (response.statusCode === "200") {
        try {
          const esignDetails = await getSecEsignDetails(assignmentId)
          // Update the state with the new data to refresh the UI
          setFetchedOfficerData(esignDetails)
          console.log("Fetched e-sign details:", esignDetails)
        } catch (err) {
          console.log("Error fetching updated data:", err)
        }
      }

      console.log("Invitation sent successfully:", response)
      Alert.alert("Success", "Invitation sent successfully!")
    } catch (error) {
      console.error("Failed to send invitation:", error)
      Alert.alert("Error", "Failed to send invitation. Please try again.")
    }
  }

  const handleSignatureHere = () => {}
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.addButton} onPress={openModal}>
          <Text style={styles.addButtonText}>Add Applicant</Text>
        </TouchableOpacity>

        <Modal visible={isModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>

              {isLoading ? (
                <Text>Loading...</Text>
              ) : error ? (
                <Text>Error: {error}</Text>
              ) : fetchedOfficerData && fetchedOfficerData.length > 0 ? (
                <ScrollView>
                  <Text style={styles.modalTitle}>E-Sign Officer List</Text>
                  {fetchedOfficerData.map((officer: any, index: number) => (
                    <View key={index} style={styles.officerContainer}>
                      <Text>Officer Name: {officer.fsoName || "N/A"}</Text>
                      <Text>Email: {officer.email || "N/A"}</Text>
                      <Text>Signature: {officer.officerType || "N/A"}</Text>
                      <Text>Invited: {officer.isInvited || "N/A"}</Text>
                      <Text>Is E-signed: {officer.isSigned || "N/A"}</Text>
                      {officer.officerType === "S" &&
                        (officer.isInvited ? (
                          <Text style={styles.sentText}>Sent</Text>
                        ) : (
                          <TouchableOpacity
                            onPress={() => handleSendForSignature(officer.secAssignmentId, officer.email)}
                          >
                            <Text style={styles.linkText}>Send for Signature</Text>
                          </TouchableOpacity>
                        ))}

                      {officer.officerType === "P" && (
                        <TouchableOpacity style={styles.buttonContainer} onPress={() => handleSignatureHere()}>
                          <Text style={styles.buttonText}>Signature here</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <Text>No data available</Text>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  buttonContainer: {
    backgroundColor: "#007bff",
    padding: 8,
    borderRadius: 5,
    width: 140,
    marginTop: 5,
    alignItems: "center",
  },
  sentText: {},
  buttonText: {
    color: "white",
    fontWeight: "500",
  },
  officerContainer: {
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addButton: {
    backgroundColor: "#0066cc",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  linkText: {
    color: "blue",
    // textDecorationLine: 'underline',
    marginTop: 5,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 5,
  },
  closeButtonText: {
    color: "#0066cc",
    fontWeight: "bold",
    fontSize: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
})

export default OfficerSignature

