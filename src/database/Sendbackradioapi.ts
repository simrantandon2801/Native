import CryptoJS from "crypto-js"
import { BASE_URL } from "@env"
import "react-native-get-random-values"
import AsyncStorage from "@react-native-async-storage/async-storage"


const SECRET_KEY = "LsiplyG3M1bX7Rg"

export const encryptData = (data: string): string => {
  const encryptedData = CryptoJS.HmacSHA256(data, SECRET_KEY)
  return CryptoJS.enc.Base64.stringify(encryptedData).toString()
}



export const getListSendBackToFBOForClarification = async (refId: string,inspectionId: string, ) => {
    console.log("refID==",refId)
    console.log("inspectionID==",inspectionId)
 
  try {
    const storedUserId = await AsyncStorage.getItem("userId")
    const accessToken = await AsyncStorage.getItem("accessToken")
    const xAuthUserId = encryptData(storedUserId || "")

    if (!accessToken || !storedUserId) {
      throw new Error("No authentication token or user ID found")
    }


    const response = await fetch(`${BASE_URL}/gateway/officer/inspection/listsendbacktofboforclarificationreg/${refId}/${inspectionId}`, {
      method: "GET", 
      headers: {
        "Content-Type": "application/json",
        Authorization: `${accessToken}`,
        "X-Auth-User-Id": xAuthUserId,
     
      },
    })
console.log("responsendback++",response)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
   console.log("response was found...")

    const data = await response.json()
    console.log("api received : ", data);
    return data
  } catch (error) {
    console.error("API Error:", error)
    console.log("Error", "Failed to fetch data. Please try again.")
    throw error 
  }
}