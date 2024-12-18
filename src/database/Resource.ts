import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetAsync_with_token, PostAsync, PostAsync_with_token } from "../services/rest_api_service";

  import { BASE_URL } from "@env";
export const GetResources = async (query:string): Promise<string> => {
    try {
      //debugger;
      //const UserID = await AsyncStorage.getItem('UserID');
      var uri = `${BASE_URL}/customeradmin/get_resources_including_users`;
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
  
  export const GetResourceType = async (query:string): Promise<string> => {
    try {
      //debugger;
      //const UserID = await AsyncStorage.getItem('UserID');
      var uri = `${BASE_URL}/customeradmin/get_resource_types`;
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

  export const AddResource  = async (values: Object): Promise<string> => {
    try {
      // 
       //const UserID = await AsyncStorage.getItem('UserID');
       var uri = `${BASE_URL}/customeradmin/insert_resource`;
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
  
  export const DeleteResource = async (values: Object): Promise<string> => {
     
    try {
      // 
       //const UserID = await AsyncStorage.getItem('UserID');
       var uri = `${BASE_URL}/customeradmin/delete_resource`;
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
  
    // export const GetUsers = async (query:string): Promise<string> => {
  //   try {
  //     //debugger;
  //     //const UserID = await AsyncStorage.getItem('UserID');
  //     var uri = 'https://underbuiltapi.aadhidigital.com/master/get_users';
  //     //var uri = 'http://qms.digital.logicsoft.online:8081/gateway/dilip/upload-samplecollectionimages';
  //     const token = await AsyncStorage.getItem('Token');
  //     console.log(uri);
  //     var jsonResult = await GetAsync_with_token(uri, token);
  //     console.log(jsonResult);
  //     //debugger;
  //     return JSON.stringify(jsonResult ?? '');
  //   } catch (error) {
  //     console.error(error);
  //     throw Error('Failed' + error);
  //   }
  // };
  
  export const GetAdIntegration = async (query:string): Promise<string> => {
      try {
        //debugger;
        //const UserID = await AsyncStorage.getItem('UserID');
        var uri = 'https://underbuiltapi.aadhidigital.com/integration/get_users';
        //var uri = 'https://qms.digital.logicsoft.online:8081/gateway/dilip/upload-samplecollectionimages';
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
  export const GetUserDept = async (query:string): Promise<string> => {
      try {
        //debugger;
        //const UserID = await AsyncStorage.getItem('UserID');
        var uri = 'https://underbuiltapi.aadhidigital.com/master/get_department';
        //var uri = 'https://qms.digital.logicsoft.online:8081/gateway/dilip/upload-samplecollectionimages';
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
  
    export const updateMultipleUsersDepartment  = async (values: Object): Promise<string> => {
     
      try {
        // 
         //const UserID = await AsyncStorage.getItem('UserID');
         var uri = `https://underbuiltapi.aadhidigital.com/customeradmin/update_user_department`;
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
    export const updateMultipleUsersRole  = async (values: Object): Promise<string> => {
     
      try {
        // 
         //const UserID = await AsyncStorage.getItem('UserID');
         var uri = `https://underbuiltapi.aadhidigital.com/customeradmin/update_user_role`;
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
    export const DeleteMultipleUsers  = async (values: Object): Promise<string> => {
     
      try {
        // 
         //const UserID = await AsyncStorage.getItem('UserID');
         var uri = `https://underbuiltapi.aadhidigital.com/master/delete_users`;
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