import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetAsync_with_token, PostAsync, PostAsync_with_token } from "../services/rest_api_service";

export const GetUsers = async (query:string): Promise<string> => {
  try {
    //debugger;
    //const UserID = await AsyncStorage.getItem('UserID');
    var uri = 'https://underbuiltapi.aadhidigital.com/master/get_users';
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
export const GetUserRole = async (query:string): Promise<string> => {
  try {
    //debugger;
    //const UserID = await AsyncStorage.getItem('UserID');
    var uri = 'https://underbuiltapi.aadhidigital.com/master/get_user_role';
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
export const GetAllRoles = async (query:string): Promise<string> => {
  try {
    //debugger;
    //const UserID = await AsyncStorage.getItem('UserID');
    var uri = 'https://underbuiltapi.aadhidigital.com/master/get_roles';
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
export const addUser  = async (values: Object): Promise<string> => {
  try {
    // 
     //const UserID = await AsyncStorage.getItem('UserID');
     var uri = `https://underbuiltapi.aadhidigital.com/master/insert_users_with_role`;
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
export const DeleteUser = async (values: Object): Promise<string> => {
   
  try {
    // 
     //const UserID = await AsyncStorage.getItem('UserID');
     var uri = 'https://underbuiltapi.aadhidigital.com/master/delete_users';
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
export const GetUserPermission = async (query:string): Promise<string> => {
  try {
    //debugger;
    //const UserID = await AsyncStorage.getItem('UserID');
    var uri = `https://underbuiltapi.aadhidigital.com/master/get_user_permissions?user_id=${query}`;
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
  export const updateUserPermissions  = async (values: Object): Promise<string> => { 
    try {
      // 
       //const UserID = await AsyncStorage.getItem('UserID');
       var uri = `https://underbuiltapi.aadhidigital.com/master/update_multiple_user_permissions`;
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
  export const fetchModules = async (query:string): Promise<string> => {
    try {
      //debugger;
      //const UserID = await AsyncStorage.getItem('UserID');
      var uri = `https://underbuiltapi.aadhidigital.com//master/get_modules${query}`;
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
  export const addmodule  = async (values: Object): Promise<string> => {
   
    try {
      // 
       //const UserID = await AsyncStorage.getItem('UserID');
       var uri = `https://underbuiltapi.aadhidigital.com//master/insert_modules`;
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
  export const GetRolePermission = async (query:string): Promise<string> => {
    try {
      //debugger;
      //const UserID = await AsyncStorage.getItem('UserID');
      var uri = `https://underbuiltapi.aadhidigital.com/master/get_role_permissions?role_id=${query}` ;
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
  export const GetAllPermission = async (query:string): Promise<string> => {
    try {
      //debugger;
      //const UserID = await AsyncStorage.getItem('UserID');
      var uri = 'https://underbuiltapi.aadhidigital.com/master/get_role_permissions';
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

  export const updateRolePermissions  = async (values: Object): Promise<string> => { 
    try {
      // 
       //const UserID = await AsyncStorage.getItem('UserID');
       var uri = `https://underbuiltapi.aadhidigital.com/master/update_multiple_role_permissions`;
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


  export const GetZoneData = async (query:string): Promise<string> => {
    try {
      //debugger;
      //const UserID = await AsyncStorage.getItem('UserID');
      var uri = 'https://underbuiltapi.aadhidigital.com/GetMasters/ZoneList';
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
  export const GetZoneProcessingList = async (query:string): Promise<string> => {
    try {
      //debugger;
      //const UserID = await AsyncStorage.getItem('UserID');
      var uri = 'https://underbuiltapi.aadhidigital.com/ManageZoneRegulation/ZoneProcessing';
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
  export const GetPropertyType = async (query:string): Promise<string> => {
    try {
      //debugger;
      //const UserID = await AsyncStorage.getItem('UserID');
      var uri = 'https://underbuiltapi.aadhidigital.com/GetMasters/PropertyTypeList';
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
  export const GetBuildType = async (query:string): Promise<string> => {
    try {
      //debugger;
      //const UserID = await AsyncStorage.getItem('UserID');
      var uri = 'https://underbuiltapi.aadhidigital.com/GetMasters/BuildTypeList';
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
  export const GetRegulationData = async (query:string): Promise<string> => {
    try {
      //debugger;
      //const UserID = await AsyncStorage.getItem('UserID');
      var uri = 'https://underbuiltapi.aadhidigital.com/GetMasters/RegulationAppliesToList';
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
  export const fetchPropertyType = async (query:string): Promise<string> => {
    try {
      //debugger;
      //const UserID = await AsyncStorage.getItem('UserID');
      var uri = 'https://underbuiltapi.aadhidigital.com/GetMasters/PropertyTypeList/' + query;
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
  export const GetNeighborData = async (query:string): Promise<string> => {
    try {
      //debugger;
      //const UserID = await AsyncStorage.getItem('UserID');
      var uri = 'https://underbuiltapi.aadhidigital.com/GetMasters/neighborList?nhotypeid=' + query;
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
  export const create_Zone = async (values: Object): Promise<string> => {
   
    try {
      // 
       //const UserID = await AsyncStorage.getItem('UserID');
       var uri = 'https://underbuiltapi.aadhidigital.com/ManageZoneRegulation/CreateNewZone';
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
  export const GetZoneProcessing = async (query:string): Promise<string> => {
    try {
      //debugger;
      //const UserID = await AsyncStorage.getItem('UserID');
      var uri = 'https://underbuiltapi.aadhidigital.com/ManageZoneRegulation/ZoneProcessing?zone_rglns_code=' + query;
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
  export const create_MinimumBuild = async (values: Object): Promise<string> => {
   
    try {
      // 
       //const UserID = await AsyncStorage.getItem('UserID');
       var uri = 'https://underbuiltapi.aadhidigital.com/ManageZoneRegulation/CreateMinimumBuild';
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
  export const create_MaximumBuild = async (values: Object): Promise<string> => {
   
    try {
      // 
       //const UserID = await AsyncStorage.getItem('UserID');
       var uri = 'https://underbuiltapi.aadhidigital.com/ManageZoneRegulation/CreateMaxBuildAdu';
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
  export const create_MaximumBuildRangePercent = async (values: string): Promise<string> => {
   
    try {
      // 
       //const UserID = await AsyncStorage.getItem('UserID');
       var uri = 'https://underbuiltapi.aadhidigital.com/ManageZoneRegulation//CreateMaxBuildAduSqftRange';
       //var uri = 'https://qms.digital.logicsoft.online:8081/gateway/dilip/upload-samplecollectionimages';
       const token = await AsyncStorage.getItem('Token');  
       console.log(uri);
       var payload = JSON.stringify(values);
       console.log(payload);
       var jsonResult = await PostAsync_with_token(uri, values,token);
       //  
       //
       console.log(jsonResult);
       return JSON.stringify(jsonResult ?? '');
     } catch (error) {
       console.error(error);
       throw Error('Failed' + error);
     }
  };
  export const DeleteMaxBuildAdu = async (values: Object): Promise<string> => {
   
    try {
      // 
       //const UserID = await AsyncStorage.getItem('UserID');
       var uri = 'https://underbuiltapi.aadhidigital.com/ManageZoneRegulation/DeleteMaxBuildAdu';
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
  export const DeleteZonalProcessing = async (values: Object): Promise<string> => {
   
    try {
      // 
       //const UserID = await AsyncStorage.getItem('UserID');
       var uri = 'https://underbuiltapi.aadhidigital.com/ManageZoneRegulation/DeleteNewZone';
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
  export const GetmaximumBuild = async (query:string): Promise<string> => {
    try {
      //debugger;
      //const UserID = await AsyncStorage.getItem('UserID');
      var uri = 'https://underbuiltapi.aadhidigital.com/ManageZoneRegulation/ViewMaxBuildAdu?zone_rglns_code=' + query;
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
  export const fetchSubmissionsDataTable = async (query:string,val:string): Promise<string> => {
    try {
      //debugger;
      //const UserID = await AsyncStorage.getItem('UserID');
      var uri = 'https://underbuiltapi.aadhidigital.com/ManageZoneRegulation/ViewMaxBuildAduSqftRange?zone_rglns_code=' + query + '&max_build_id=' + val;
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
  
  export const GetminimumBuild = async (query:string): Promise<string> => {
    try {
      //debugger;
      //const UserID = await AsyncStorage.getItem('UserID');
      var uri = 'https://underbuiltapi.aadhidigital.com/ManageZoneRegulation/ViewMinimumBuild?zone_rglns_code=' + query;
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

  export const CreateParkingBasementDetails = async (values: string): Promise<string> => {
   
    try {
      // 
       //const UserID = await AsyncStorage.getItem('UserID');
       var uri = 'https://underbuiltapi.aadhidigital.com/ManageZoneRegulation//CreateMaxBuildAduSqftRange';
       //var uri = 'https://qms.digital.logicsoft.online:8081/gateway/dilip/upload-samplecollectionimages';
       const token = await AsyncStorage.getItem('Token');  
       console.log(uri);
       var payload = JSON.stringify(values);
       console.log(payload);
       var jsonResult = await PostAsync_with_token(uri, values,token);
       //  
       //
       console.log(jsonResult);
       return JSON.stringify(jsonResult ?? '');
     } catch (error) {
       console.error(error);
       throw Error('Failed' + error);
     }
  };
  export const ViewParkBaseOthers = async (query:string): Promise<string> => {
    try {
      //debugger;
      //const UserID = await AsyncStorage.getItem('UserID');
      var uri = 'https://underbuiltapi.aadhidigital.com/ManageZoneRegulation/ViewParkBaseOthers?zone_rglns_code=' + query;
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