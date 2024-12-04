import type {NativeStackScreenProps} from '@react-navigation/native-stack';
interface Props {
  viewId?: string;
  navigationWorker: (worker: string) => void;
}
export type HomeStackNavigatorParamList = {
  LoginScreen: {};
  WelcomeScreen: {};
  Main: undefined;
};
export type HomeScreenNavigationProp =
  NativeStackScreenProps<AssignBoothManageSchedule>;
