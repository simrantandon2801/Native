import CryptoJS from "crypto-js"
import { BASE_URL } from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { fetchWithEncryption } from "../screens/utils/interceptor"

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
  userDetails: {
    name: string
    mobileNo: string
    loginId: string
    userId: string
    email: string
    categoryId: number
  }
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
    console.log("Attempting login with:", { username, encryptedPassword: "***", encryptedPasswordMD5: "***" })

    const response = await fetchWithEncryption(`${BASE_URL}/gateway/officer/authority`, {
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

    // Since fetchWithEncryption already handles JSON parsing, we don't need to parse again
    // The response should already be the data object
    const data: LoginResponse = response.data || response
    console.log("Login response data received")

    if (!data.roles || !Array.isArray(data.roles)) {
      console.error("Invalid roles data:", data.roles)
      throw new Error("Invalid roles data received from server")
    }

    const targetRole = data.roles.find((role) => role.roleId === 4 || role.roleId === 40)
    console.log("Target role found:", targetRole ? "Yes" : "No")

    if (targetRole) {
      // Correctly access Menus from the targetRole, not from data
      if (!targetRole.Menus || !Array.isArray(targetRole.Menus)) {
        console.error("Menus not found in target role:", targetRole)
        throw new Error("Menus not found in target role")
      }

      const registrationInspectionMenu = targetRole.Menus.find((menu) => menu.Name === "Inspection")

      // Store auth data
      await AsyncStorage.setItem("accessToken", data.accessToken)
      await AsyncStorage.setItem("userId", String(data.userId))
      await AsyncStorage.setItem("loggedInUserName", String(data.userDetails.name))

      if (registrationInspectionMenu) {
        console.log("Registration Inspection menu found")

        // Store the Registration Inspection menu data
        await AsyncStorage.setItem("Nameresponse####", JSON.stringify(registrationInspectionMenu.Name))
        await AsyncStorage.setItem("menufromresponse", JSON.stringify(registrationInspectionMenu.SubMenus))

        console.log("Login response - Registration Inspection:", registrationInspectionMenu.Name)
        console.log(
          "Login response - SubMenus:",
          JSON.stringify(registrationInspectionMenu.SubMenus).substring(0, 100) + "...",
        )

        console.log("Login data stored in AsyncStorage")

        // Verify stored data
        const storedSubMenus = await AsyncStorage.getItem("menufromresponse")
        console.log("Stored SubMenus:", storedSubMenus ? "✓" : "✗")
        const storedName = await AsyncStorage.getItem("Nameresponse####")
        console.log("Stored Name:", storedName ? "✓" : "✗")
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
