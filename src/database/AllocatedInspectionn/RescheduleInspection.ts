import CryptoJS from "crypto-js"
import { BASE_URL } from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Alert } from "react-native"


const SECRET_KEY = "LsiplyG3M1bX7Rg"


interface RescheduleInspectionPayload {
  displayRefId: string
  inspectionDate: string
  refId: number
  doRemarks: string
  fsoId: string
  statusId: number
  fsoAcknowledgement: boolean
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
  }>
  inspectionType: string
  createdBy: string
  updatedBy: string
  checkReschedule: boolean
  roasterId: string | null
}


const encryptData = (data: string): string => {
  const encryptedData = CryptoJS.HmacSHA256(data, SECRET_KEY)
  return CryptoJS.enc.Base64.stringify(encryptedData).toString()
}

export const rescheduleInspection = async (payload: RescheduleInspectionPayload) => {
  try {
    const storedUserId = await AsyncStorage.getItem("userId")
    const accessToken = await AsyncStorage.getItem("accessToken")

    if (!accessToken || !storedUserId) {
      throw new Error("No authentication token or user ID found")
    }

    const xAuthUserId = encryptData(storedUserId)

    const apiUrl = `${BASE_URL}/gateway/officer/inspection/fsoassignmentreg`

    console.log("Final payload:", JSON.stringify(payload, null, 2))

   
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${accessToken}`,
        "X-Auth-User-Id": xAuthUserId,
      },
      body: JSON.stringify(payload),
    })

    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`HTTP error! Status: ${response.status}, Body: ${errorText}`)
      throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`)
    }

    const data = await response.json()
    console.log("Reschedule inspection result:", data)

    if (data.statusCode === "200") {
      console.log("Inspection rescheduled successfully.")
      Alert.alert("Success", "Inspection rescheduled successfully.")
      return data
    } else {
      throw new Error(`Unexpected status code: ${data.statusCode}`)
    }
  } catch (error) {
    console.error("Error in rescheduleInspection:", error)
    Alert.alert("Inspection not rescheduled at this time.")
    throw error
  }
}