import RNFetchBlob from 'rn-fetch-blob';
import { BASE_URL } from '@env';

const { config } = RNFetchBlob;



const fetchData = async () => {
  try {
    const url = `${BASE_URL}/gateway/officer/common/signup/getmobileappversiondetails`;

    const options = {
      trusty: false, // DO NOT use `true` in production
      sslPinning: {
        certs: ['cert'], // The name of the `.cer` file (without extension)
      },
      method: 'GET', // Correcting method to GET
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await config(options).fetch('GET', url);
    const data = await response.json();

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export default fetchData;
