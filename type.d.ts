import type {NativeStackScreenProps} from '@react-navigation/native-stack';
interface Props {
  viewId?: string;
  navigationWorker: (worker: string) => void;
}
export type HomeStackNavigatorParamList = {
  LoginScreen: {};
  WelcomeScreen: {};
  Main: undefined;
  ManageList:{};
  ManageAss:{};
  Excel:{},
  SignupScreen:{},
ManageUsers:{}
};
export type HomeScreenNavigationProp =
  NativeStackScreenProps<AssignBoothManageSchedule>;

  declare module 'react-native-datepicker-dialog' {
    import { Component } from 'react';
    import { ViewStyle, TextStyle, TextInputProps } from 'react-native';
  
    export interface DatePickerDialogProps {
      date: string;
      onDateChange: (date: string) => void;
      mode?: 'date' | 'time';
      placeholder?: string;
      style?: ViewStyle;
      textStyle?: TextStyle;
      customStyles?: any;  // Adjust this if you need more specific styles
    }
  
    export default class DatePickerDialog extends Component<DatePickerDialogProps> {}
  }
