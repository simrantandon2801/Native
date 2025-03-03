import { BASE_URL } from "@env";

export const getBackendToken = async () => {
  try {
    const apiUrl = `${BASE_URL}/gateway/officer/common/signup/getmobileappversiondetails`;

    console.log("Requesting from URL:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });

    console.log("Response Status:", response.status);
    console.log("Response Headers:", JSON.stringify(response.headers));

    const responseText = await response.text();
    console.log("Raw Response:", responseText);

  
    try {
      const data = JSON.parse(responseText);
      console.log("Backend token received:", data);
      return data;
    } catch (jsonError) {
      console.error("Response is not valid JSON. Server might be returning HTML or an error page.");
      return null;
    }

  } catch (error) {
    console.error("Error in getBackendToken:", error);
    throw error;
  }
};
