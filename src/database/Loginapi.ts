import CryptoJS from "crypto-js"
import { BASE_URL } from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Alert } from "react-native"
const secretKey = "$$CHALLENGE"

export interface LoginResponse {
  accessToken: string
  userId: string
  roles: Array<{
    roleId: number
    roleName: string
    Menus: Array<{
      Name: string
      SubMenus: Array<{
        subModuleUrl: string
        subModuleName: string
        orderVal: number
      }>
    }>
  }>
}

const encryptPassword = (password: string, key: string): string => {
  const hmac = CryptoJS.HmacSHA256(password, key)
  return CryptoJS.enc.Base64.stringify(hmac)
}

const encryptPasswordMD5 = (password: string, key: string): string => {
  const hmac = CryptoJS.HmacMD5(password, key)
  return CryptoJS.enc.Base64.stringify(hmac)
}

export const loginUser = async (username: string, password: string) => {
  console.log("Base URLfky:", BASE_URL);

  if (!BASE_URL) {
    console.error("BASE_URL is null or undefined");
    throw new Error("BASE_URL is not configured properly");
  }

  const encryptedPassword = encryptPassword(password, secretKey)
  const encryptedPasswordMD5 = encryptPasswordMD5(password, secretKey)

  try {
    console.log("Attempting login with:", { username, encryptedPassword, encryptedPasswordMD5 })
    console.log("reached A");

    const response = await fetch(`${BASE_URL}/gateway/officer/authority`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.trim(),
        password: encryptedPassword,
        md5Password: encryptedPasswordMD5,
      }),
    })
    console.log("Base URLfky:", BASE_URL);
    console.log("Response status:", response.status)
  

    if (!response.ok) {
   
      const errorText = await response.text()
      console.error("Error response:", errorText)
      throw new Error(`Network response was not ok: ${response.status} ${errorText}`)
    }

    const data= await response.json()
    console.log("Login response data:", JSON.stringify(data))
 
  
   
    if (!data.roles || !Array.isArray(data.roles)) {
      console.error("Invalid roles data:", data.roles)
      throw new Error("Invalid roles data received from server")
    }
   
    const targetRole = data.roles.find((role) => role.roleId === 4 || role.roleId === 40)
    console.log(targetRole)
   

    if (targetRole) {
      let menuList:any[]= data.Menus;
      const registrationInspectionMenu = menuList.Menus.find((menu) => menu.Name === "Inspection")
      console.log("sdd",menuList)
     

      await AsyncStorage.setItem("accessToken", data.accessToken)
      await AsyncStorage.setItem("userId", data.userId)
      await AsyncStorage.setItem("loggedInUserName", username);
      

     
      await AsyncStorage.setItem("Nameresponse####", JSON.stringify(registrationInspectionMenu.Name))
      await AsyncStorage.setItem("menufromresponse", JSON.stringify(registrationInspectionMenu.SubMenus))

      // await AsyncStorage.setItem("BASE_URL", BASE_URL);

      if (registrationInspectionMenu) {
        console.log("Login response - Registration Inspection:", registrationInspectionMenu.Name)
        console.log("Login response - SubMenus:", registrationInspectionMenu.SubMenus)
        // console.log("Login response - url:",registrationInspectionMenu.BASE_URL)
       

        
       
       
        

        console.log("Login data stored in AsyncStorage")

     
        const storedSubMenus = await AsyncStorage.getItem("menufromresponse")
        console.log("Stored SubMenus:", JSON.parse(storedSubMenus || "[]"))
        const storedName = await AsyncStorage.getItem("Nameresponse####")
        console.log("Stored Name:", JSON.parse(storedName || '""'))
    
      } else {
        console.log("Registration Inspection menu not found for the role")
      }
    } else {
      console.log("Role with ID 4 or 40 not found")
    }

    return data
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

