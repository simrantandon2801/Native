import AsyncStorage from "@react-native-async-storage/async-storage"
import CryptoJS from "crypto-js"

import { BASE_URL } from "@env"
const SECRET_KEY = "LsiplyG3M1bX7Rg"

export interface InspectionReport {
  id: string
  companyName: string
  inspectionDate: string
  status: string
}

interface PaginatedResponse {
  paginationListRecords: InspectionReport[]
  totalRecords: number
  pageNumber: number
  pageSize: number
}

interface ApiPayload {
  userId: string
  companyName: string
  fromDate: string
  toDate: string
  statusId: number
  inspectionType: string
  groupId: string
  kobId: string
  riskType: string
  licenseNo: string
}

const encryptData = (data: string): string => {
  const encryptedData = CryptoJS.HmacSHA256(data, SECRET_KEY)
  return CryptoJS.enc.Base64.stringify(encryptedData).toString()
}

export const getCompletedInspectionReports = async (payload: ApiPayload): Promise<PaginatedResponse> => {
  try {
    const storedUserId = await AsyncStorage.getItem("userId")
    const accessToken = await AsyncStorage.getItem("accessToken")
    const xAuthUserId = encryptData(storedUserId || "")

    const apiUrl = `${BASE_URL}/gateway/officer/inspection/getcompletedinspectionreportsbyfsoreg/1`

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

    const data: PaginatedResponse = await response.json()
    console.log("Completed inspection reports:", data)
    return data
  } catch (error) {
    console.error("Error in getCompletedInspectionReports:", error)
    throw error
  }
}

