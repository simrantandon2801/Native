import CryptoJS from "crypto-js"
import { BASE_URL } from "@env"
import "react-native-get-random-values"
import AsyncStorage from "@react-native-async-storage/async-storage"



const SECRET_KEY = "LsiplyG3M1bX7Rg"

export const encryptData = (data: string): string => {
  const encryptedData = CryptoJS.HmacSHA256(data, SECRET_KEY)
  return CryptoJS.enc.Base64.stringify(encryptedData).toString()
}


export const getInspectionParameterResults = async ()=> {
  try {
    const storedUserId = await AsyncStorage.getItem("userId")
    const accessToken = await AsyncStorage.getItem("accessToken")
    const xAuthUserId = encryptData(storedUserId || "")

    if (!accessToken || !storedUserId) {
      throw new Error("No authentication token or user ID found")
    }

  
    const apiUrl = `${BASE_URL}/gateway/officer/inspection/masterinspectionparameterresult`

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

    const data= await response.json()
    console.log("Inspection parameter results:", data)
    return data
  } catch (error) {
    console.error("Error in getInspectionParameterResults:", error)
    throw error
  }
}




export const getMasterInspectionParameterReg = async (refId: string, inspectionId: string, sectionId: number) => {
  
  try {
    const storedUserId = await AsyncStorage.getItem("userId")
    const accessToken = await AsyncStorage.getItem("accessToken")
    const xAuthUserId = encryptData(storedUserId || "")

    if (!accessToken || !storedUserId) {
      throw new Error("No authentication token or user ID found")
    }

    const apiUrl = `${BASE_URL}/gateway/officer/inspection/masterinspectionparameterreg/${refId}/${inspectionId}/${sectionId}/`

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${accessToken}`,
        "X-Auth-User-Id": xAuthUserId,
      },
    })
    console.log("reg9888",response)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`HTTP error! Status: ${response.status}, Body: ${errorText}`)
      throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`)
    }

    const data= await response.json()
    console.log("Master inspection parameter reg:", data)
    return data
  } catch (error) {
    console.error("Error in getMasterInspectionParameterReg:", error)
    throw error
  }
}