import AsyncStorage from "@react-native-async-storage/async-storage"
import CryptoJS from "crypto-js"
import { BASE_URL } from "@env"

const SECRET_KEY = "LsiplyG3M1bX7Rg"

interface SearchPayload {
  userId: string
  displayRefId: string
  companyName: string
  fromDate: string
  toDate: string
  inspectionType: string
  fsoName: string
  kobId: string
}

const encryptData = (data: string): string => {
  const encryptedData = CryptoJS.HmacSHA256(data, SECRET_KEY)
  return CryptoJS.enc.Base64.stringify(encryptedData).toString()
}

export const searchApplicationsAllocated = async (payload: SearchPayload, currentPage: number) => {
    try {
      console.log("Starting searchApplicationsAllocated function...");
  
      // Retrieve userId and accessToken from AsyncStorage
      const storedUserId = await AsyncStorage.getItem("userId");
      const accessToken = await AsyncStorage.getItem("accessToken");
  
      console.log("Stored User ID:", storedUserId);
      console.log("Access Token:", accessToken);
  
     
      const xAuthUserId = encryptData(storedUserId || "");
      console.log("Encrypted User ID (X-Auth-User-Id):", xAuthUserId);
  
    
      if (!accessToken || !storedUserId) {
        console.error("Authentication token or user ID is missing.");
        throw new Error("No authentication token or user ID found");
      }
  
      
      const apiUrl = `${BASE_URL}/gateway/officer/inspection/fsoassignmentfordoreg/${currentPage}`;
      console.log("API URL:", apiUrl);
  
      // Make the API call
      console.log("Making API request with payload:", payload);
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${accessToken}`,
          "X-Auth-User-Id": xAuthUserId,
        },
        body: JSON.stringify(payload),
      });
  
      console.log("API Response Status:", response.status);
  
      // Check if the response is OK
      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Parse the response data
      const data = await response.json();
      console.log("API Response Data:", data);
  
      return data;
    } catch (error) {
      console.error("Error in searchApplicationsAllocated:", error);
      throw error;
    }
  };

