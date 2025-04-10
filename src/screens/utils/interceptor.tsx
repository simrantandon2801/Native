import CryptoJS from "crypto-js"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { BASE_URL } from "@env"


const encryptPayload = (payload) => {
  const key = "Q3J5cHRvS2V5U2VjdXJlZA==" 
  const parsedKey = CryptoJS.enc.Base64.parse(key)
  const encryptedData = CryptoJS.AES.encrypt(payload, parsedKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  return encryptedData.toString()
}


const decryptResponse = (encryptedValue) => {
  const key = "bXVzdGJlMTZieXRlc2tleQ==" 
  const parsedKey = CryptoJS.enc.Base64.parse(key)
  const decryptedData = CryptoJS.AES.decrypt(encryptedValue, parsedKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  return decryptedData.toString(CryptoJS.enc.Utf8)
}


const exceptEndpoints = [
    'https://api.ipify.org/?format=json',
    'fbo/savedocumentspath',
    '/fbo/uploaddocument',
    '/fbo/otherdocumentupload',
    '/fbo/payment/save-cash-payment-railway',
    '/fbo/savehigherauthcomplaintrecordappeal',
    '/fbo/savetrasferlicensedetails',
    '/fbo/saverevertedinspectiondoc',
    '/audit/saverevertedinspectiondoc',
    '/fbo/saveFboApplicationDirectorDetailsDoc',
    '/helpdesk/raiseGrievance',
    '/helpdesk/updateTicketProcessLog',
    '/traceability/saveImportedProductMaster',
    '/fbo/savePlantingMaterialSeedSource',
    '/fbo/saveFertilizerUseDetails',
    '/fbo/savepesticideusedetails',
    '/fbo/saveharvestdetails',
    '/fbo/savesurrenderetails',
    '/downloadpdf/gsttaxinvoice/',
    '/fbo/saveharvestdetails',
    '/fbo/savesurrenderetails',
    '/user_service/user/updateUserDetails',
    '/user_service/user/signUp',
    '/fbo/addAndUpdatePersonnelInfo/',
    '/fbo/saveFboRegistrationFinancialDetails',
    '/fbo/saveFboRegistrationLastFinancialDetails',
    '/user_service/user/updateUserDetails',
    '/user_service/user/signUp',
    '/fbo/addAndUpdateAccreditationActivity',
    '/fbo/addAndUpdateRegistrationOtherGovtApprovalDetails',
    '/fbo/saveFboRegistrationCertificationServicesDetails',
    '/fbo/uploadregistrationdocument',
    '/fbo/saveLabIncorporationDetails',
    '/fbo/addAndUpdateLabRecognitionEmpaDetails',
    '/fbo/addAndUpdateLabAccrediationDetails',
    '/fbo/savefboregistrationdetailsAccessor',
    '/fbo/addAndUpdateAccessorAuditingCertificationDetails',
    '/fbo/addAndUpdateAccessorEmpanelledDetails',
    '/fbo/addAndUpdateAccessorEducationalQualificationDetails',
    '/fbo/uploadDocumentForInternalInspection',
    '/user/captchaTraining/',
  ];
  


export const fetchWithEncryption = async (url, options = {}) => {
  try {
    console.log("⬆️ REQUEST STARTING:", url)

   
    const fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`
    console.log("📍 Full URL:", fullUrl)


    const shouldExclude = exceptEndpoints.some((endpoint) => fullUrl.includes(endpoint))


    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (!shouldExclude) {
  
    //   const accessToken = await AsyncStorage.getItem("accessToken")
    //   const xauth = await AsyncStorage.getItem("xauth")
    //   const userSession = await AsyncStorage.getItem("userSession")
    //   const ipAddress = await AsyncStorage.getItem("ipAddress")

    //   console.log("🔐 Auth Data:", {
    //     accessToken: accessToken ? "✓" : "✗",
    //     xauth: xauth ? "✓" : "✗",
    //     userSession: userSession ? "✓" : "✗",
    //     ipAddress: ipAddress ? "✓" : "✗",
    //   })

 
    //   if (accessToken && !fullUrl.includes("/mitra/registerFsmTradeUser")) {
    //     headers["Authorization"] = accessToken
    //   }

    //   if (xauth && !fullUrl.includes("/mitra/registerFsmTradeUser")) {
    //     headers["X-Auth-User-Id"] = xauth
    //   }

    //   if (ipAddress && !fullUrl.includes("/mitra/registerFsmTradeUser")) {
    //     headers["x-ip-address"] = ipAddress
    //   }

    
      if (options.method === "POST" && options.body && typeof options.body === "string" && !shouldExclude) {
        try {
          const jsonObj = JSON.parse(options.body)
          console.log("📦 Original payload:", jsonObj)
          const encryptedPayload = encryptPayload(options.body)
          options.body = JSON.stringify({ encryptedPayload })
          console.log("🔒 Encrypted payload set")
        } catch (e) {
          console.error("❌ Error encrypting payload:", e)
        
        }
      }
    }

    options.headers = headers
    console.log("🚀 Sending request with options:", {
      method: options.method,
      headers: Object.keys(headers),
      bodyLength: options.body ? options.body.length : 0,
    })

    // Make the fetch request
    const response = await fetch(fullUrl, options)
    console.log("📥 Response received:", {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText,
    })

    // Handle errors
    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Error response:", errorText)
      throw new Error(`Network response was not ok: ${response.status} ${errorText}`)
    }

    // Parse the response
    const responseText = await response.text()
    console.log("📄 Raw response text length:", responseText.length)

    let responseData
    try {
      responseData = JSON.parse(responseText)
      console.log("📊 Parsed response data keys:", Object.keys(responseData))
    } catch (e) {
      console.error("❌ Error parsing JSON response:", e)
      throw new Error("Invalid JSON response")
    }

    // Decrypt response if needed
    if (responseData && responseData.encryptedResponse && !shouldExclude) {
      try {
        console.log("🔓 Decrypting response...")
        const decryptedBody = decryptResponse(responseData.encryptedResponse)
        console.log("✅ Decryption successful, length:", decryptedBody)
        try {
          responseData.data = JSON.parse(decryptedBody)
          console.log("📊 Parsed decrypted data keys:", Object.keys(responseData.data))
        } catch (parseError) {
          console.error("❌ Failed to parse decrypted response:", parseError)
          throw new Error("Invalid decrypted response format")
        }
      } catch (decryptError) {
        console.error("❌ Failed to decrypt response:", decryptError)
        throw new Error("Failed to decrypt response")
      }
    }

    console.log("✅ Request completed successfully")
    return responseData
  } catch (error) {
    console.error("❌ Error in fetch request:", error.message)

    if (error.response) {
      const status = error.response.status
      if (status === 415) {
        console.error("❌ Unsupported Media Type")
      } else if (status === 429) {
        console.error("❌ Too Many Attempts")
      } else if (status === 401) {
        console.error("❌ Unauthorized - Redirecting to login...")
      }
    }

    throw error
  }
}
