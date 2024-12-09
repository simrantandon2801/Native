import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetAsync_with_token, PostAsync, PostAsync_with_token } from "../services/rest_api_service";
export const BASE_URL = 'https://underbuiltapi.aadhidigital.com';


  export const GetDepartments = async (query:string): Promise<string> => {
    try {
      debugger;
      //const UserID = await AsyncStorage.getItem('UserID');
      var uri = 'https://underbuiltapi.aadhidigital.com/master/get_department?parent_department_id='+query;
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
  