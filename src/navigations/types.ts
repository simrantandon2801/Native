export type RootStackParamList = {
    Login: undefined;  // The Login screen doesn't require any parameters
    Dashboard: { username: string };  // The Dashboard screen expects a 'username' parameter
  };