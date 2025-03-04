// import CryptoJS from "crypto-js"
// import { BASE_URL } from "@env"
// import "react-native-get-random-values"
// // import AsyncStorage from "@react-native-async-storage/async-storage"
// // import { Alert } from "react-native"

// const SECRET_KEY = "LsiplyG3M1bX7Rg"

// export const encryptData = (data: string): string => {
//   const encryptedData = CryptoJS.HmacSHA256(data, SECRET_KEY)
//   return CryptoJS.enc.Base64.stringify(encryptedData).toString()
// }



// export const getListSendBackToFBOForClarification = async (inspectionId: string, refId: string) => {
 
//   try {

//     const response = await fetch(`${BASE_URL}/gateway/officer/inspection/listsendbacktofboforclarificationreg/${inspectionId}/${refId}`, {
//       method: "GET", 
//       headers: {
//         "Content-Type": "application/json",
     
//       },
//     })
// console.log("responsendback++",response)

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`)
//     }
//    console.log("response was found...")

//     const data = await response.json()
//     console.log("api received : ", data);
//     return data
//   } catch (error) {
//     console.error("API Error:", error)
//     console.log("Error", "Failed to fetch data. Please try again.")
//     throw error 
//   }
// }