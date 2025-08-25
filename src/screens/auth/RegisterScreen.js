import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from '@react-native-vector-icons/feather';

import { createAccount } from '../../api/accountApi';

const RegisterScreen = ({ setScreen }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const role = 'family';

  const handleSignUp = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const data = { username, email, password, role };
      const res = await createAccount(data);
      if (res.status === 201 || res.status === 200) {
        Alert.alert('Success', 'Account created successfully');
        setScreen('Login'); // go back to login screen
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
      Alert.alert('Error', 'Failed to create account');
    }
  };

  return (
    <View style={styles.container}>
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
          placeholder="Name"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
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
      {/* Confirm Password Input */}
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#555" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>
      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
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
