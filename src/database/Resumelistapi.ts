import CryptoJS from "crypto-js"
import { BASE_URL } from "@env"
import "react-native-get-random-values"
import AsyncStorage from "@react-native-async-storage/async-storage"

const SECRET_KEY = "LsiplyG3M1bX7Rg"

export const encryptData = (data: string): string => {
  const encryptedData = CryptoJS.HmacSHA256(data, SECRET_KEY)
  return CryptoJS.enc.Base64.stringify(encryptedData).toString()
}

interface InspectionParameterPayload {
  sectionId: number
  inspectionId: string
  refId: string
}

interface InspectionParameterResponse {
  
  id: number
  name: string
 
}

export const getInspectionParameterResults = async (
  payload: InspectionParameterPayload
): Promise<InspectionParameterResponse[]> => {
  try {
    const storedUserId = await AsyncStorage.getItem("userId")
    const accessToken = await AsyncStorage.getItem("accessToken")
    const xAuthUserId = encryptData(storedUserId || "")

    if (!accessToken || !storedUserId) {
      throw new Error("No authentication token or user ID found")
    }

    const queryParams = new URLSearchParams({
      sectionId: payload.sectionId.toString(),
      inspectionId: payload.inspectionId,
      refId: payload.refId,
    }).toString()

    const apiUrl = `${BASE_URL}/gateway/officer/inspection/masterinspectionparameterresult?${queryParams}`

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

    const data: InspectionParameterResponse[] = await response.json()
    console.log("Inspection parameter results:", data)
    return data
  } catch (error) {
    console.error("Error in getInspectionParameterResults:", error)
    throw error
  }
}