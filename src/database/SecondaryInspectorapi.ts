import CryptoJS from "crypto-js"
import { BASE_URL } from "@env"
import "react-native-get-random-values"
import AsyncStorage from "@react-native-async-storage/async-storage"

const SECRET_KEY = "LsiplyG3M1bX7Rg"

export const encryptData = (data: string): string => {
  const encryptedData = CryptoJS.HmacSHA256(data, SECRET_KEY)
  return CryptoJS.enc.Base64.stringify(encryptedData).toString()
}

export const getSecondaryInspectors = async (userId: string)=> {
  try {
    const storedUserId = await AsyncStorage.getItem("userId")
    const accessToken = await AsyncStorage.getItem("accessToken")
    const xAuthUserId = encryptData(storedUserId || "")

    const apiUrl = `${BASE_URL}/gateway/officer/do/listoffsounderdoforregforsecondaryofficers/1/${userId}`
    console.log("UserId:", userId)

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
      body: JSON.stringify(["124533118257664"]),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`HTTP error! Status: ${response.status}, Body: ${errorText}`)
      throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`)
    }

    const data = await response.json()
    console.log("Secondary inspectors result:", data)
    return data
  } catch (error) {
    console.error("Error in getSecondaryInspectors:", error)
    throw error
  }
}

