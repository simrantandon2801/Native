import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';

interface GlobalModalProps {
  visible: boolean; // Modal visibility
  text: string; // Text to display in the modal
  onClose: () => void; // Function to close the modal
  navigation?: { navigate: (screen: string) => void }; // Optional navigation object
  targetScreen?: string; // Optional target screen name
}

const GlobalModal: React.FC<GlobalModalProps> = ({
  visible,
  text,
  onClose,
  navigation,
  targetScreen,
}) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose} // Handles back button press
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{text}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={(event: GestureResponderEvent) => {
              if (navigation && targetScreen) {
                navigation.navigate(targetScreen); // Navigate to the target screen
              }
              onClose(); // Close the modal
            }}
          >
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default GlobalModal;
