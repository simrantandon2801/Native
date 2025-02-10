import CryptoJS from "crypto-js"
import { BASE_URL } from "@env"
import "react-native-get-random-values"
import AsyncStorage from "@react-native-async-storage/async-storage"

const SECRET_KEY = "LsiplyG3M1bX7Rg"

const encryptData = (data: string): string => {
  const encryptedData = CryptoJS.HmacSHA256(data, SECRET_KEY)
  return CryptoJS.enc.Base64.stringify(encryptedData).toString()
}

interface Inspector {
  fsoName: string
  fssaiUserId: string
}

interface ListOffsounDerDoForRegResponse {
  inspectors: Inspector[]
  status: string
  message: string
}

// export const getListOffsounDerDoForReg = async (userId: string): Promise<ListOffsounDerDoForRegResponse> => {
    export const getListOffsounDerDoForReg = async (userId: string) => {
  try {
    const storedUserId = await AsyncStorage.getItem("userId")
    const accessToken = await AsyncStorage.getItem("accessToken")
    const xAuthUserId = encryptData(storedUserId || "")

    if (!accessToken || !storedUserId) {
      throw new Error("No authentication token or user ID found")
    }

    const apiUrl = `${BASE_URL}/gateway/officer/do/listoffsounderdoforreg/1/${userId}`

    console.log("Making API request to:", apiUrl)
    console.log("X-Auth-User-Id:", xAuthUserId)
    console.log("UserId:", userId)

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

    // const data: ListOffsounDerDoForRegResponse = await response.json()
    const data = await response.json()
    console.log("ListOffsounDerDoForReg API Response:", data)
    // data.map((ins, index) => {
    //     console.log("ME : ", ins.fsoName)
        
    // });
    // console.log("Inspectors received:", data.inspectors)
    return data
  } catch (error) {
    console.error("Error in getListOffsounDerDoForReg:", error)
    throw error
  }
}

