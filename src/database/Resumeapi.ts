import CryptoJS from "crypto-js"
import { BASE_URL } from "@env"
import "react-native-get-random-values"
import AsyncStorage from "@react-native-async-storage/async-storage"

const SECRET_KEY = "LsiplyG3M1bX7Rg"

export const encryptData = (data: string): string => {
  const encryptedData = CryptoJS.HmacSHA256(data, SECRET_KEY)
  return CryptoJS.enc.Base64.stringify(encryptedData).toString()
}

interface MasterInspectionSectionPayload {
  inspectionId: string
  statusId: string
  userId: string
  processFlag: boolean
}

interface MasterInspectionSectionResponse {
  activeFlag: boolean
  createdBy: string | null
  createdOn: string
  regSectionUrl: string
  sectionId: number
  sectionName: string
  submittedFlag: boolean
  updatedBy: string | null
  updatedOn: string
}

export const getMasterInspectionSection = async (
  payload: MasterInspectionSectionPayload,
) => {
  try {
    const storedUserId = await AsyncStorage.getItem("userId")
    const accessToken = await AsyncStorage.getItem("accessToken")
    const xAuthUserId = encryptData(storedUserId || "")
    const id = 234695

    if (!accessToken || !storedUserId) {
      throw new Error("No authentication token or user ID found")
    }

   
    const queryParams = new URLSearchParams({
      inspectionId: payload.inspectionId,
      statusId: payload.statusId,
      userId: payload.userId,
      processFlag: payload.processFlag.toString(),
    }).toString()

    const apiUrl = `${BASE_URL}/gateway/officer/inspection/masterinspectionsectionreg/${id}?${queryParams}`

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

    const data: MasterInspectionSectionResponse[] = await response.json()
    console.log("Master Inspection Section result:", data)
    return data
  } catch (error) {
    console.error("Error in getMasterInspectionSection:", error)
    throw error
  }
}