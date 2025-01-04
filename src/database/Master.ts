import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetAsync_with_token, PostAsync, PostAsync_with_token } from "../services/rest_api_service";

export interface Priority {
    id: number;
    value: string;
    is_active: boolean;
  }
  
  export interface NewPriority {
    id: number;
    value: string;
    is_active: boolean;
  }
  
  export type SortOrder = 'asc' | 'desc';
  
  const API_BASE_URL = 'https://underbuiltapi.aadhidigital.com/utils';
  



  export const fetchPriorities = async (query:string): Promise<string> => {
    try {
      //debugger;
      //const UserID = await AsyncStorage.getItem('UserID');
    //   let customerId = await getCustomerId();
      var uri = `${API_BASE_URL}/get_priorities`;
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
  

  export const addPriority = async (values: {
    classification_id: number;
    classification_name: string;
    is_active: boolean;
  }): Promise<string> => {
    console.log(values, "Adding/Editing classification")
   
    try {
      var uri = `${API_BASE_URL}/insert_priority`;
      const token = await AsyncStorage.getItem('Token');  
      console.log(uri);
      var payload = JSON.stringify(values);
      console.log(payload);
      var jsonResult = await PostAsync_with_token(uri, payload, token);
      console.log(jsonResult, "API response");
      return JSON.stringify(jsonResult ?? '');
    } catch (error) {
      console.error(error);
      throw Error('Failed to add/edit classification: ' + error);
    }
  };
  

  
  export const updatePriority = async (values: {
    classification_id: number;
    classification_name: string;
    is_active: boolean;
  }): Promise<string> => {
    console.log(values, "Adding/Editing classification")
   
    try {
      var uri = `${API_BASE_URL}/insert_priority`;
      const token = await AsyncStorage.getItem('Token');  
      console.log(uri);
      var payload = JSON.stringify(values);
      console.log(payload);
      var jsonResult = await PostAsync_with_token(uri, payload, token);
      console.log(jsonResult, "API response");
      return JSON.stringify(jsonResult ?? '');
    } catch (error) {
      console.error(error);
      throw Error('Failed to add/edit classification: ' + error);
    }
  };
  
  export async function deletePriority(priority: Priority): Promise<void> {
    await updatePriority({ ...priority, is_active: false });
  }
  
  