import AsyncStorage from "@react-native-async-storage/async-storage"
import { BASE_URL } from "@env"
import CryptoJS from "crypto-js"

const SECRET_KEY = "LsiplyG3M1bX7Rg"

export const encryptData = (data: string): string => {
  const encryptedData = CryptoJS.HmacSHA256(data, SECRET_KEY)
  return CryptoJS.enc.Base64.stringify(encryptedData).toString()
}

interface DocumentUploadPayload {
  createdBy: string
  inspectionId: any
  updatedBy: string
  documentDesc: string
  sectionName:String
}

export const uploadInspectionDocument = async (
  imageUri: string, 
  payload: DocumentUploadPayload
) => {
  try {
    const storedUserId = await AsyncStorage.getItem("userId")
    const accessToken = await AsyncStorage.getItem("accessToken")
    const xAuthUserId = encryptData(storedUserId || "")

    if (!accessToken || !storedUserId) {
      throw new Error("No authentication token or user ID found")
    }

  
    const formData = new FormData()
    

    const uriParts = imageUri.split('/')
    const fileName = uriParts[uriParts.length - 1]
    
   
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg', 
      name: fileName,
    })
    
    
    formData.append('jsonInput', JSON.stringify(payload))
    
    const apiUrl = `${BASE_URL}/gateway/officer/inspection/inspectiondetaildocumentreg`
    
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `${accessToken}`,
        "X-Auth-User-Id": xAuthUserId,
      },
      body: formData,
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`HTTP error! Status: ${response.status}, Body: ${errorText}`)
      throw new Error(`Upload failed with status: ${response.status}`)
    }
    
    const data = await response.json()
    console.log("Document upload response:", data)
    return data
  } catch (error) {
    console.error("Error in uploadInspectionDocument:", error)
    throw error
  }
}