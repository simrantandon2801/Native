import CryptoJS from "crypto-js"
import { BASE_URL } from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Alert } from "react-native"

// Secret key for encryption
const SECRET_KEY = "LsiplyG3M1bX7Rg"

// Updated interface for reassigning an inspection
interface ReassignInspectionPayload {
  assignmentId: number
  refId: number
  fsoId: string
  reassignmentRemarks: string
  fsoName: string
  createdByName: string
  fsoAssignmentSecondaryOfficerRegistration: Array<{
    refId: number
    fsoId: string
    createdBy: string
    updatedBy: string
    inspectionType: string
    fsoName: string
    createdByName: string
    doRemarks: string
    officerType: string
    assignmentId: number
  }>
}

// Encryption function
const encryptData = (data: string): string => {
  const encryptedData = CryptoJS.HmacSHA256(data, SECRET_KEY)
  return CryptoJS.enc.Base64.stringify(encryptedData).toString()
}

export const reassignInspection = async (payload: ReassignInspectionPayload) => {
  try {
    const storedUserId = await AsyncStorage.getItem("userId")
    const accessToken = await AsyncStorage.getItem("accessToken")

    if (!accessToken || !storedUserId) {
      throw new Error("No authentication token or user ID found")
    }

    const xAuthUserId = encryptData(storedUserId)

    const apiUrl = `${BASE_URL}/gateway/officer/inspection/reassignmentinspectionreg`

    console.log("Final payload:", JSON.stringify(payload, null, 2))

    // Make the POST request to the API
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${accessToken}`,
        "X-Auth-User-Id": xAuthUserId,
      },
      body: JSON.stringify(payload),
    })

    // Handle non-OK HTTP responses
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`HTTP error! Status: ${response.status}, Body: ${errorText}`)
      throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`)
    }

    const data = await response.json()
    console.log("Reassign inspection result:", data)

    if (data.statusCode === "200") {
      console.log("Inspection reassigned successfully.")
      Alert.alert("Success", "Inspection reassigned successfully.")
      return data
    } else {
      throw new Error(`Unexpected status code: ${data.statusCode}`)
    }
  } catch (error) {
    console.error("Error in re-assignInspection:", error)
    Alert.alert("Inspection not reassign this time.")
    throw error
  }
}

