// Define the root stack navigator param list
export type RootStackParamList = {
  Login: undefined
  Dashboard: { username: string }
  MainDrawer: undefined
  Acknowledge: undefined;
  Acknowledgelist: undefined; 
  Accepted:undefined;
  Acceptedlist:undefined;
  Ongoing:undefined;
  Ongoinglist:undefined;
  Rejected:undefined;
  Rejectedlist:undefined
}

// Define the drawer navigator param list
export type DrawerParamList = {
  InspectionAccepted: undefined
  InspectionRejected: undefined
  InspectionAcknowledgment: undefined
}

// You might also want to declare the types for useNavigation hook
// declare global {
//   namespace ReactNavigation {
//     interface RootParamList extends RootStackParamList {}
//   }
// }

