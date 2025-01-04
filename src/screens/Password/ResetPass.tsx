import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

const ResetPass=() => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Reset your password</Text>
        <Text style={styles.description}>
          Enter a new password to reset the password on your account. We'll ask
          for this password whenever you log in.
        </Text>

        <Text style={styles.label}>New password *</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Enter new password"
        />
        <View style={styles.requirements}>
          <Text style={styles.requirement}>
            {newPassword.length >= 15 ? '✓' : '✗'} Must be at least 15
            characters long
          </Text>
          <Text style={styles.requirement}>
            {/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? '✓' : '✗'}{' '}
            Must contain an uppercase and a lowercase letter (A, z)
          </Text>
          <Text style={styles.requirement}>
            {/\d/.test(newPassword) ? '✓' : '✗'} Must contain a number
          </Text>
          <Text style={styles.requirement}>
            {/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? '✓' : '✗'} Must
            contain a special character (!, %, @, #, etc.)
          </Text>
        </View>

        <Text style={styles.label}>Confirm new password *</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm new password"
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Reset password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.link}>
          <Text style={styles.linkText}>Know your password? Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  box: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  requirements: {
    marginBottom: 20,
  },
  requirement: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    alignItems: 'center',
    marginTop: 10,
  },
  linkText: {
    color: '#007bff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default ResetPass;
