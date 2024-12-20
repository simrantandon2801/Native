import AsyncStorage from '@react-native-async-storage/async-storage';
import {decodeBase64} from './securedata';

// Assuming decodeBase64 is a utility function you've created or imported elsewhere


export const getCustomerId = async () => {
  try {
    const localcustomerID = await AsyncStorage.getItem('Customer_ID');
    const decodedCustomerID = decodeBase64(localcustomerID || '');
    console.log('Your Customer ID is ', decodedCustomerID);
    return decodedCustomerID;  // Assuming setCustomerID is passed to the function
  } catch (err) {
    console.log('Error fetching the customerID', err);
  }
};