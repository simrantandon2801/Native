import AsyncStorage from '@react-native-async-storage/async-storage';
import { GetAsync_with_token, PostAsync, PostAsync_with_token } from "../services/rest_api_service";
import { Priority } from './Master';

import { BASE_URL } from "@env";

export interface RaidData {
  raid_id: number;
  project_id: number;
  type: string;
  title: string;
  driver: string;
  description: string;
  impact: string;
  status: string;
  next_status: string;
  priority: number;
  due_date: string;
  raid_owner: number;
  is_active: boolean;
}

export const GetRaids = async (projectId: number): Promise<string> => {
  try {
    const uri = `${BASE_URL}/approvedProjects/get_raid?project_id=${projectId}`;
    const token = await AsyncStorage.getItem('Token');
    console.log(uri);
    const jsonResult = await GetAsync_with_token(uri, token);
    console.log(jsonResult);
    return JSON.stringify(jsonResult ?? '');
  } catch (error) {
    console.error(error);
    throw Error('Failed to get RAIDs: ' + error);
  }
};

export const InsertRaid = async (values: RaidData): Promise<string> => {
  try {
    const uri = `${BASE_URL}/approvedProjects/insert_raid`;
    const token = await AsyncStorage.getItem('Token');
    console.log(uri);
    const payload = JSON.stringify(values);
    console.log(payload);
    const jsonResult = await PostAsync_with_token(uri, payload, token);
    console.log(jsonResult);
    return JSON.stringify(jsonResult ?? '');
  } catch (error) {
    console.error(error);
    throw Error('Failed to insert RAID: ' + error);
  }
};

export const DeleteRaid = async (raidId: number): Promise<string> => {
  try {
    const uri = `${BASE_URL}/approvedProjects/delete_raid`; 
    const token = await AsyncStorage.getItem('Token');
    console.log(uri);
    const payload = JSON.stringify({ raid_id: raidId });
    console.log(payload);
    const jsonResult = await PostAsync_with_token(uri, payload, token);
    console.log(jsonResult);
    return JSON.stringify(jsonResult ?? '');
  } catch (error) {
    console.error(error);
    throw Error('Failed to delete RAID: ' + error);
  }
};
export const fetchPriorities = async (query: string = ''): Promise<Priority[]> => {
    try {
      const uri = `${BASE_URL}/utils/get_priorities`;
      const token = await AsyncStorage.getItem('Token');
      const jsonResult = await GetAsync_with_token(uri, token);
  
      const priorities = JSON.parse(jsonResult).map((item: any) => ({
        id: item.priority.id,
        value: item.priority_name,
        is_active: item.is_active
      }));
      return priorities;
    } catch (error) {
      console.error(error);
      throw Error('Failed to fetch priorities: ' + error);
    }
  };

