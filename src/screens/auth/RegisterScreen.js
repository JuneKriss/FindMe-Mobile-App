import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

      const userId = res.account_id || res.data?.account_id;
      if (!userId) {
        Alert.alert('Error', 'No account_id returned from server');
        return;
      }

      Alert.alert('Success', 'Account created. Please verify your email.');
      setScreen('Verify', { userId, email });
    } catch (err) {
      console.log('Register error:', err.response?.data || err.message);
      Alert.alert('Error', err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />
          <View style={styles.container}>
            <Icon name="map-pin" size={180} style={styles.icon} />
            <Text style={styles.title}>FindMe</Text>
            <Text style={styles.quote}>
              Connecting Communities,{'\n'}Saving Lives
            </Text>
            <Text style={styles.info}>Enter valid information to continue</Text>

            <View style={styles.inputContainer}>
              <Icon
                name="user"
                size={20}
                color="#555"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#aaa"
                value={username}
                onChangeText={setUsername}
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon
                name="user-check"
                size={20}
                color="#555"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#aaa"
                value={full_name}
                onChangeText={setFullname}
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon
                name="mail"
                size={20}
                color="#555"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon
                name="lock"
                size={20}
                color="#555"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                returnKeyType="done"
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setScreen('Login')}>
              <Text style={styles.link}>
                Already have an account?{'\n'}
                <Text style={styles.linkHighlight}>Log in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 50,
  },
  container: {
    alignItems: 'center',
    padding: 15,
  },
  icon: {
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
    marginBottom: 10,
  },
  inputIcon: {
    marginRight: 5,
  },
  input: {
    flex: 1,
    height: 40,
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
    color: '#000',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 25,
  },
  linkHighlight: {
    color: '#4266BE',
    fontWeight: 'bold',
  },
});
