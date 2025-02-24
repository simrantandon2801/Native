import CryptoJS from "crypto-js";
import { BASE_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const SECRET_KEY = "LsiplyG3M1bX7Rg";

// Define types for payloads
interface Payload1 {
  assignmentId: string; // ✅ Ensuring assignmentId is only in payload1
  fsoAcknowledgement: boolean;
  processFlag: boolean;
}

interface Payload2 {
  displayRefId: string;
  inspectionDate: string;
  refId: number;
  doRemarks: string;
  fsoId: string;
  statusId: number;
  fsoAcknowledgement: boolean;
  fsoName: string;
  createdByName: string;
  fsoAssignmentSecondaryOfficerRegistration: Array<{
    refId: number;
    fsoId: string;
    createdBy: string;
    updatedBy: string;
    inspectionType: string;
    fsoName: string;
    createdByName: string;
    doRemarks: string;
    officerType: string;
  }>;
  inspectionType: string;
  createdBy: string;
  updatedBy: string;
  checkReschedule: boolean;
  roasterId: string | null;
}

// Function to encrypt user ID
const encryptData = (data: string): string => {
  const encryptedData = CryptoJS.HmacSHA256(data, SECRET_KEY);
  return CryptoJS.enc.Base64.stringify(encryptedData);
};

// Function to reschedule inspection
export const rescheduleInspection = async (
  payload1: Payload1,
  payload2: Payload2
) => {
  try {
    // Retrieve user authentication details
    const storedUserId = await AsyncStorage.getItem("userId");
    const accessToken = await AsyncStorage.getItem("accessToken");

    if (!accessToken || !storedUserId) {
      throw new Error("No authentication token or user ID found");
    }

    const xAuthUserId = encryptData(storedUserId);
    const apiUrl = `${BASE_URL}/gateway/officer/inspection/fsoassignmentreg`;

    // First API call
    console.log("Sending first payload:", JSON.stringify(payload1, null, 2));
    const response1 = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${accessToken}`,
        "X-Auth-User-Id": xAuthUserId,
      },
      body: JSON.stringify(payload1),
    });

    if (!response1.ok) {
      const errorText = await response1.text();
      console.error(`Error in first request! Status: ${response1.status}, Body: ${errorText}`);
      throw new Error(`Error in first request! Status: ${response1.status}, Body: ${errorText}`);
    }

    const data1 = await response1.json();
    console.log("First API call result:", data1);

    if (data1.statusCode !== "200") {
      throw new Error(`Unexpected status code in first request: ${data1.statusCode}`);
    }

    console.log("First API call successful. Sending second payload...");

    // Second API call
    console.log("Sending second payload:", JSON.stringify(payload2, null, 2));
    const response2 = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${accessToken}`,
        "X-Auth-User-Id": xAuthUserId,
      },
      body: JSON.stringify(payload2),
    });

    if (!response2.ok) {
      const errorText = await response2.text();
      console.error(`Error in second request! Status: ${response2.status}, Body: ${errorText}`);
      throw new Error(`Error in second request! Status: ${response2.status}, Body: ${errorText}`);
    }

    const data2 = await response2.json();
    console.log("Second API call result:", data2);

    if (data2.statusCode === "200") {
      Alert.alert("Success", "Both inspections rescheduled successfully.");
      return { first: data1, second: data2 };
    } else {
      throw new Error(`Unexpected status code in second request: ${data2.statusCode}`);
    }
  } catch (error) {
    console.error("Error in rescheduleInspection:", error);
    Alert.alert("Error", "Inspection not rescheduled at this time.");
    throw error;
  }
};
