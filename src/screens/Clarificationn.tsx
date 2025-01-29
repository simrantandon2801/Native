import type React from "react"
import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native"

const Clarification: React.FC = () => {
  const [activeButton, setActiveButton] = useState<number>(1) // Default to first button active

  const handlePress = (buttonIndex: number) => {
    setActiveButton(buttonIndex)
    console.log(`Button ${buttonIndex}`)
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, activeButton === 1 ? styles.activeButton : styles.inactiveButton]}
          onPress={() => handlePress(1)}
        >
          <Text style={[styles.buttonText, activeButton === 1 ? styles.activeButtonText : styles.inactiveButtonText]}>
            Clarification from ongoing inspection bin 1
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, activeButton === 2 ? styles.activeButton : styles.inactiveButton]}
          onPress={() => handlePress(2)}
        >
          <Text style={[styles.buttonText, activeButton === 2 ? styles.activeButtonText : styles.inactiveButtonText]}>
            Clarification from scrutinize inspection bin
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#f5f5f5",
    marginTop: 50,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    flexWrap: "nowrap",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    width: Dimensions.get("window").width * 0.45,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderStyle: "solid",
  },
  activeButton: {
    backgroundColor: "#0056b3",
    borderColor: "#0056b3",
  },
  inactiveButton: {
    backgroundColor: "white",
    borderColor: "#0056b3",
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  activeButtonText: {
    color: "white",
  },
  inactiveButtonText: {
    color: "#0056b3",
  },
})

export default Clarification