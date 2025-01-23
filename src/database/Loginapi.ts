import CryptoJS from 'crypto-js';
import { BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const secretKey = "$$CHALLENGE";

export interface LoginResponse {
  accessToken: string;
  userId: string;
  roles: Array<{
    roleId: number;
    roleName: string;
  }>;
}
const getStringAfterLastSlash = (input: string)=> {
  // Ensure the input is a string and find the last forward slash, then get the substring after it
  try{if (typeof input === 'string') {
    const lastSlashIndex = input.lastIndexOf('/');
    return lastSlashIndex !== -1 ? input.substring(lastSlashIndex + 1) : input;
  }
  return ''; }catch(err){
    console.log("err : ", err);
  }
};


const encryptPassword = (password: string, key: string): string => {
  const hmac = CryptoJS.HmacSHA256(password, key);
  return CryptoJS.enc.Base64.stringify(hmac);
};

const encryptPasswordMD5 = (password: string, key: string): string => {
  const hmac = CryptoJS.HmacMD5(password, key);
  return CryptoJS.enc.Base64.stringify(hmac);
};

export const loginUser = async (username: string, password: string): Promise<LoginResponse> => {
  const encryptedPassword = encryptPassword(password, secretKey);
  const encryptedPasswordMD5 = encryptPasswordMD5(password, secretKey);

  try {
    console.log('Attempting login with:', { username, encryptedPassword, encryptedPasswordMD5 });

    const response = await fetch(`${BASE_URL}/gateway/officer/authority`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.trim(),
        password: encryptedPassword,
        md5Password: encryptedPasswordMD5,
      }),
    });

    console.log('-------------------Response :', response);
    

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Network response was not ok: ${response.status} ${errorText}`);
    }
    // const anserkey = getStringAfterLastSlash(response)
    // console.log("???????????????? : ", anserkey);

    const data: LoginResponse = await response.json();
    console.log('Login response:', data);

    // Store the token and userId in AsyncStorage
    const token = data.accessToken;
    await AsyncStorage.setItem('accessToken', token);
    await AsyncStorage.setItem('userId', String(data.userId));  // Convert userId to string
    console.log('Login data stored in AsyncStorage');

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};


// export const loginUser = async (username: string, password: string): Promise<LoginResponse> => {
//   const encryptedPassword = encryptPassword(password, secretKey);
//   const encryptedPasswordMD5 = encryptPasswordMD5(password, secretKey);

//   try {
//     console.log('Attempting login with:', { username, encryptedPassword, encryptedPasswordMD5 });
    
//     const response = await fetch(`${BASE_URL}/gateway/officer/authority`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         username: username.trim(),
//         password: encryptedPassword,
//         md5Password: encryptedPasswordMD5,
//       }),
//     });

//     console.log('Response status:', response.status);
    
//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('Error response:', errorText);
//       throw new Error(`Network response was not ok: ${response.status} ${errorText}`);
//     }

//     const data: LoginResponse = await response.json();
//     console.log('Login response:', data);

//     // Store the token in a variable
//     const token = data.accessToken;

//     // Store the token and userId in AsyncStorage
//     await AsyncStorage.setItem('accessToken', token);
//     await AsyncStorage.setItem('userId', data.userId);
//     console.log('Login data stored in AsyncStorage');

//     return data;
//   } catch (error) {
//     console.error('Login error:', error);
//     throw error;
//   }
// };

