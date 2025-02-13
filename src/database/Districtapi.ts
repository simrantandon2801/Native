import CryptoJS from "crypto-js"
import { BASE_URL } from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage"


const SECRET_KEY = "LsiplyG3M1bX7Rg"
interface DistrictPayload {
  stateCode: string
  districtCode: null
  viewFlag: string
}
interface SearchPayload {
    fssaiUserId: number
    statusId: number
    licenseCategoryId: number
    displayRefId: string
    companyName: string
    district: string
    subDivision: string
    fromDate: string | null
    toDate: string | null
    categoryId: string
    kobId: string
  }
const encryptData = (data: string): string => {
    const encryptedData = CryptoJS.HmacSHA256(data, SECRET_KEY)
    return CryptoJS.enc.Base64.stringify(encryptedData).toString()
  }

export const getDistrictList = async (stateCode: string) => {
  try {
    const storedUserId = await AsyncStorage.getItem("userId")
    const accessToken = await AsyncStorage.getItem("accessToken")
    const xAuthUserId = encryptData(storedUserId || "")

    const apiUrl = `${BASE_URL}/gateway/officer/commonauth/address/getdistictlist`

    if (!accessToken || !storedUserId) {
      throw new Error("No authentication token or user ID found")
    }

    const payload: DistrictPayload = {
      stateCode: stateCode,
      districtCode: null,
      viewFlag: "S,B"
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${accessToken}`,
        "X-Auth-User-Id": xAuthUserId,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`HTTP error! Status: ${response.status}, Body: ${errorText}`)
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    console.log("District list result:", data)
    return data
  } catch (error) {
    console.error("Error in getDistrictList:", error)
    throw error
  }
}

export const searchApplications = async (payload: SearchPayload) => {
  try {
    console.log("🚀 searchApplications function called");

    const storedUserId = await AsyncStorage.getItem("userId");
    const accessToken = await AsyncStorage.getItem("accessToken");
    const xAuthUserId = encryptData(storedUserId || "");

    console.log("User ID:", storedUserId);
    console.log(" Access Token:", accessToken ? "Token Present" : "Token Missing");

    if (!accessToken || !storedUserId) {
      console.error(" No authentication token or user ID found");
      throw new Error("No authentication token or user ID found");
    }

    console.log("Authentication check passed. Making API request...");

    const apiUrl = `${BASE_URL}/gateway/officer/inspection/getsubmitedapplicationsregall/1`;
    console.log(" API URL:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${accessToken}`,
        "X-Auth-User-Id": xAuthUserId,
      },
      body: JSON.stringify(payload),
    });

    console.log(" API Response:", response);
    console.log(" API Response Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(` HTTP error! Status: ${response.status}, Body: ${errorText}`);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(" API Success. Response Data:", data);

    return data;
  } catch (error) {
    console.error(" Error in searchApplications:", error);
    throw error;
  }
};
