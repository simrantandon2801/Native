import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetAsync_with_token, PostAsync, PostAsync_with_token } from "../services/rest_api_service";
//export const BASE_URL = 'https://underbuiltapi.aadhidigital.com';
import { BASE_URL } from "@env";


export const GetApprovedProjects = async (query:string): Promise<string> => {
    try {
      //debugger;
      //const UserID = await AsyncStorage.getItem('UserID');
      var uri = `${BASE_URL}/projectFlow/get_approved_project`;
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


  export const GetApprovedProjectsWithFilters = async (filters: {
    status?: string;
    budget?: string;
    project_manager?: string;
    project_owner_user?: string;
    project_owner_dept?: string;
    goal_id?: string;
    golive_date?: string;
  }): Promise<string> => {
    try {
      let uri = `${BASE_URL}/projectFlow/get_approved_project`;
  
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