import AsyncStorage from "@react-native-async-storage/async-storage"
import CryptoJS from "crypto-js"
import { BASE_URL } from "@env"
import "react-native-get-random-values"

const SECRET_KEY = "LsiplyG3M1bX7Rg"

export interface InspectionResponse {
  statusId: string
  userId: string
  processFlag: boolean
  accessToken: string
  xAuthUserId: string
}

interface PostPayload {
  [key: string]: any
}

export const encryptData = (data: string): string => {
  const encryptedData = CryptoJS.HmacSHA256(data, SECRET_KEY)
  return CryptoJS.enc.Base64.stringify(encryptedData).toString()
}

export const encryptionPassword = (data: string) => {
  const hmac = CryptoJS.HmacSHA256(data, SECRET_KEY)
  return CryptoJS.enc.Base64.stringify(hmac)
}

export const getSecondaryOfficerEsignDetails = async (assignmentId: string): Promise<any> => {
  try {
    const storedUserId = await AsyncStorage.getItem("userId")
    const accessToken = await AsyncStorage.getItem("accessToken")
    const xAuthUserId = encryptData(storedUserId || "")

    const apiUrl = `${BASE_URL}/gateway/officer/inspection/getSecondaryOfficerEsignDetails/${assignmentId}`

    if (!accessToken || !storedUserId) {
      throw new Error("No authentication token or user ID found")
    }

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${accessToken}`,
        "X-Auth-User-Id": xAuthUserId,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`HTTP error! Status: ${response.status}, Body: ${errorText}`)
      throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`)
    }

    const data = await response.json()
    console.log("Secondary Officer E-sign Details:", data)
    return data
  } catch (error) {
    console.error("Error in getSecondaryOfficerEsignDetails:", error)
    throw error
  }
}
interface StartInspectionPayload {
  assignmentId: string | number
  endDateTime: string
  finalScore: string
  refId: string | number
  startDateTime: string
  dateOfJoining: string
  updatedOn: string
  displayRefId: string
}

interface StartInspectionResponse {
  refId: null | string
  inspectionType: null | string
  otp: null | string
  assignmentId: null | string
  secAssignmentId: null | string
  fsoId: null | string
  generatedCode: string
  statusCode: string
}

// ... existing encryption functions remain the same

export const startInspection = async (payload: StartInspectionPayload): Promise<StartInspectionResponse> => {
  try {
    const storedUserId = await AsyncStorage.getItem("userId")
    const accessToken = await AsyncStorage.getItem("accessToken")
    const xAuthUserId = encryptData(storedUserId || "")

    const apiUrl = `${BASE_URL}/gateway/officer/inspection/inspectiondetailreg/${storedUserId}`

    if (!accessToken || !storedUserId) {
      throw new Error("No authentication token or user ID found")
    }

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
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    console.log("Start Inspection Response:", data)
    return data
  } catch (error) {
    console.error("Error in startInspection:", error)
    throw error
  }
}


