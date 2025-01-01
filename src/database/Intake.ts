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
      // const uri = `${BASE_URL}/projectflow/get_review_approval_process_history`;
      const uri = `${BASE_URL}/projectFlow/get_project_history`;
  
      
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
    //  console.log("jsonResult from API:", jsonResult);
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
      //console.log("jsonResult from API:", jsonResult);
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
  export const GetBudgetCategories = async (query:string): Promise<string> => {
    try {
      //debugger;
      //const UserID = await AsyncStorage.getItem('UserID');
      var uri = `${BASE_URL}/utils/get_budget_categories`;
      //var uri = 'http://qms.digital.logicsoft.online:8081/gateway/dilip/upload-samplecollectionimages';
      const token = await AsyncStorage.getItem('Token');
     // console.log(uri);``
      var jsonResult = await GetAsync_with_token(uri, token);
     // console.log(jsonResult);
      //debugger;
      //console.log("jsonResult from API:", jsonResult);
      return JSON.stringify(jsonResult ?? '');
    } catch (error) {
      console.error(error);
      throw Error('Failed' + error);
    }
  };

  export const GetBudgetSubCategories = async (query:string): Promise<string> => {
    try {
      //debugger;
      //const UserID = await AsyncStorage.getItem('UserID');
      var uri = `${BASE_URL}/utils/get_budget_subcategories?category_id=${query}`;
      //var uri = 'http://qms.digital.logicsoft.online:8081/gateway/dilip/upload-samplecollectionimages';
      const token = await AsyncStorage.getItem('Token');
      //console.log(uri);``
      var jsonResult = await GetAsync_with_token(uri, token);
      //console.log(jsonResult);
      //debugger;
     // console.log("jsonResult from API:", jsonResult);
      return JSON.stringify(jsonResult ?? '');
    } catch (error) {
      console.error(error);
      throw Error('Failed' + error);
    }
  };
  export const GetBudgetDetails = async (query:string): Promise<string> => {
    try {
      //debugger;
      //const UserID = await AsyncStorage.getItem('UserID');
      var uri = `${BASE_URL}/utils/get_budget_details?project_id=${query}`;
      //var uri = 'http://qms.digital.logicsoft.online:8081/gateway/dilip/upload-samplecollectionimages';
      const token = await AsyncStorage.getItem('Token');
      //console.log(uri);``
      var jsonResult = await GetAsync_with_token(uri, token);
      //console.log(jsonResult);
      //debugger;
     // console.log("jsonResult from API:", jsonResult);
      return JSON.stringify(jsonResult ?? '');
    } catch (error) {
      console.error(error);
      throw Error('Failed' + error);
    }
  };

  export const InsertBudgetDetails = async (values: Object): Promise<string> => {
    try {
      // 
       //const UserID = await AsyncStorage.getItem('UserID');
       var uri = `${BASE_URL}/utils/insert_budget_details`;
       //var uri = 'https://qms.digital.logicsoft.online:8081/gateway/dilip/upload-samplecollectionimages';
       const token = await AsyncStorage.getItem('Token');  
       var payload = JSON.stringify(values);
       var jsonResult = await PostAsync_with_token(uri, payload,token);
       return JSON.stringify(jsonResult ?? '');
     } catch (error) {
       console.error(error);
       throw Error('Failed' + error);
     }
  };

  export const DeleteBudgetDetail  = async (values: Object): Promise<string> => {
    try {
      // 
       //const UserID = await AsyncStorage.getItem('UserID');
       var uri = `${BASE_URL}/utils/delete_budget_detail`;
       //var uri = 'https://qms.digital.logicsoft.online:8081/gateway/dilip/upload-samplecollectionimages';
       const token = await AsyncStorage.getItem('Token');  
       //console.log(uri);
       var payload = JSON.stringify(values);
      // console.log(payload);
       var jsonResult = await PostAsync_with_token(uri, payload,token);
       return JSON.stringify(jsonResult ?? '');
     } catch (error) {
       console.error(error);
       throw Error('Failed' + error);
     }
  };

  // const filters = {
  //   status: "1,2",           // multiple statuses
  //   budget: "123",
  //   project_manager: "1,2,3" // multiple project managers
  // };  // Example filters object
  export const GetProjectsWithFilters = async (filters: {
    status?: string;
    budget?: string;
    project_manager?: string;
    project_owner_user?: string;
    project_owner_dept?: string;
    goal_id?: string;
    golive_date?: string;
  }): Promise<string> => {
    try {
      let uri = `${BASE_URL}/projectFlow/get_project_intake`;
  
      // Build the query string dynamically from the filters object
      const queryParams = new URLSearchParams();
  
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.budget) queryParams.append('budget', filters.budget);
      if (filters.project_manager) queryParams.append('project_manager', filters.project_manager); 
      if (filters.project_owner_user) queryParams.append('project_owner_user', filters.project_owner_user); 
      if (filters.project_owner_dept) queryParams.append('project_owner_dept', filters.project_owner_dept); 
      if (filters.goal_id) queryParams.append('goal_id', filters.goal_id); 
      if (filters.golive_date) queryParams.append('golive_date', filters.golive_date); 
  
      // Append the query string to the base URL
      uri += `?${queryParams.toString()}`;
  
      const token = await AsyncStorage.getItem('Token');
      console.log("Making API call to:", uri);
  
      // Make the API request with the token
      const jsonResult = await GetAsync_with_token(uri, token);
      console.log("jsonResult:", jsonResult);
  
      return JSON.stringify(jsonResult ?? '');
    } catch (error) {
      console.error('Error in GetProjects API call:', error);
      throw Error('Failed to fetch projects: ' + error);
    }
  };
  

  
  export const GetImpactedApplication = async (query:string): Promise<string> => {
    try {
      
      var uri = `${BASE_URL}/utils/get_impacted_applications/`;
      
      const token = await AsyncStorage.getItem('Token');
      
      var jsonResult = await GetAsync_with_token(uri, token);
      
      //debugger;
     // console.log("jsonResult from API:", jsonResult);
      return JSON.stringify(jsonResult ?? '');
    } catch (error) {
      console.error(error);
      throw Error('Failed' + error);
    }
  };
