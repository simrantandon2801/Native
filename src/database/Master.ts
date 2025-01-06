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
  


  export const fetchPriorities = async (query: string = ''): Promise<Priority[]> => {
    try {
      const uri = `${API_BASE_URL}/get_priorities`;
      const token = await AsyncStorage.getItem('Token');
      const jsonResult = await GetAsync_with_token(uri, token);
  
      const priorities = JSON.parse(jsonResult).map((item: any) => ({
        id: item.priority_id,
        value: item.priority_name,
        is_active: item.is_active
      }));
      return priorities;
    } catch (error) {
      console.error(error);
      throw Error('Failed to fetch priorities: ' + error);
    }
  };
  
  
  

  export const addPriority = async (values: Priority): Promise<string> => {
    console.log(values, "Adding/Editing priority");
   
    try {
      const uri = `${API_BASE_URL}/insert_priority`;
      const token = await AsyncStorage.getItem('Token');  
      console.log(uri);
  
      const apiPayload = {
        id: values.id,
        value: values.value,
        is_active: values.is_active   
      };
  
      const payload = JSON.stringify(apiPayload);
      console.log(payload);
      
      const jsonResult = await PostAsync_with_token(uri, payload, token);
      console.log(jsonResult, "API response");
      return JSON.stringify(jsonResult ?? '');
    } catch (error) {
      console.error(error);
      throw Error('Failed to add/edit priority: ' + error);
    }
  };
  

  
  export const updatePriority = async (values: Priority): Promise<string> => {
    console.log(values, "Updating priority")
     
    try {
      var uri = `${API_BASE_URL}/insert_priority`;
      const token = await AsyncStorage.getItem('Token');  
      console.log(uri);
  
      // Transform to match API field names
      const apiPayload = {
        priority_id: values.id,
        priority_name: values.value,
        is_active: values.is_active
      };
  
      var payload = JSON.stringify(apiPayload);
      console.log(payload);
      var jsonResult = await PostAsync_with_token(uri, payload, token);
      console.log(jsonResult, "API response");
      return JSON.stringify(jsonResult ?? '');
    } catch (error) {
      console.error(error);
      throw Error('Failed to update priority: ' + error);
    }
  };
  
  export async function deletePriority(priority: Priority): Promise<void> {
    await updatePriority({ ...priority, is_active: false });
  }
  
  