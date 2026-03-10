import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { verifyReportOtp, resendReportOtp } from '../../api/reportApi';

const ReportVerificationScreen = ({ reportId, setScreen }) => {
  const [code, setCode] = useState('');

  const handleVerify = async () => {
    if (!code.trim()) return Alert.alert('Error', 'Enter verification code');

    try {
      const res = await verifyReportOtp(reportId, code);

      if (res.data?.success) {
        Alert.alert('Success', 'Report verified successfully!');
        setScreen('family');
      } else {
        Alert.alert('Error', res.data?.error || 'Invalid code');
      }
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || 'Verification failed');
    }
  };

  const handleResend = async () => {
    try {
      await resendReportOtp(reportId);
      Alert.alert('Sent', 'New verification code sent to your email');
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || 'Failed to resend');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Report</Text>
      <Text style={styles.subtitle}>
        Enter the OTP sent to your email to activate this report.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter 6-digit code"
        keyboardType="numeric"
        maxLength={6}
        value={code}
        onChangeText={setCode}
      />

      <TouchableOpacity style={styles.verifyBtn} onPress={handleVerify}>
        <Text style={styles.verifyText}>Verify Report</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleResend}>
        <Text style={styles.resend}>Resend Code</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReportVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: '#666',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 4,
    marginBottom: 20,
  },
  verifyBtn: {
    backgroundColor: '#4266BE',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 14,
  },
  verifyText: {
    color: '#fff',
    fontWeight: '600',
  },
  resend: {
    color: '#4266BE',
    textAlign: 'center',
    marginTop: 8,
  },
});
