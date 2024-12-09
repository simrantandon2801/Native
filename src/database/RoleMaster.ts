import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetAsync_with_token, PostAsync, PostAsync_with_token } from "../services/rest_api_service";
export const BASE_URL = 'https://underbuiltapi.aadhidigital.com';

  export const AddAndEditRole = async (values: Object): Promise<string> => {
    console.log(values,"ap vay")
   
    try {
      // 
       //const UserID = await AsyncStorage.getItem('UserID');
       var uri = 'https://underbuiltapi.aadhidigital.com/master/insert_roles';
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
 