import CryptoJS from "crypto-js"
import AsyncStorage from "@react-native-async-storage/async-storage"

import { BASE_URL } from "@env"

const SECRET_KEY = "LsiplyG3M1bX7Rg"

interface InspectionDetailsPayload {
  inspectionId:  string
  assignmentId:  number
}

const encryptData = (data: string): string => {
  const encryptedData = CryptoJS.HmacSHA256(data, SECRET_KEY)
  return CryptoJS.enc.Base64.stringify(encryptedData).toString()
}

export const getInspectionPreviewDetails = async (payload: InspectionDetailsPayload) => {
  try {
    console.log("Fetching inspection details...");
    const storedUserId = await AsyncStorage.getItem("userId")
    const accessToken = await AsyncStorage.getItem("accessToken")
    const xAuthUserId = encryptData(storedUserId || "")

    const apiUrl = `${BASE_URL}/gateway/officer/inspection/inspectiondetailreg`

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
    console.log("Inspection details result:", data)
    return data
  } catch (error) {
    console.error("Error in getInspectionDetails:", error)
    throw error
  }
}