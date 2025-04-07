import CryptoJS from "crypto-js"
import AsyncStorage from "@react-native-async-storage/async-storage"

import { BASE_URL } from "@env"
const SECRET_KEY = "LsiplyG3M1bX7Rg"



const encryptData = (data: string): string => {
  const encryptedData = CryptoJS.HmacSHA256(data, SECRET_KEY)
  return CryptoJS.enc.Base64.stringify(encryptedData).toString()
}

export const getInspectionSearchReport = async (payload: any,currentPage:number) => {
  try {
    console.log("Fetching user authentication details...");
    const storedUserId = await AsyncStorage.getItem("userId")
    const accessToken = await AsyncStorage.getItem("accessToken")
    const xAuthUserId = encryptData(storedUserId || "")

    const apiUrl = `${BASE_URL}/gateway/officer/inspection/inspectionsearchreportreg/${currentPage}`

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
export const getclicktotalcount = async (payload: any,) => {
  try {
    console.log("Fetching user authentication details...");
    const storedUserId = await AsyncStorage.getItem("userId")
    const accessToken = await AsyncStorage.getItem("accessToken")
    const xAuthUserId = encryptData(storedUserId || "")

    const apiUrl = `${BASE_URL}/gateway/officer/inspection/inspectionsearchreportregcount/`

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
    console.log("totalcount:", data)
    return data
  } catch (error) {
    console.error("Error in totalcount:", error)
    throw error
  }
}
export const getexportexcel = async (payload: any,) => {
  try {
    console.log("Fetching user authentication details...");
    const storedUserId = await AsyncStorage.getItem("userId")
    const accessToken = await AsyncStorage.getItem("accessToken")
    const xAuthUserId = encryptData(storedUserId || "")

    const apiUrl = `${BASE_URL}/gateway/officer/inspection/inspectionsearchreportregexporttoexport`

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
    console.log("excel data :", data)
    return data
  } catch (error) {
    console.error("Error in excel data:", error)
    throw error
  }
}
export const getSearchOfficer = async (userId:string) => {
  try {
    const storedUserId = await AsyncStorage.getItem("userId")
    const accessToken = await AsyncStorage.getItem("accessToken")
    const xAuthUserId = encryptData(storedUserId || "")

    if (!accessToken || !storedUserId) {
      throw new Error("No authentication token or user ID found")
    }

    const apiUrl = `${BASE_URL}/gateway/officer/do/listoffsounderdoforreg/1/${userId}`

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
    console.log("Officer Types:", data)
    return data
  } catch (error) {
    console.error("Error in Officer :", error)
    throw error
  }
}
