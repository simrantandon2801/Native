import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetAsync_with_token, PostAsync, PostAsync_with_token } from "../services/rest_api_service";
import { BASE_URL } from "@env";
//export const BASE_URL = 'https://underbuiltapi.aadhidigital.com';

  export const AddAndEditRole = async (values: Object): Promise<string> => {
    console.log(values,"ap vay")
   
    try {
      // 
       //const UserID = await AsyncStorage.getItem('UserID');
       var uri = `${BASE_URL}/master/insert_roles`;
       //var uri = 'http://qms.digital.logicsoft.online:8081/gateway/dilip/upload-samplecollectionimages';
       const token = await AsyncStorage.getItem('Token');  
       console.log(uri);
       var payload = JSON.stringify(values);
       console.log(payload);
       var jsonResult = await PostAsync_with_token(uri, payload,token);
       //  
       //
       console.log(jsonResult,"api");
       return JSON.stringify(jsonResult ?? '');
     } catch (error) {
       console.error(error);
       throw Error('Failed' + error);
     }
  };

  export const DeleteRole = async (roleId: number): Promise<string> => {
    console.log(`Deleting role with ID: ${roleId}`);
    try {
      const uri = `${BASE_URL}/master/delete_roles`
      const token = await AsyncStorage.getItem('Token');
      
      // Create payload with role_id
      const payload = JSON.stringify({ role_id: roleId });
      console.log(`Payload: ${payload}`);
  
      // Make the API call to delete the role using the token for authorization
      const jsonResult = await PostAsync_with_token(uri, payload, token);
      console.log('Delete API response:', jsonResult);
  
      return JSON.stringify(jsonResult ?? '');
    } catch (error) {
      console.error('Error in Delete API:', error);
      throw new Error('Failed to delete role: ' + error);
    }
  };

