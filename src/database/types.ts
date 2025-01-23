export interface LoginResponse {
    accessToken: string;
    userId: number;
    username: string;
    // Add any other fields returned by your login API
  }export interface User {
    name: string
    email: string
    id: string
  }