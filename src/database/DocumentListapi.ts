import CryptoJS from "crypto-js"
import { BASE_URL } from "@env"
import "react-native-get-random-values"
import AsyncStorage from "@react-native-async-storage/async-storage"

const SECRET_KEY = "LsiplyG3M1bX7Rg"

export const encryptData = (data: string): string => {
  const encryptedData = CryptoJS.HmacSHA256(data, SECRET_KEY)
  return CryptoJS.enc.Base64.stringify(encryptedData).toString()
}

export const getInspectionDocuments = async (inspectionId: number) => {
  try {
    const storedUserId = await AsyncStorage.getItem("userId")
    const accessToken = await AsyncStorage.getItem("accessToken")
    const xAuthUserId = encryptData(storedUserId || "")

    if (!accessToken || !storedUserId) {
      throw new Error("No authentication token or user ID found")
    }

    const apiUrl = `${BASE_URL}/gateway/officer/inspection/inspectiondetaildocumentreg/${inspectionId}`

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

    const data = await response.json()
    console.log("--Documents result:", data)
    return data
  } catch (error) {
    console.error("Error in getInspectionDocuments:", error)
    throw error
  }
}


export const deleteInspectionDocument = async (documentId: string) => {
  try {
    const storedUserId = await AsyncStorage.getItem("userId");
    const accessToken = await AsyncStorage.getItem("accessToken");
    const xAuthUserId = encryptData(storedUserId || "");

    if (!accessToken || !storedUserId) {
      throw new Error("No authentication token or user ID found");
    }

    const apiUrl = `${BASE_URL}/gateway/officer/inspection/delinspectiondetaildocumentreg/${documentId}`;

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

    console.log("Document deleted successfully");
    return true;
  } catch (error) {
    console.error("Error in deleteInspectionDocument:", error);
    throw error;
  }
};

export const viewInspectionDocument = async (documentPath: string): Promise<string> => {
  try {

    const storedUserId = await AsyncStorage.getItem("userId");
    const accessToken = await AsyncStorage.getItem("accessToken");

    if (!accessToken || !storedUserId) {
      throw new Error("No authentication token or user ID found");
    }

    const xAuthUserId = encryptData(storedUserId);

   
    const apiUrl = `${BASE_URL}/gateway/officer/dms/document-view/${documentPath}`;

    console.log("Viewing document at URL:", apiUrl);

   
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Auth-User-Id": xAuthUserId,
      },
    });

   
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
      throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.startsWith("image/")) {
      throw new Error(`Unexpected Content-Type: ${contentType}`);
    }

   
    const blob = await response.blob();

   
    const base64String = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob); 
    });

    console.log("Base64 string created:", base64String);

    return base64String; 
  } catch (error) {
    console.error("Error in viewInspectionDocument:", error);
    throw error; 
  }
};

