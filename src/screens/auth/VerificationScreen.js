import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { verifyEmail, resendCode } from '../../api/accountApi';

const VerifyScreen = ({ userId, email, setScreen }) => {
  const [code, setCode] = useState('');

  const handleVerify = async () => {
    if (!code) {
      Alert.alert('Error', 'Please enter the code');
      return;
    }
    try {
      const res = await verifyEmail(userId, code);
      if (res.success) {
        Alert.alert('Success', res.success);
        setScreen('Login');
      } else {
        Alert.alert('Error', res.error || 'Invalid code');
      }
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error || 'Something went wrong');
    }
  };

  const handleResend = async () => {
    try {
      const res = await resendCode(userId);
      Alert.alert('Success', res.success || 'Code resent successfully');
    } catch (err) {
      Alert.alert(
        'Error',
        err.response?.data?.error || 'Failed to resend code',
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Email Verification</Text>
          <Text style={styles.info}>
            Enter the 6-digit code sent to{' '}
            <Text style={styles.email}>{email}</Text>
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter 6-digit code"
            placeholderTextColor="#7f8c8d"
            keyboardType="numeric"
            maxLength={6}
            value={code}
            onChangeText={setCode}
          />

          <TouchableOpacity style={styles.button} onPress={handleVerify}>
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendText}>
              Didn’t receive code? <Text style={styles.resendLink}>Resend</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fb',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  innerContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  info: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  email: {
    fontWeight: '600',
    color: '#4266BE',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4266BE',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendText: {
    color: '#555',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 14,
  },
  resendLink: {
    color: '#4266BE',
    fontWeight: '600',
  },
});

export default VerifyScreen;
