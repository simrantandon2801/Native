import CryptoJS from "crypto-js";
import { BASE_URL } from "@env";
import "react-native-get-random-values";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

// Secret key for encryption
const SECRET_KEY = "LsiplyG3M1bX7Rg";

// Define the payload interface for creating an inspection
interface CreateInspectionPayload {
  displayRefId: string;
  inspectionDate: string;
  refId: string;
  doRemarks: string;
  fsoId: string;
  statusId: number;
  fsoAcknowledgement: boolean;
  fsoName: string;
  createdByName: string;
  fsoAssignmentSecondaryOfficerRegistration: {
    refId: number;
    fsoId: string;
    createdBy: string;
    updatedBy: string;
    inspectionType: string;
    fsoName: string;
    createdByName: string;
    doRemarks: string;
    officerType: string;
  }[];
  inspectionType: string;
  createdBy: string;
  updatedBy: string;
  checkReschedule: boolean;
}

// Encryption function
const encryptData = (data: string): string => {
  const encryptedData = CryptoJS.HmacSHA256(data, SECRET_KEY);
  return CryptoJS.enc.Base64.stringify(encryptedData).toString();
};


export const createInspection = async (payload: CreateInspectionPayload) => {
  try {
   
    const storedUserId = await AsyncStorage.getItem("userId");
    const accessToken = await AsyncStorage.getItem("accessToken");

   
    if (!accessToken || !storedUserId) {
      throw new Error("No authentication token or user ID found");
    }

   
    const xAuthUserId = encryptData(storedUserId);

   
    const apiUrl = `${BASE_URL}/gateway/officer/inspection/fsoassignmentreg`;

    // Make the POST request to the API
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${accessToken}`,
        "X-Auth-User-Id": xAuthUserId,
      },
      body: JSON.stringify(payload),
    });

    // Handle non-OK HTTP responses
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
      throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
    }

   
    const data = await response.json();
    console.log("Create inspection result:", data);


    if (data.statusCode === "200") {
      console.log("Status code is 200. Checking for generatedCode...");

     
      if (data.generatedCode === "409C") {
        console.log("Generated code is 409C. Inspection already allocated.");
        Alert.alert(
         
          "Inspection already allocated."
        );
        return; 
      }

   
      console.log("Inspection created successfully.");
      Alert.alert("Success", "Inspection allocated successfully.");
      return data; 
    } else {
    
      throw new Error(`Unexpected status code: ${data.statusCode}`);
    }
  } catch (error) {
    // Log and rethrow any errors
    console.error("Error in createInspection:", error);
    Alert.alert("Error", "An unexpected error occurred. Please try again later.");
    throw error;
  }
};