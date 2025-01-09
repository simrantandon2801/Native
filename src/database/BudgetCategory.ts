import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetAsync_with_token, PostAsync, PostAsync_with_token } from "../services/rest_api_service";
import { BASE_URL } from "@env"; // Replace with your actual base URL

export interface BudgetCategoryData {
   category_id: number;
    category_name: string;
    sub_category_id: number;
    sub_category_name: string;
  }
  
  export const insertOrUpdateBudget = async (data: BudgetCategoryData): Promise<string> => {
    console.log(data, "Inserting/Updating budget category");
  
    try {
      const uri = `${BASE_URL}/utils/insert_or_update_budget`;
      const token = await AsyncStorage.getItem('Token');
      console.log(uri);
  
      const payload = JSON.stringify(data);
      console.log(payload);
  
      const jsonResult = await PostAsync_with_token(uri, payload, token);
      console.log(jsonResult, "API response");
  
      return JSON.stringify(jsonResult ?? '');
    } catch (error) {
      console.error('Error inserting or updating budget:', error);
      throw new Error('Failed to insert or update budget: ' + error);
    }
  };
  export const insertForgeBudgetCategory = async (data: BudgetCategoryData): Promise<string> => {
    console.log(data, "Inserting budget category to Forge API");
  
    try {
      const uri = `${BASE_URL}/utils/insert_budget_category`;
      const token = await AsyncStorage.getItem('Token');
      console.log(uri);
  
      const payload = JSON.stringify({
        category_name: data.category_name
      });
      console.log(payload);
  
      const jsonResult = await PostAsync_with_token(uri, payload, token);
      console.log(jsonResult, "Forge API response");
  
      return JSON.stringify(jsonResult ?? '');
    } catch (error) {
      console.error('Error inserting budget category to Forge API:', error);
      throw new Error('Failed to insert budget category to Forge API: ' + error);
    }
  };
  