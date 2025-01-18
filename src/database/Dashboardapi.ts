import { BASE_URL } from '@env';
import CryptoJS from 'crypto-js';
import { Platform } from 'react-native';

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

const encryptUserId = (userId: number): string => {
  const userIdString = userId.toString();
  const encryptedUserId = CryptoJS.AES.encrypt(userIdString, SECRET_KEY).toString();
  return encodeURIComponent(encryptedUserId);
};

export const getAcknowledgedInspectionCount = async (payload: InspectionPayload) => {
  try {
    console.log("------------------------------------------");
    console.log("Request Payload: ", payload);
    console.log("------------------------------------------");

    const {
      token,
      currentPageNo = 1,
      pageLimit = 10,
      userID,
    } = payload;

    if (!token) {
      throw new Error("Missing token in payload!");
    }

    const apiUrl = `${BASE_URL}/gateway/officer/inspection/getassignmentlistreg1/${currentPageNo}`;

    //const encryptedUserId = encryptUserId(userID);
    const SECRET_KEY = "LsiplyG3M1bX7Rg";
  const userIdString = userID.toString();
  //console.log('-> '+userIdString);
  const encryptedUserId = CryptoJS.AES.encrypt(userIdString, SECRET_KEY).toString();
  //console.log('-> '+encryptedUserId);
  var user_id= encodeURIComponent(encryptedUserId);
 // console.log('-> '+user_id);




    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-auth-user-id': encryptedUserId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        currentPageNo,
        pageLimit,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response Data: ", data);
    console.log("------------------------------------------");

    return {
      currentPageNo: data.currentPageNo || currentPageNo,
      totalPages: data.totalPages || 0,
      pageLimit: data.pageLimit || pageLimit,
      totalRecords: data.totalRecords || 0,
      paginationListRecords: data.paginationListRecords || [],
    };

  } catch (err) {
    console.error("Error in getAcknowledgedInspectionCount: ", err);

    return {
      currentPageNo: payload.currentPageNo || 1,
      totalPages: 0,
      pageLimit: payload.pageLimit || 10,
      totalRecords: 0,
      paginationListRecords: [],
      //done
    };
  }
};
