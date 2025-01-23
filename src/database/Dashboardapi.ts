import CryptoJS from "crypto-js"
import { BASE_URL } from "@env"
import "react-native-get-random-values"
import encodeUtf8 from 'encode-utf8'; 

const SECRET_KEY = "LsiplyG3M1bX7Rg"

export interface InspectionResponse {
  statusId: string
  userId: string
  processFlag: boolean
  accessToken: string
  xAuthUserId: string 
}

export const encryptData = (data: string): string => {
  const encryptedData = CryptoJS.AES.encrypt(data, SECRET_KEY).toString()
  return encodeURIComponent(encryptedData)
}

// List<int> messageBytes = utf8.encode(password);
//     List<int> key = base64.decode(secretKey);
//     crypto.Hmac hmac = new crypto.Hmac(crypto.sha256, key);
//     crypto.Digest digest = hmac.convert(messageBytes);

//     String base64Mac = base64.encode(digest.bytes);
//     return base64Mac;


// const encryptPassword = (password: string, key: string): string => {
//   const hmac = CryptoJS.HmacSHA256(password, key);
//   return CryptoJS.enc.Base64.stringify(hmac);
// };

// const encryptPasswordMD5 = (password: string, key: string): string => {
//   const hmac = CryptoJS.HmacMD5(password, key);
//   return CryptoJS.enc.Base64.stringify(hmac);
// };

// export const loginUser = async (username: string, password: string): Promise<LoginResponse> => {
//   const encryptedPassword = encryptPassword(password, secretKey);
//   const encryptedPasswordMD5 = encryptPasswordMD5(password, secretKey);
export const encryptionPassword = ( data:string) => {
  const hmac = CryptoJS.HmacSHA256(data, SECRET_KEY);
  return CryptoJS.enc.Base64.stringify(hmac);
}
// function getStringAfterLastSlash(input) {
 
//   return input.substring(input.lastIndexOf('/') + 1);
// }
export const getAcknowledgedInspectionCount = async (payload: InspectionResponse) => {
  try {
    const { userId, accessToken, statusId, xAuthUserId } = payload
    const encryptedUserId = encryptData(userId)

    const apiUrl = `${BASE_URL}/gateway/officer/inspection/getassignmentlistreg1/${statusId}`
    console.log('------------------',xAuthUserId)
    console.log('*******************',encryptedUserId)


    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Auth-UserId": xAuthUserId,
         // Add this new header
      },
    })
    // const anserkey = getStringAfterLastSlash(response)
    // console.log("???????????????? : ", anserkey);
    // if (!response.ok) {
    //   const errorText = await response.text()
    //   console.error(`HTTP error! Status: ${response.status}, Body: ${errorText}`)
    //   throw new Error(`HTTP error! Status: ${response.status}`)
    // }

    // const data = await response.json()
    console.log("+++++++++++++++++++++++++++++++++++++ : ",response)
    return response
  } catch (error) {
    console.error("Error in getAcknowledgedInspectionCount:", error)
    throw error
  }
}

