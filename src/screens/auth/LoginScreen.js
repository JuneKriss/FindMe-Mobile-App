import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

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
        setScreen('Role');
      } else {
        Alert.alert('Error', 'Invalid username or password');
      }
    } catch (error) {
      Alert.alert('Error', `Something went wrong: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <StatusBar barStyle="dark-content" backgroundColor="#f8f9fb" />
          <Icon name="map-pin" size={180} style={styles.icon} />
          <Text style={styles.title}>FindMe</Text>
          <Text style={styles.quote}>
            Connecting Communities,{'\n'}Saving Lives
          </Text>
          <Text style={styles.info}>
            Enter valid username & password to continue
          </Text>

          <View style={styles.inputContainer}>
            <Icon name="user" size={20} color="#555" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#aaa"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#555" style={styles.inputIcon} />
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

          <TouchableOpacity
            style={styles.button}
            onPress={HandleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setScreen('Register')}>
            <Text style={styles.link}>
              Don’t have an account? {'\n'}
              <Text style={styles.linkHighlight}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fb',
  },
  flex: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  icon: {
    color: '#4266BE',
    marginBottom: 5,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  quote: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 18,
    letterSpacing: 1,
    marginBottom: 16,
    color: '#555',
  },
  info: {
    fontSize: 13,
    color: '#565656',
    marginBottom: 15,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    width: '80%',
    marginBottom: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 15,
    color: '#333',
  },
  button: {
    backgroundColor: '#4266BE',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
    marginTop: 10,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 15,
  },
  linkHighlight: {
    color: '#4266BE',
    fontWeight: 'bold',
  },
});
