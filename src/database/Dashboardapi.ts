import { BASE_URL } from '@env';
import CryptoJS from 'crypto-js';

export interface InspectionPayload {
  token: string;
  currentPageNo?: number;
  totalPages?: number;
  pageLimit?: number;
  totalRecords?: number;
  paginationListRecords?: any[];
  userID: number;
  authuserID: string;
  statusID: string;
  displayRefId: string;
  companyName: string;
  fromDate: string;
  toDate: string;
  processFlag: boolean;
  inspectionType: string | null;
  fsoName: string | null;
}

const SECRET_KEY = "LsiplyG3M1bX7Rg";

// Function to encrypt the user ID
const encryptUserId = (userId: number): string => {
  const encryptedUserId = CryptoJS.AES.encrypt(userId.toString(), SECRET_KEY).toString();
  return encodeURIComponent(encryptedUserId);
};

export const getAcknowledgedInspectionCount = async (payload: InspectionPayload) => {
  try {
    const { token, currentPageNo = 1, pageLimit = 10, userID } = payload;

    // Check if the token is available
    if (!token) throw new Error("Missing token in payload!");

    // Encrypt the user ID
    const encryptedUserId = encryptUserId(userID);

    // Construct the API URL with query parameters
    const apiUrl = `${BASE_URL}/gateway/officer/inspection/getassignmentlistreg1/${currentPageNo}`;
    const urlWithParams = `${apiUrl}?userId=${encryptedUserId}&currentPageNo=${currentPageNo}&pageLimit=${pageLimit}`;

    // Make the GET request to the API
    const response = await fetch(urlWithParams, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    
    const data = await response.json();

    console.log('API response data:', data);

    // Check the structure of the response and return the required fields
    return {
      currentPageNo: data.currentPageNo || currentPageNo,
      totalPages: data.totalPages || 0,
      pageLimit: data.pageLimit || pageLimit,
      totalRecords: data.totalRecords || 0,
      paginationListRecords: data.paginationListRecords || [],
    };
  } catch (error) {
    // console.error("Error in getAcknowledgedInspectionCount:", error);

    // Return default/fallback data if an error occurs
    return {
      currentPageNo: payload.currentPageNo || 1,
      totalPages: 0,
      pageLimit: payload.pageLimit || 10,
      totalRecords: 0,
      paginationListRecords: [],
    };
  }
};
