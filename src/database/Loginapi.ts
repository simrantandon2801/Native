import CryptoJS from "crypto-js"
import { BASE_URL } from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage"

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

export const loginUser = async (username: string, password: string): Promise<LoginResponse> => {
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

    console.log("Response status:", response.status)
    console.log("reached B")

    if (!response.ok) {
      console.log("reached C")
      const errorText = await response.text()
      console.error("Error response:", errorText)
      throw new Error(`Network response was not ok: ${response.status} ${errorText}`)
    }

    const data: LoginResponse = await response.json()
    console.log("Login response data:", JSON.stringify(data, null, 2))
  
    console.log("reached E")
    if (!data.roles || !Array.isArray(data.roles)) {
      console.error("Invalid roles data:", data.roles)
      throw new Error("Invalid roles data received from server")
    }
    console.log("reached F")
    const targetRole = data.roles.find((role) => role.roleId === 4 || role.roleId === 40)
    console.log(targetRole)
    console.log("reached G")

    if (targetRole) {
      let menuList:any[]= data.Menus;
      const registrationInspectionMenu = menuList.Menus.find((menu) => menu.Name === "Registration Inspection")
      console.log("reached H")

      if (registrationInspectionMenu) {
        console.log("Login response - Registration Inspection:", registrationInspectionMenu.Name)
        console.log("Login response - SubMenus:", registrationInspectionMenu.SubMenus)
        console.log("reached I")

        // Store the token and userId in AsyncStorage
        await AsyncStorage.setItem("accessToken", data.accessToken)
        await AsyncStorage.setItem("userId", String(data.userId))
        console.log("reached J")

        // Store the Registration Inspection menu data
        await AsyncStorage.setItem("Nameresponse####", JSON.stringify(registrationInspectionMenu.Name))
        await AsyncStorage.setItem("menufromresponse", JSON.stringify(registrationInspectionMenu.SubMenus))
        console.log("reached K")

        console.log("Login data stored in AsyncStorage")

        // Log the stored data for verification
        const storedSubMenus = await AsyncStorage.getItem("menufromresponse")
        console.log("Stored SubMenus:", JSON.parse(storedSubMenus || "[]"))
        const storedName = await AsyncStorage.getItem("Nameresponse####")
        console.log("Stored Name:", JSON.parse(storedName || '""'))
        console.log("reached L")
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

