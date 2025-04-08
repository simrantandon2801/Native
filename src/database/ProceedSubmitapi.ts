
import CryptoJS from "crypto-js"
import { BASE_URL } from "@env"
import "react-native-get-random-values"
import AsyncStorage from "@react-native-async-storage/async-storage"

const SECRET_KEY = "LsiplyG3M1bX7Rg"

export interface InspectionResponse {
  refId: string | null
  inspectionType: string | null
  otp: string | null
  assignmentId: number | null
  secAssignmentId: string | null
  fsoId: string | null
  generatedCode: string
  statusCode: string
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



export const saveInspectionclarificationreg = async (payload: PostPayload) => {
  try {
    const storedUserId = await AsyncStorage.getItem("userId")
    const accessToken = await AsyncStorage.getItem("accessToken")
    const xAuthUserId = encryptData(storedUserId || "")

    const apiUrl = `${BASE_URL}/gateway/officer/inspection/saveInspectionclarificationreg`

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
      throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`)
    }

    const data = await response.json()
    console.log("Save as Clarification", data)
    return data
  } catch (error) {
    console.error("Error in Clarification:", error)
    throw error
  }
}
export const saveAcceptg = async (payload: PostPayload) => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId")
      const accessToken = await AsyncStorage.getItem("accessToken")
      const xAuthUserId = encryptData(storedUserId || "")
  
      const apiUrl = `${BASE_URL}/gateway/officer/inspection/saveInspectionclarificationreg`
  
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
        throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`)
      }
  
      const data = await response.json()
      console.log("Save as Clarification", data)
      return data
    } catch (error) {
      console.error("Error in Clarification:", error)
      throw error
    }
  }
  export const saveRejectscritnize = async (payload: PostPayload) => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId")
      const accessToken = await AsyncStorage.getItem("accessToken")
      const xAuthUserId = encryptData(storedUserId || "")
  
      const apiUrl = `${BASE_URL}/gateway/officer/inspection/processdocumentscrutinizationwithrejectedreg/`
  
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
        throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`)
      }
  
      const data = await response.json()
      console.log("Save as Clarification", data)
      return data
    } catch (error) {
      console.error("Error in Clarification:", error)
      throw error
    }
  }


