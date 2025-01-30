import CryptoJS from "crypto-js"
import AsyncStorage from "@react-native-async-storage/async-storage"

import { BASE_URL } from "@env"
const SECRET_KEY = "LsiplyG3M1bX7Rg"

interface InspectionPayload {
  refId: string
  licenseNo: string
  txtCompliance: string
  kobId: string
  fromDate: string
  toDate: string
  fsoId: string
  inspectionType: string
  licenseCategoryId: number
  processFlag: boolean
  groupId: string
  companyName: string
  riskType: string
  categoryId: string
  fsoName: string
}

const encryptData = (data: string): string => {
  const encryptedData = CryptoJS.HmacSHA256(data, SECRET_KEY)
  return CryptoJS.enc.Base64.stringify(encryptedData).toString()
}

export const getInspectionSearchReport = async (payload: InspectionPayload): Promise<any> => {
  try {
    console.log("Fetching user authentication details...");
    const storedUserId = await AsyncStorage.getItem("userId")
    const accessToken = await AsyncStorage.getItem("accessToken")
    const xAuthUserId = encryptData(storedUserId || "")

    const apiUrl = `${BASE_URL}/gateway/officer/inspection/inspectionsearchreportreg/1`

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
    console.log("Inspection search report result:", data)
    return data
  } catch (error) {
    console.error("Error in getInspectionSearchReport:", error)
    throw error
  }
}

