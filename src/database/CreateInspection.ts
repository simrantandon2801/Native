import CryptoJS from "crypto-js"
import { BASE_URL } from "@env"
import "react-native-get-random-values"
import AsyncStorage from "@react-native-async-storage/async-storage"

const SECRET_KEY = "LsiplyG3M1bX7Rg"

interface CreateInspectionPayload {
  displayRefId: string
  inspectionDate: string
  refId: number
  doRemarks: string
  fsoId: string
  statusId: number
  fsoAcknowledgement: boolean
  fsoName: string
  createdByName: string
  fsoAssignmentSecondaryOfficerRegistration: {
    refId: number
    fsoId: string
    createdBy: string
    updatedBy: string
    inspectionType: string
    fsoName: string
    createdByName: string
    doRemarks: string
    officerType: string
  }[]
  inspectionType: string
  createdBy: string
  updatedBy: string
  checkReschedule: boolean
}

interface CreateInspectionResponse {

  success: boolean
  message: string
  inspectionId?: string
}

const encryptData = (data: string): string => {
  const encryptedData = CryptoJS.HmacSHA256(data, SECRET_KEY)
  return CryptoJS.enc.Base64.stringify(encryptedData).toString()
}

export const createInspection = async (payload: CreateInspectionPayload) => {
  try {
    const storedUserId = await AsyncStorage.getItem("userId")
    const accessToken = await AsyncStorage.getItem("accessToken")
    const xAuthUserId = encryptData(storedUserId || "")

    const apiUrl = `${BASE_URL}/gateway/officer/inspection/fsoassignmentreg`

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

    const data= await response.json()
    console.log("Create inspection result:", data)
    return data
  } catch (error) {
    console.error("Error in createInspection:", error)
    throw error
  }
}

