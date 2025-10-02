import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import Icon from '@react-native-vector-icons/feather';

import { createAccount } from '../../api/accountApi';

const RegisterScreen = ({ setScreen }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [full_name, setFullname] = useState('');
  const role = 'family';

  const handleRegister = async () => {
    if (!username || !email || !password || !full_name) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const res = await createAccount({
        username,
        email,
        password,
        full_name,
        role,
      });
      console.log('Register response:', res);

      const userId = res.account_id || res.data?.account_id; // ✅ depends on backend
      if (!userId) {
        Alert.alert('Error', 'No account_id returned from server');
        return;
      }

      Alert.alert('Success', 'Account created. Please verify your email.');
      setScreen('Verify', { userId, email }); // ✅ pass as props
    } catch (err) {
      console.log('Register error:', err.response?.data || err.message);
      Alert.alert('Error', err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />
      <Icon name="map-pin" size={180} style={styles.icon} />
      <Text style={styles.title}>FindMe</Text>
      <Text style={styles.quote}>
        Connecting Communities,{'\n'}Saving Lives
      </Text>
      <Text style={styles.info}>
        Enter valid user name & password to continue
      </Text>
      {/* Username Input */}
      <View style={styles.inputContainer}>
        <Icon name="user" size={20} color="#555" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      {/* Full Name */}
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#555" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#aaa"
          value={full_name}
          onChangeText={setFullname}
        />
      </View>
      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Icon name="mail" size={20} color="#555" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#555" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      {/* Navigate to Register */}
      <TouchableOpacity onPress={() => setScreen('Login')}>
        <Text style={styles.link}>
          Already have an account?{'\n'}
          <Text style={styles.linkHighlight}>Log in</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  icon: {
    size: 300,
    color: '#4266BE',
    marginBottom: 5,
  },
  title: {
    fontSize: 55,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 2,
  },
  quote: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 18,
    letterSpacing: 2,
    marginBottom: 16,
  },
  info: {
    fontSize: 13,
    color: '#565656',
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
    width: '70%',
    marginBottom: 10, // space between inputs
  },
  inputIcon: {
    marginRight: 5,
  },
  input: {
    flex: 1, // expands to fill available space
    height: 45,
    fontSize: 15,
    color: '#333',
  },
  button: {
    backgroundColor: '#4266BE',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    width: '70%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#000', // black for the first line
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center', // centers both lines
    marginBottom: 25,
  },
  linkHighlight: {
    color: '#4266BE', // blue for Sign up
    fontWeight: 'bold',
  },
});
