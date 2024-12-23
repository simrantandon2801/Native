import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetAsync_with_token, PostAsync, PostAsync_with_token } from "../services/rest_api_service";
//export const BASE_URL = 'https://underbuiltapi.aadhidigital.com';
import { BASE_URL } from "@env";


export const InsertDraft = async (values: Object): Promise<string> => {
    try {
      // 
       //const UserID = await AsyncStorage.getItem('UserID');
       var uri = `${BASE_URL}/projectFlow/new_project_intake`;
       //var uri = 'https://qms.digital.logicsoft.online:8081/gateway/dilip/upload-samplecollectionimages';
       const token = await AsyncStorage.getItem('Token');  
       console.log(uri);
       var payload = JSON.stringify(values);
       console.log(payload);
       var jsonResult = await PostAsync_with_token(uri, payload,token);
       //  
       //
       console.log(jsonResult);
       return JSON.stringify(jsonResult ?? '');
     } catch (error) {
       console.error(error);
       throw Error('Failed' + error);
     }
  };



  export const GetSequence = async (query:string): Promise<string> => {
    try {
      //debugger;
      //const UserID = await AsyncStorage.getItem('UserID');
      var uri = `${BASE_URL}/utils/get_sequence`;
      //var uri = 'http://qms.digital.logicsoft.online:8081/gateway/dilip/upload-samplecollectionimages';
      const token = await AsyncStorage.getItem('Token');
      console.log(uri);``
      var jsonResult = await GetAsync_with_token(uri, token);
      console.log(jsonResult);
      //debugger;
      console.log("jsonResult from API:", jsonResult);
      return JSON.stringify(jsonResult ?? '');
    } catch (error) {
      console.error(error);
      throw Error('Failed' + error);
    }
  };


  export const InsertReview = async (values: Object): Promise<string> => {
    try {
      // 
       //const UserID = await AsyncStorage.getItem('UserID');
       var uri = `${BASE_URL}/projectFlow/insert_review_process`;
       //var uri = 'https://qms.digital.logicsoft.online:8081/gateway/dilip/upload-samplecollectionimages';
       const token = await AsyncStorage.getItem('Token');  
       console.log(uri);
       var payload = JSON.stringify(values);
       console.log(payload);
       var jsonResult = await PostAsync_with_token(uri, payload,token);
       //  
       //
       console.log(jsonResult);
       return JSON.stringify(jsonResult ?? '');
     } catch (error) {
       console.error(error);
       throw Error('Failed' + error);
     }
  };
  export const InsertApproval = async (values: Object): Promise<string> => {
    try {
      // 
       //const UserID = await AsyncStorage.getItem('UserID');
       var uri = `${BASE_URL}/projectFlow/insert_approval_process`;
       //var uri = 'https://qms.digital.logicsoft.online:8081/gateway/dilip/upload-samplecollectionimages';
       const token = await AsyncStorage.getItem('Token');  
       console.log(uri);
       var payload = JSON.stringify(values);
       console.log(payload);
       var jsonResult = await PostAsync_with_token(uri, payload,token);
       //  
       //
       console.log(jsonResult);
       return JSON.stringify(jsonResult ?? '');
     } catch (error) {
       console.error(error);
       throw Error('Failed' + error);
     }
  };


  export const InsertSequence = async (values: Object): Promise<string> => {
    try {
      // 
       //const UserID = await AsyncStorage.getItem('UserID');
       var uri = `${BASE_URL}/utils/insert_sequence`;
       //var uri = 'https://qms.digital.logicsoft.online:8081/gateway/dilip/upload-samplecollectionimages';
       const token = await AsyncStorage.getItem('Token');  
       console.log(uri);
       var payload = JSON.stringify(values);
       console.log(payload);
       var jsonResult = await PostAsync_with_token(uri, payload,token);
       //  
       //
       console.log(jsonResult);
       return JSON.stringify(jsonResult ?? '');
     } catch (error) {
       console.error(error);
       throw Error('Failed' + error);
     }
  };


  export const GetHistory = async (query: object): Promise<string> => {
    try {
      const uri = `${BASE_URL}/projectflow/get_review_approval_process_history`;
  
      
      const projectId = query?.project_id;
      // Construct the full URL with query parameter
      const urlWithParams = `${uri}?project_id=${projectId}`;
  
      const token = await AsyncStorage.getItem('Token');
      console.log(urlWithParams);  // To verify the complete URL
  
      // Fetch data with token authorization
      const jsonResult = await GetAsync_with_token(urlWithParams, token);
  
      console.log("jsonResult from API:", jsonResult);
      
      return JSON.stringify(jsonResult ?? ''); 
    } catch (error) {
      console.error(error);
      throw Error('Failed to fetch history: ' + error);
    }
  };


  export const GetProjects = async (query:string): Promise<string> => {
    try {
      //debugger;
      //const UserID = await AsyncStorage.getItem('UserID');
      var uri = `${BASE_URL}/projectFlow/get_project_intake`;
      //var uri = 'http://qms.digital.logicsoft.online:8081/gateway/dilip/upload-samplecollectionimages';
      const token = await AsyncStorage.getItem('Token');
      console.log(uri);``
      var jsonResult = await GetAsync_with_token(uri, token);
      console.log(jsonResult);
      //debugger;
      console.log("jsonResult from API:", jsonResult);
      return JSON.stringify(jsonResult ?? '');
    } catch (error) {
      console.error(error);
      throw Error('Failed' + error);
    }
  };


  export const GetProjectApproval = async (query:string): Promise<string> => {
    try {
      //debugger;
      //const UserID = await AsyncStorage.getItem('UserID');
      var uri = `${BASE_URL}/projectFlow/get_review_approval_to_user_for_action`;
      //var uri = 'http://qms.digital.logicsoft.online:8081/gateway/dilip/upload-samplecollectionimages';
      const token = await AsyncStorage.getItem('Token');
      console.log(uri);``
      var jsonResult = await GetAsync_with_token(uri, token);
      console.log(jsonResult);
      //debugger;
      console.log("jsonResult from API:", jsonResult);
      return JSON.stringify(jsonResult ?? '');
    } catch (error) {
      console.error(error);
      throw Error('Failed' + error);
    }
  };


  export const UpdateProjectApproval = async (values: Object): Promise<string> => {
    try {
      // 
       //const UserID = await AsyncStorage.getItem('UserID');
       var uri = `${BASE_URL}/projectFlow/update_review_approval_process_status`;
       //var uri = 'https://qms.digital.logicsoft.online:8081/gateway/dilip/upload-samplecollectionimages';
       const token = await AsyncStorage.getItem('Token');  
       console.log(uri);
       var payload = JSON.stringify(values);
       console.log(payload);
       var jsonResult = await PostAsync_with_token(uri, payload,token);
       //  
       //
       console.log(jsonResult);
       return JSON.stringify(jsonResult ?? '');
     } catch (error) {
       console.error(error);
       throw Error('Failed' + error);
     }
  };
