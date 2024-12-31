import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetAsync_with_token, PostAsync, PostAsync_with_token } from "../services/rest_api_service";
import { BASE_URL } from "@env"; // Replace with your actual base URL

export const deleteClassification = async (classificationId: number): Promise<any> => {
  try {
    const uri = `${BASE_URL}/utils/delete_classification`;
    const token = await AsyncStorage.getItem('Token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('Delete URI:', uri);
    
    const payload = JSON.stringify({ classification_id: classificationId });
    console.log('Delete Payload:', payload);
    
    const jsonResult = await PostAsync_with_token(uri, payload, token);
    console.log('Delete API Response:', jsonResult); // Fixed typo here

    return jsonResult; // Return the raw result, let the caller stringify if needed
  } catch (error) {
    console.error('Error in deleteClassification:', error);
    throw error; // Rethrow the original error
  }
};
export const AddAndEditClassification = async (values: {
    classification_id: number;
    classification_name: string;
    is_active: boolean;
  }): Promise<string> => {
    console.log(values, "Adding/Editing classification")
   
    try {
      var uri = `${BASE_URL}/utils/insert_classification`;
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
  export const GetClasssifcation = async (query:string): Promise<string> => {
    try {
      //debugger;
      //const UserID = await AsyncStorage.getItem('UserID');
      var uri = `${BASE_URL}/utils/get_classifications`;
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
