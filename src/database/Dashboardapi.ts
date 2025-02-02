import CryptoJS from "crypto-js"
import { BASE_URL } from "@env"
import "react-native-get-random-values"
import AsyncStorage from "@react-native-async-storage/async-storage"
// import api_services from './'
// import api_services from './../services/api_services.js';
import { POST,encryptData1 } from "./../services/api_services.js";


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
  const encryptedData = CryptoJS.HmacSHA256(data, SECRET_KEY);
  return CryptoJS.enc.Base64.stringify(encryptedData).toString();
}

export const encryptionPassword = (data: string) => {
  const hmac = CryptoJS.HmacSHA256(data, SECRET_KEY)
  return CryptoJS.enc.Base64.stringify(hmac)
}

export const getAcknowledgedInspectionCount = async (payload: any) => {
  try {

    const storedUserId = await AsyncStorage.getItem("userId")
    const accessToken = await AsyncStorage.getItem("accessToken")

const xAuthUserId = encryptData(storedUserId|| '');

    const apiUrl = `${BASE_URL}/gateway/officer/inspection/getassignmentlistreg/1`
       const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${accessToken}`,
        "X-Auth-User-Id":xAuthUserId,
      },
      body:JSON.stringify(payload),
    })

    console.log("Response status:", response.status)
    console.log("Response headers:", JSON.stringify(response.headers))

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`HTTP error! Status: ${response.status}, Body: ${errorText}`)
      throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`)
    }

    const data = await response.json()
    console.log("API Response:", JSON.stringify(data))
    return data
  } catch (error) {
    console.error("Error in getAcknowledgedInspectionCount:", error)
    throw error
  }
}



export const getAcceptedInspectionAttachmentCount = async (payload: any): Promise<any> => {
  try {
    const storedUserId = await AsyncStorage.getItem("userId")
    const accessToken = await AsyncStorage.getItem("accessToken")
    const xAuthUserId = encryptData(storedUserId || "")

    const apiUrl = `${BASE_URL}/gateway/officer/inspection/getassignmentlistreg/1`

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
    console.log("Accepted inspection result:", data)
    return data
  } catch (error) {
    console.error("Error in getAcceptedInspectionAttachmentCount:", error)
    throw error
  }
}

export const getRejectedInspectionAttachmentCount = async (payload: any): Promise<any> => {
  try {
    const storedUserId = await AsyncStorage.getItem("userId")
    const accessToken = await AsyncStorage.getItem("accessToken")
    const xAuthUserId = encryptData(storedUserId || "")

    const apiUrl = `${BASE_URL}/gateway/officer/inspection/getassignmentlistreg/1`

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
    console.log("Rejected inspection result:", data)
    return data
  } catch (error) {
    console.error("Error in getRejectedInspectionAttachmentCount:", error)
    throw error
  }
}

export const getOngoingInspectionCount = async (payload: any): Promise<any> => {
  try {
    const storedUserId = await AsyncStorage.getItem("userId")
    const accessToken = await AsyncStorage.getItem("accessToken")
    const xAuthUserId = encryptData(storedUserId || "")

    const apiUrl = `${BASE_URL}/gateway/officer/inspection/getassignmentlistreg/1`

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
    console.log("Ongoing inspection result:", data)
    return data
  } catch (error) {
    console.error("Error in getOngoingInspectionCount:", error)
    throw error
  }
}

