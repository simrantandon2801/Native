import CryptoJS from "crypto-js"
import { BASE_URL } from "@env"
import "react-native-get-random-values"
import AsyncStorage from "@react-native-async-storage/async-storage"


const SECRET_KEY = "LsiplyG3M1bX7Rg"




export const encryptData = (data: string): string => {
  const encryptedData = CryptoJS.HmacSHA256(data, SECRET_KEY)
  return CryptoJS.enc.Base64.stringify(encryptedData).toString()
}

export const encryptionPassword = (data: string) => {
  const hmac = CryptoJS.HmacSHA256(data, SECRET_KEY)
  return CryptoJS.enc.Base64.stringify(hmac)
}



export const getClarificationFromOngoingInspection = async (payload: any,currentPage:number) => {
  try {
    const storedUserId = await AsyncStorage.getItem("userId")
    const accessToken = await AsyncStorage.getItem("accessToken")
    const xAuthUserId = encryptData(storedUserId || "")

    const apiUrl = `${BASE_URL}/gateway/officer/inspection/getinspectiondetailreg/${currentPage}`

    if (!accessToken || !storedUserId) {
      throw new Error("No authentication token or user ID found")
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${accessToken}`,
        "X-Auth-User-Id": xAuthUserId,
      },
      body:JSON.stringify(payload),
  
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`HTTP error! Status: ${response.status}, Body: ${errorText}`)
      throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`)
    }

    const data = await response.json()
    console.log("Clarification from ongoing inspection result:", data)
    return data
  } catch (error) {
    console.error("Error in getClarificationFromOngoingInspection:", error)
    throw error
  }
}

export const getClarificationFromScrutinizeInspection = async ()=> {
  try {
    const storedUserId = await AsyncStorage.getItem("userId")
    const accessToken = await AsyncStorage.getItem("accessToken")
    const xAuthUserId = encryptData(storedUserId || "")

    const apiUrl = `${BASE_URL}/gateway/officer/inspection/getinspectiondetailreg/1`

    if (!accessToken || !storedUserId) {
      throw new Error("No authentication token or user ID found")
    }

    const response = await fetch(apiUrl, {
      method: "POST",
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
    console.log("Clarification from scrutinize inspection result:", data) 
    
    return data
  } catch (error) {
    console.error("Error in getClarificationFromScrutinizeInspection:", error)
    throw error
  }
}
// export const getViewScore = async (refId:string,inspectionId:string) => {
//   try {
//     const storedUserId = await AsyncStorage.getItem("userId");
//     const accessToken = await AsyncStorage.getItem("accessToken");
//     const xAuthUserId = encryptData(storedUserId || "");

//     if (!accessToken || !storedUserId) {
//       throw new Error("No authentication token or user ID found");
//     }

//     const apiUrl = `${BASE_URL}/gateway/officer/inspection/clarificationsenttofboreg/${refId}/${inspectionId}`;
//     console.log("apiurl",apiUrl)

//     const response = await fetch(apiUrl, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `${accessToken}`,
//         "X-Auth-User-Id": xAuthUserId,
//       },
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
//       throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
//     }

//     const data = await response.json();
//     console.log("View score:", data);
//     return data;
//   } catch (error) {
//     console.error("Error in getFssaiUserDetails:", error);
//     throw error;
//   }
// };

