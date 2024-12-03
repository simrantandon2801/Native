// 👇️ named export
export function sum(a, b) {
  return a + b;
}
//import AsyncStorage from '@react-native-async-storage/async-storage';
// 👇️ named export
export function multiply(a, b) {
  return a * b;
}
export const GetAsync_with_token = async (uri, Token) => {
  try {
    //console.log(Token);
    const response = await fetch(uri, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: Token,
      },
    });
    console.log(uri);
    console.log(response.status);
    const json = await response.json();
    console.log(json);
    return json;
  } catch (error) {
    console.error(error);
  }
};
export const GetAsync_with_token_X_UserID = async (uri, Token) => {
  try {
    //
    console.log(Token);
    //const x_auth_user_id = await AsyncStorage.getItem('x_auth_user_id');
    const response = await fetch(uri, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: Token,
        //'X-Auth-User-Id': x_auth_user_id,
      },
    });
    console.log(uri);
    console.log(response.status);
    const json = await response.json();
    console.log(json);
    return json;
  } catch (error) {
    console.error(error);
  }
};
export const PostAsync = async (uri, payload) => {
  try {
    //debugger;
    const response = await fetch(uri, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: payload,
    });
    //debugger;
    console.log('Login respo' + response);
    const json = await response.json();
    //console.log(json);
    return json;
  } catch (error) {
    //debugger;
    console.error(error);
  }
};
export const PostAsyncFile = async (uri, payload) => {
  try {
    const response = await fetch(uri, {
      method: 'POST',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
      body: payload,
    });

    // Check if the response is a file (based on content type)
    const contentType = response.headers.get('Content-Type');
    console.log('Content-Type:', contentType);
    if (contentType && contentType.includes('application/json')) {
      const json = await response.json();
      return json; // Return JSON data
    } else if (
      contentType &&
      contentType.includes(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      )
    ) {
      const blob = await response.blob();

      // Create a link element, use it to download the file
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;

      // Extract filename from Content-Disposition header, if available
      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = 'downloaded_file.xlsx';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
        );
        if (filenameMatch != null && filenameMatch[1]) {
          fileName = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      // Clean up and revoke the object URL
      link.remove();
      URL.revokeObjectURL(downloadUrl);

      return {success: true, message: 'File downloaded successfully'};
    } else {
      throw new Error('Unsupported content type');
    }
  } catch (error) {
    console.error('Error:', error);
    return {success: false, error: error.message};
  }
};
export const PostAsync_with_token = async (uri, payload, Token) => {
  try {
    console.log(Token);
    //const x_auth_user_id = await AsyncStorage.getItem('x_auth_user_id');
    const response = await fetch(uri, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: Token,
        //'X-Auth-User-Id': x_auth_user_id,
      },
      body: payload,
    });
    //console.log(response);
    const json = await response.json();
    //console.log(json);
    return json;
  } catch (error) {
    console.error(error);
  }
};
export const PutAsync_with_token = async (uri, payload, Token) => {
  try {
    //const x_auth_user_id = await AsyncStorage.getItem('x_auth_user_id');

    console.log(Token);
    const response = await fetch(uri, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: Token,
        //'X-Auth-User-Id': x_auth_user_id,
      },
      body: payload,
    });
    //console.log(response);
    const json = await response.json();
    //console.log(json);
    return json;
  } catch (error) {
    console.error(error);
  }
};
// 👇️ (arrow function)
// export const sum = (a, b) => {
//   return a + b;
// };

export const SubmitDetails1 = async (uri, payload) => {
  try {
    //
    const response = await fetch(uri, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: payload,
    }).then(response => {
      //
      console.log(response);
      console.log(response.message);
      if (response.status >= 200 && response.status <= 299) {
        const json = response.json();

        return json;
      } else {
        console.log('fsfsfs' + response.statusText);
      }
    });
  } catch (error) {
    console.error(error);
  }
};
export const SubmitDetails = async (uri, payload) => {
  return fetch(uri, {
    method: 'POST',
    headers: {
      Accept: 'application/text',
      'Content-Type': 'multipart/form-data',
    },
    body: payload,
  })
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .catch(function (error) {
      console.log(
        'There has been a problem with your fetch operation: ' + error.message,
      );
      // ADD THIS THROW error
      throw error;
    });

  // try {
  //     const response = await fetch(
  //         uri,{
  //             method: 'POST',
  //             headers: {
  //               Accept: 'application/text',
  //               'Content-Type': 'multipart/form-data'
  //             },
  //             body: payload
  //           }).then(async(response) => {
  //             console.log(response);

  //             if (response.status >= 200 && response.status <= 299) {
  //               const json = await response.json();

  //               return json;
  //             } else {
  //               console.log("fsfsfs"+response.statusText);
  //             }
  //           });

  //   } catch (error) {
  //     console.error(error);
  //   }
};
export const Post_Upload_with_token = async (uri, payload, Token) => {
  try {
    //
    console.log(Token);
    //const x_auth_user_id = await AsyncStorage.getItem('x_auth_user_id');
    const response = await fetch(uri, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: Token,
        //'X-Auth-User-Id': x_auth_user_id,
      },
      body: payload,
    });
    //console.log(response);
    const json = await response.json();
    //console.log(json);
    return json;
  } catch (error) {
    console.error(error);
  }
};
