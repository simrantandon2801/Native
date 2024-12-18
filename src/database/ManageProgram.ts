import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetAsync_with_token, PostAsync, PostAsync_with_token } from "../services/rest_api_service";
import { BASE_URL } from "@env";

export const GetPrograms = async (query:string): Promise<string> => {
    try {
      //debugger;
      //const UserID = await AsyncStorage.getItem('UserID');
      var uri = `${BASE_URL}/utils/get_programs`;
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



  export const InsertProgram  = async (values: Object): Promise<string> => {
    try {
      // 
       //const UserID = await AsyncStorage.getItem('UserID');
       var uri = `${BASE_URL}/utils/insert_program`;
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


  export const DeleteProgram  = async (values: Object): Promise<string> => {
    try {
      // 
       //const UserID = await AsyncStorage.getItem('UserID');
       var uri = `${BASE_URL}/utils/delete_program`;
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