import React from 'react';
import { StyleSheet } from 'react-native';
import { Dialog, Portal, Button, Paragraph } from 'react-native-paper';

interface AlertBoxProps {
  visible: boolean; // Controls dialog visibility
  onClose: () => void; // Called when "Cancel" is pressed
  message?: string; // Message to display in the dialog (optional)
}

const AlertBox: React.FC<AlertBoxProps> = ({
  visible,
  onClose,
  message = "",
}) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onClose} style={styles.dialog}>
        <Dialog.Content>
          <Paragraph>{message}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onClose}>Ok</Button>

        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    width: '40%', // Set dialog width relative to the screen
    alignSelf: 'center', // Center the dialog
    borderRadius: 10, // Optional: rounded corners
  },
});

export default AlertBox;
