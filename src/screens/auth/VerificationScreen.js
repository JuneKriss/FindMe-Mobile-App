import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { verifyEmail, resendCode } from '../../api/accountApi';

const VerifyScreen = ({ userId, email, setScreen }) => {
  const [code, setCode] = useState('');

  const handleVerify = async () => {
    if (!code) {
      Alert.alert('Error', 'Please enter the code');
      return;
    }
    try {
      console.log('Verify payload:', { userId, code });
      const res = await verifyEmail(userId, code);

      if (res.success) {
        Alert.alert('Success', res.success);
        setScreen('Login');
      } else {
        Alert.alert('Error', res.error || 'Invalid code');
      }
    } catch (err) {
      console.log(
        'Verify error:',
        err.response?.status,
        err.response?.data || err.message,
      );
      Alert.alert('Error', err.response?.data?.error || 'Something went wrong');
    }
  };

  const handleResend = async () => {
    try {
      const res = await resendCode(userId);
      Alert.alert('Success', res.success || 'Code resent');
    } catch (err) {
      console.log('Resend error:', err.response?.data || err.message);
      Alert.alert(
        'Error',
        err.response?.data?.error || 'Could not resend code',
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Email Verification</Text>
      <Text style={styles.info}>Enter the 6-digit code sent to {email}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter code"
        keyboardType="numeric"
        maxLength={6}
        value={code}
        onChangeText={setCode}
      />
      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleResend}>
        <Text style={styles.resendText}>Resend Code</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 20, marginBottom: 10, textAlign: 'center' },
  info: { fontSize: 14, marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    textAlign: 'center',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: '600' },
  resendText: { color: '#007BFF', textAlign: 'center', marginTop: 10 },
});

export default VerifyScreen;
