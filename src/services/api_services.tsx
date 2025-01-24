interface PostPayload {
    [key: string]: any
  }
    const SECRET_KEY = "LsiplyG3M1bX7Rg"
  export const encryptData1 = (data: string): string => {
    const encryptedData = CryptoJS.HmacSHA256(data, SECRET_KEY);
    return CryptoJS.enc.Base64.stringify(encryptedData).toString();
  }

  export const POST = async (
    apiUrl: string,
    payload: PostPayload,
    accessToken: string,
    xAuthUserId: string,
  ): Promise<any> => {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-Auth-User-Id": xAuthUserId,
        },
        body: JSON.stringify(payload),
      })
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
  
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error in POST request:", error)
      throw error
    }
  }