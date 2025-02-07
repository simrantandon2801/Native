import { BASE_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CryptoJS from "crypto-js";
import "react-native-get-random-values";

const SECRET_KEY = "LsiplyG3M1bX7Rg";

interface AllocateInspectionDetailsResponse {
  [key: string]: any;
}

export const encryptData = (data: string): string => {
  const encryptedData = CryptoJS.HmacSHA256(data, SECRET_KEY);
  return CryptoJS.enc.Base64.stringify(encryptedData).toString();
};

export const getAllocateInspectionDetails = async (
  refId: string,
  certificateNo: string
): Promise<AllocateInspectionDetailsResponse> => {
  try {
    const storedUserId = await AsyncStorage.getItem("userId");
    const accessToken = await AsyncStorage.getItem("accessToken");
    const xAuthUserId = encryptData(storedUserId || "");

    if (!accessToken || !storedUserId) {
      throw new Error("No authentication token or user ID found");
    }

    const apiUrl = `${BASE_URL}/gateway/officer/inspection/alocateinspectiondetailsforreg/${refId}/${certificateNo}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "x-auth-user-id": xAuthUserId,  
        "user-id": storedUserId,       
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: AllocateInspectionDetailsResponse = await response.json();
    console.log("Allocate Inspection Details result:", data);
    return data;
  } catch (error) {
    console.error("Error in getAllocateInspectionDetails:", error);
    throw error;
  }
};
