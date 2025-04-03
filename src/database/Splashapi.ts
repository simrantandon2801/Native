import { BASE_URL } from "@env";
import fetchData from "../api/Apiservice";

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

// export const getBackendToken = async () => {
//   try {
//     const apiUrl = `${BASE_URL}/gateway/officer/common/signup/getmobileappversiondetails`;

//     console.log("Requesting from URL:", apiUrl);

//     const response = await fetch(apiUrl, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         "Accept": "application/json",
//       },
//     });

//     console.log("Response Status:", response.status);
//     console.log("Response Headers:", JSON.stringify(response.headers));

//     // Check if the response status is OK (200)
//     if (!response.ok) {
//       throw new Error(`Server returned ${response.status} ${response.statusText}`);
//     }

//     const responseText = await response.text();
//     console.log("Raw Response:", responseText);

//     // Parse the response as JSON
//     let data;
//     try {
//       data = JSON.parse(responseText);
//     } catch (jsonError) {
//       console.error("Response is not valid JSON. Server might be returning HTML or an error page.");
//       throw new Error("Invalid response from server");
//     }

//     // Validate the response structure
//     if (!data || typeof data.fcVersionCode !== "string" || typeof data.fcVersionName !== "string") {
//       console.error("Invalid response structure:", data);
//       throw new Error("Invalid response from server");
//     }

//     console.log("Backend token received:", data);
//     return data;
//   } catch (error) {
//     console.error("Error in getBackendToken:", error);
//     throw error;
//   }
// };