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
import { login } from '../../api/authApi';

const LoginScreen = ({ setScreen }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState();

  const HandleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }
    setLoading(true);
    try {
      const response = await login(username, password);
      if (response?.access) {
        console.log('Login Success', response);
        Alert.alert('Login Successfully');
        setScreen('Role');
      } else {
        Alert.alert('Error', 'Invalid username or password');
      }
    } catch (error) {
      console.log('Login error details:', error.response || error.message);
      Alert.alert('Error', `Something went wrong: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />
      <Icon name="map-pin" size={200} style={styles.icon} />
      <Text style={styles.title}>FindMe</Text>
      <Text style={styles.quote}>
        Connecting Communities,{'\n'}Saving Lives
      </Text>
      <Text style={styles.info}>
        Enter valid user name & password to continue
      </Text>
      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Icon name="mail" size={20} color="#555" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
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
      <TouchableOpacity
        style={styles.button}
        onPress={HandleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>
      {/* Navigate to Register */}
      <TouchableOpacity onPress={() => setScreen('Register')}>
        <Text style={styles.link}>
          Don't have an account?{'\n'}
          <Text style={styles.linkHighlight}>Sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

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
    marginBottom: 15,
  },
  linkHighlight: {
    color: '#4266BE', // blue for Sign up
    fontWeight: 'bold',
  },
});
