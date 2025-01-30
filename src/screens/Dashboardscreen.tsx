import type React from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import Accepted from "./Accepted"
import Rejected from "./Rejected"
import OngoingInspection from "./OngoingInspection"
import Acknowledge from "./Acknowledge"
import BottomTabNavigator from "../BottomTabs/BottomTabnavi"

const DashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.row}>
        <Acknowledge/>
        <Accepted />
      </View>
      <View style={styles.row1}>
        <Rejected />
        <OngoingInspection />
      </View>
    {/* <BottomTabNavigator/> */}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
  },
  row1: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop:-30,
    paddingLeft:10,paddingRight:20
  
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft:10,
    paddingRight:20
    // marginTop:-30,
 
  },
})

export default DashboardScreen

