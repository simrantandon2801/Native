import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GetAsync_with_token,
  PostAsync,
  PostAsync_with_token,
} from '../services/rest_api_service';
import {BASE_URL} from '@env';

export const GetUsers = async (
  customer_id : string,
  query?: string,
  reporting_to?: number,
  department_id?: number,
  role_id?: number,
): Promise<string> => {
  try {
    // Base API endpoint
    let uri = `${BASE_URL}/master/get_users?customer_id=${customer_id}`;

    // Add search params dynamically
    const params: Record<string, string | number> = {};

    // Only add 'query' if it is not an empty string
    if (query !== undefined && query !== '') params.query = query;
    if (reporting_to !== undefined) params.reporting_to = reporting_to;
    if (department_id !== undefined) params.department_id = department_id;
    if (role_id !== undefined) params.role_id = role_id;
    // Convert params to search string
    const queryString = new URLSearchParams(params as any).toString();
    // Final URI with search params
    if (queryString) uri += `&${queryString}`;
    // Retrieve token from AsyncStorage
    const token = await AsyncStorage.getItem('Token');

    console.log(`Request URL: ${uri}`);
    const jsonResult = await GetAsync_with_token(uri, token);

    console.log(`API Response:`, jsonResult);

    return JSON.stringify(jsonResult ?? '');
  } catch (error) {
    console.error(`Error in GetUsers:`, error);
    throw Error('Failed: ' + error);
  }
};
export const GetUserRole = async (query: string): Promise<string> => {
  try {
    //debugger;
    //const UserID = await AsyncStorage.getItem('UserID');
    var uri = `${BASE_URL}/master/get_user_role`;
    //var uri = 'http://qms.digital.logicsoft.online:8081/gateway/dilip/upload-samplecollectionimages';
    const token = await AsyncStorage.getItem('Token');
    console.log(uri);
    var jsonResult = await GetAsync_with_token(uri, token);
    console.log(jsonResult);
    //debugger;
    return JSON.stringify(jsonResult ?? '');
  } catch (error) {
    console.error(error);
    throw Error('Failed' + error);
  }
};
export const GetAllRoles = async (query: string): Promise<string> => {
  try {
    //debugger;
    //const UserID = await AsyncStorage.getItem('UserID');
    var uri = `${BASE_URL}/master/get_roles`;
    //var uri = 'http://qms.digital.logicsoft.online:8081/gateway/dilip/upload-samplecollectionimages';
    const token = await AsyncStorage.getItem('Token');
    console.log(uri);
    var jsonResult = await GetAsync_with_token(uri, token);
    console.log(jsonResult);
    //debugger;
    return JSON.stringify(jsonResult ?? '');
  } catch (error) {
    console.error(error);
    throw Error('Failed' + error);
  }
};
export const addUser = async (values: Object): Promise<string> => {
  try {
    //
    //const UserID = await AsyncStorage.getItem('UserID');
    var uri = `${BASE_URL}/master/insert_users_with_role`;
    const token = await AsyncStorage.getItem('Token');
    console.log(uri);
    var payload = JSON.stringify(values);
    console.log(payload);
    var jsonResult = await PostAsync_with_token(uri, payload, token);
    //
    //
    console.log(jsonResult);
    return JSON.stringify(jsonResult ?? '');
  } catch (error) {
    console.error(error);
    throw Error('Failed' + error);
  }
};
export const DeleteUser = async (values: Object): Promise<string> => {
  try {
    //
    //const UserID = await AsyncStorage.getItem('UserID');
    var uri = `${BASE_URL}/master/delete_users`;
    //var uri = 'https://qms.digital.logicsoft.online:8081/gateway/dilip/upload-samplecollectionimages';
    const token = await AsyncStorage.getItem('Token');
    console.log(uri);
    var payload = JSON.stringify(values);
    console.log(payload);
    var jsonResult = await PostAsync_with_token(uri, payload, token);
    //
    //
    console.log(jsonResult);
    return JSON.stringify(jsonResult ?? '');
  } catch (error) {
    console.error(error);
    throw Error('Failed' + error);
  }
};
export const GetUserPermission = async (query: string): Promise<string> => {
  try {
    //debugger;
    //const UserID = await AsyncStorage.getItem('UserID');
    var uri = `${BASE_URL}/master/get_user_permissions?user_id=${query}`;
    //var uri = 'http://qms.digital.logicsoft.online:8081/gateway/dilip/upload-samplecollectionimages';
    const token = await AsyncStorage.getItem('Token');
    console.log(uri);
    var jsonResult = await GetAsync_with_token(uri, token);
    console.log(jsonResult);
    //debugger;
    return JSON.stringify(jsonResult ?? '');
  } catch (error) {
    console.error(error);
    throw Error('Failed' + error);
  }
};
export const GetAdIntegration = async (query: string): Promise<string> => {
  try {
    //debugger;
    //const UserID = await AsyncStorage.getItem('UserID');
    var uri = `${BASE_URL}/integration/get_users`;
    //var uri = 'https://qms.digital.logicsoft.online:8081/gateway/dilip/upload-samplecollectionimages';
    const token = await AsyncStorage.getItem('Token');
    console.log(uri);
    var jsonResult = await GetAsync_with_token(uri, token);
    console.log(jsonResult);
    //debugger;
    return JSON.stringify(jsonResult ?? '');
  } catch (error) {
    console.error(error);
    throw Error('Failed' + error);
  }
};
export const GetUserDept = async (query: string): Promise<string> => {
  try {
    //debugger;
    //const UserID = await AsyncStorage.getItem('UserID');
    var uri = `${BASE_URL}/master/get_department?is_active=true`;
    //var uri = 'https://qms.digital.logicsoft.online:8081/gateway/dilip/upload-samplecollectionimages';
    const token = await AsyncStorage.getItem('Token');
    console.log(uri);
    var jsonResult = await GetAsync_with_token(uri, token);
    console.log(jsonResult);
    //debugger;
    return JSON.stringify(jsonResult ?? '');
  } catch (error) {
    console.error(error);
    throw Error('Failed' + error);
  }
};
export const updateMultipleUsersDepartment = async (
  values: Object,
): Promise<string> => {
  try {
    //
    //const UserID = await AsyncStorage.getItem('UserID');
    var uri = `${BASE_URL}/customeradmin/update_user_department`;
    //var uri = 'https://qms.digital.logicsoft.online:8081/gateway/dilip/upload-samplecollectionimages';
    const token = await AsyncStorage.getItem('Token');
    console.log(uri);
    var payload = JSON.stringify(values);
    console.log(payload);
    var jsonResult = await PostAsync_with_token(uri, payload, token);
    //
    //
    console.log(jsonResult);
    return JSON.stringify(jsonResult ?? '');
  } catch (error) {
    console.error(error);
    throw Error('Failed' + error);
  }
};
export const updateMultipleUsersRole = async (
  values: Object,
): Promise<string> => {
  try {
    //
    //const UserID = await AsyncStorage.getItem('UserID');
    var uri = `${BASE_URL}/customeradmin/update_user_role`;
    //var uri = 'https://qms.digital.logicsoft.online:8081/gateway/dilip/upload-samplecollectionimages';
    const token = await AsyncStorage.getItem('Token');
    console.log(uri);
    var payload = JSON.stringify(values);
    console.log(payload);
    var jsonResult = await PostAsync_with_token(uri, payload, token);
    //
    //
    console.log(jsonResult);
    return JSON.stringify(jsonResult ?? '');
  } catch (error) {
    console.error(error);
    throw Error('Failed' + error);
  }
};
export const DeleteMultipleUsers = async (values: Object): Promise<string> => {
  try {
    //
    //const UserID = await AsyncStorage.getItem('UserID');
    var uri = `${BASE_URL}/master/delete_users`;
    //var uri = 'https://qms.digital.logicsoft.online:8081/gateway/dilip/upload-samplecollectionimages';
    const token = await AsyncStorage.getItem('Token');
    console.log(uri);
    var payload = JSON.stringify(values);
    console.log(payload);
    var jsonResult = await PostAsync_with_token(uri, payload, token);
    //
    //
    console.log(jsonResult);
    return JSON.stringify(jsonResult ?? '');
  } catch (error) {
    console.error(error);
    throw Error('Failed' + error);
  }
};
export const updateUserPermissions = async (
  values: Object,
): Promise<string> => {
  try {
    //
    //const UserID = await AsyncStorage.getItem('UserID');
    var uri = `${BASE_URL}/master/update_multiple_user_permissions`;
    //var uri = 'https://qms.digital.logicsoft.online:8081/gateway/dilip/upload-samplecollectionimages';
    const token = await AsyncStorage.getItem('Token');
    console.log(uri);
    var payload = JSON.stringify(values);
    console.log(payload);
    var jsonResult = await PostAsync_with_token(uri, payload, token);
    //
    //
    console.log(jsonResult);
    return JSON.stringify(jsonResult ?? '');
  } catch (error) {
    console.error(error);
    throw Error('Failed' + error);
  }
};
export const fetchModules = async (query: string): Promise<string> => {
  try {
    //debugger;
    //const UserID = await AsyncStorage.getItem('UserID');
    var uri = `${BASE_URL}//master/get_modules${query}`;
    //var uri = 'https://qms.digital.logicsoft.online:8081/gateway/dilip/upload-samplecollectionimages';
    const token = await AsyncStorage.getItem('Token');
    console.log(uri);
    var jsonResult = await GetAsync_with_token(uri, token);
    console.log(jsonResult);
    //debugger;
    return JSON.stringify(jsonResult ?? '');
  } catch (error) {
    console.error(error);
    throw Error('Failed' + error);
  }
};
export const addmodule = async (values: Object): Promise<string> => {
  try {
    //
    //const UserID = await AsyncStorage.getItem('UserID');
    var uri = `${BASE_URL}//master/insert_modules`;
    //var uri = 'https://qms.digital.logicsoft.online:8081/gateway/dilip/upload-samplecollectionimages';
    const token = await AsyncStorage.getItem('Token');
    console.log(uri);
    var payload = JSON.stringify(values);
    console.log(payload);
    var jsonResult = await PostAsync_with_token(uri, payload, token);
    //
    //
    console.log(jsonResult);
    return JSON.stringify(jsonResult ?? '');
  } catch (error) {
    console.error(error);
    throw Error('Failed' + error);
  }
};
export const GetRolePermission = async (query: string): Promise<string> => {
  try {
    //debugger;
    //const UserID = await AsyncStorage.getItem('UserID');
    var uri = `${BASE_URL}/master/get_role_permissions?role_id=${query}`;
    //var uri = 'http://qms.digital.logicsoft.online:8081/gateway/dilip/upload-samplecollectionimages';
    const token = await AsyncStorage.getItem('Token');
    console.log(uri);
    var jsonResult = await GetAsync_with_token(uri, token);
    console.log(jsonResult);
    //debugger;
    return JSON.stringify(jsonResult ?? '');
  } catch (error) {
    console.error(error);
    throw Error('Failed' + error);
  }
};
export const GetAllPermission = async (query: string): Promise<string> => {
  try {
    //debugger;
    //const UserID = await AsyncStorage.getItem('UserID');
    var uri = `${BASE_URL}/master/get_role_permissions`;
    //var uri = 'http://qms.digital.logicsoft.online:8081/gateway/dilip/upload-samplecollectionimages';
    const token = await AsyncStorage.getItem('Token');
    console.log(uri);
    var jsonResult = await GetAsync_with_token(uri, token);
    console.log(jsonResult);
    //debugger;
    return JSON.stringify(jsonResult ?? '');
  } catch (error) {
    console.error(error);
    throw Error('Failed' + error);
  }
};
export const updateRolePermissions = async (
  values: Object,
): Promise<string> => {
  try {
    //
    //const UserID = await AsyncStorage.getItem('UserID');
    var uri = `${BASE_URL}/master/update_multiple_role_permissions`;
    //var uri = 'https://qms.digital.logicsoft.online:8081/gateway/dilip/upload-samplecollectionimages';
    const token = await AsyncStorage.getItem('Token');
    console.log(uri);
    var payload = JSON.stringify(values);
    console.log(payload);
    var jsonResult = await PostAsync_with_token(uri, payload, token);
    //
    //
    console.log(jsonResult);
    return JSON.stringify(jsonResult ?? '');
  } catch (error) {
    console.error(error);
    throw Error('Failed' + error);
  }
};

// export const GetZoneData = async (query:string): Promise<string> => {
//   try {
//     //debugger;
//     //const UserID = await AsyncStorage.getItem('UserID');
//     var uri = `${BASE_URL}/GetMasters/ZoneList`;
//     //var uri = 'https://qms.digital.logicsoft.online:8081/gateway/dilip/upload-samplecollectionimages';
//     const token = await AsyncStorage.getItem('Token');
//     console.log(uri);
//     var jsonResult = await GetAsync_with_token(uri, token);
//     console.log(jsonResult);
//     //debugger;
//     return JSON.stringify(jsonResult ?? '');
//   } catch (error) {
//     console.error(error);
//     throw Error('Failed' + error);
//   }
// };

