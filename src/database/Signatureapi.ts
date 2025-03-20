import CryptoJS from "crypto-js"
import { BASE_URL } from "@env"
import "react-native-get-random-values"
import AsyncStorage from "@react-native-async-storage/async-storage"

const SECRET_KEY = "LsiplyG3M1bX7Rg"

// Interface for the witness details payload
export interface WitnessDetailsPayload {
  assignmentId: number
  inspectionId: number
  refId: number
  name: string
  email: string
  mobileNo: string
  aadharFirstDigit: string | null
  aadharSecondDigit: string | null
  signatureType: string
  documentDesc: string
  fssaiUserId: string | null
  verificationType: string
  officerType: string | null
  isOfficer: boolean
  [key: string]: any;
}


export interface WitnessDetailsResponse {
  statusCode: string
  message: string
  data: any
}

export const encryptData = (data: string): string => {
  const encryptedData = CryptoJS.HmacSHA256(data, SECRET_KEY)
  return CryptoJS.enc.Base64.stringify(encryptedData).toString()
}
export const saveWitnessDetailsForRegistration = async (payload: any, file: any) => {
  try {
   
    const storedUserId = await AsyncStorage.getItem("userId");
    const accessToken = await AsyncStorage.getItem("accessToken");
    const xAuthUserId = encryptData(storedUserId || "");

    
    const apiUrl = `${BASE_URL}/gateway/officer/inspection/saveWitnessDetailsForRegistration`;

   
    if (!accessToken || !storedUserId) {
      throw new Error("No authentication token or user ID found");
    }

 
    const requestBody = new FormData();

   
    requestBody.append("jsonInput", JSON.stringify(payload));

   
    if (file) {
      requestBody.append("file", {
        uri: file.uri, 
        name: file.name, 
        type: file.type, 
      });
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `${accessToken}`,
        "X-Auth-User-Id": xAuthUserId,
      },
      body: requestBody,
    });

    // Handle non-OK responses
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
      throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
    }

    // Parse and return the response
    const data = await response.json();
    console.log("Save witness details result:", data);
    return data;
  } catch (error) {
    console.error("Error in saveWitnessDetailsForRegistration:", error);
    throw error;
  }
};

export const getWitnessDetailsForRegistration = async (
  assignmentId: number,
  inspectionId: number
)=> {
  try {
    const storedUserId = await AsyncStorage.getItem("userId");
    const accessToken = await AsyncStorage.getItem("accessToken");
    const xAuthUserId = encryptData(storedUserId || "");

    if (!accessToken || !storedUserId) {
      throw new Error("No authentication token or user ID found");
    }

    const apiUrl = `${BASE_URL}/gateway/officer/inspection/getWitnessDetailsForRegistration/${assignmentId}/${inspectionId}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `${accessToken}`,
        "X-Auth-User-Id": xAuthUserId,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
      throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
    }

    const data = await response.json();
    console.log("Get witness details result:", data);
    return data;
  } catch (error) {
    console.error("Error in getWitnessDetailsForRegistration:", error);
    throw error;
  }
};

export const deleteInspectionSignature = async (eSignId
  : string) => {
  try {
    const storedUserId = await AsyncStorage.getItem("userId");
    const accessToken = await AsyncStorage.getItem("accessToken");
    const xAuthUserId = encryptData(storedUserId || "");

    if (!accessToken || !storedUserId) {
      throw new Error("No authentication token or user ID found");
    }

    const apiUrl = `${BASE_URL}/gateway/officer/inspection/deleteWitnessRegistrationDetails/${eSignId
    }`;

    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${accessToken}`,
        "X-Auth-User-Id": xAuthUserId,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
      throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
    }

    console.log(" deleted successfully");
    return true;
  } catch (error) {
    console.error("Error in deleteInspectionDocument:", error);
    throw error;
  }
};

