import CryptoJS from "crypto-js"
import { BASE_URL } from "@env"
import "react-native-get-random-values"
import AsyncStorage from "@react-native-async-storage/async-storage"

const SECRET_KEY = "LsiplyG3M1bX7Rg"


export const encryptData = (data: string): string => {
  const encryptedData = CryptoJS.HmacSHA256(data, SECRET_KEY)
  return CryptoJS.enc.Base64.stringify(encryptedData).toString()
}

export const getSecEsignDetails = async (assignmentId: number ,) => {
  try {
    const storedUserId = await AsyncStorage.getItem("userId");
    const accessToken = await AsyncStorage.getItem("accessToken");
    const xAuthUserId = encryptData(storedUserId || "");

    if (!accessToken || !storedUserId) {
      throw new Error("No authentication token or user ID found");
    }

    const apiUrl = `${BASE_URL}/gateway/officer/inspection/getSecondaryOfficerEsignDetails/${assignmentId}`;

    const response = await fetch(apiUrl, {
      method: "GET",
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

    const data = await response.json();
    console.log("Get secondary officer e-sign details result:", data);
    return data;
  } catch (error) {
    console.error("Error in getSecondaryOfficerEsignDetails:", error);
    throw error;
  }
};

export const updateSendInvitation = async (secAssignmentId: number, email: string,) => {
  console.log(secAssignmentId,"sec",email,"emai")
  try {
    const storedUserId = await AsyncStorage.getItem("userId");
    const accessToken = await AsyncStorage.getItem("accessToken");
    const xAuthUserId = encryptData(storedUserId || "");

    if (!accessToken || !storedUserId) {
      throw new Error("No authentication token or user ID found");
    }

    const apiUrl = `${BASE_URL}/gateway/officer/inspection/updateSendInvitation/`;
    
    const payload = {
      secAssignmentId,
      email
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${accessToken}`,
        "X-Auth-User-Id": xAuthUserId,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
      throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
    }

    const data = await response.json();
    console.log("Update send invitation result:", data);
    return data;
  } catch (error) {
    console.error("Error in updateSendInvitation:", error);
    throw error;
  }
};
export const getFssaiUserDetails = async (userId: string) => {
  try {
    const storedUserId = await AsyncStorage.getItem("userId");
    const accessToken = await AsyncStorage.getItem("accessToken");
    const xAuthUserId = encryptData(storedUserId || "");

    if (!accessToken || !storedUserId) {
      throw new Error("No authentication token or user ID found");
    }

    const apiUrl = `${BASE_URL}/gateway/officer/common/signup/fssaiuserdetails/${userId}`;

    const response = await fetch(apiUrl, {
      method: "GET",
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

    const data = await response.json();
    console.log("FSSAI user details result:", data);
    return data;
  } catch (error) {
    console.error("Error in getFssaiUserDetails:", error);
    throw error;
  }
};