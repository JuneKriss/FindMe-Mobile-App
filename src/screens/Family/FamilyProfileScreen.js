import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import Icon from '@react-native-vector-icons/feather';
import { getAccount, createFamilyProfile } from '../../api/accountApi';

const FamilyProfileScreen = ({ setScreen }) => {
  const [form, setForm] = useState({
    address: '',
    contact_num: '',
  });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getAccount()
      .then(res => {
        if (res.data) {
          const userData = res.data;
          setUser(userData);

          if (userData.family_profile) {
            const { full_name, address, contact_num } = userData.family_profile;
            setForm({
              full_name: full_name || '',
              address: address || '',
              contact_num: contact_num || '',
            });
          }
        }
      })
      .catch(() => console.log('Could not fetch user data or family profile.'));
  }, []);

  const handleSave = async () => {
    if (!form.address || !form.contact_num) {
      return Alert.alert('Error', 'All fields are required');
    }

    setLoading(true);
    try {
      if (!user?.family_profile) {
        await createFamilyProfile(form);
      } else {
        await createFamilyProfile(form);
      }

      Alert.alert('Success', 'Profile saved');
      setScreen('family');
    } catch (err) {
      Alert.alert('Error', 'Could not save profile');
    }
    setLoading(false);
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: '#F9FBFF',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40,
      }}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>Complete Your Family Profile</Text>
      <Text style={styles.subtitle}>
        Please provide your details to continue
      </Text>
      <View style={styles.inputContainer}>
        <Icon name="home" size={20} color="#555" style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Address"
          multiline
          value={form.address}
          onChangeText={text => setForm({ ...form, address: text })}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="phone" size={20} color="#555" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Contact Number"
          keyboardType="phone-pad"
          value={form.contact_num}
          onChangeText={text => setForm({ ...form, contact_num: text })}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Saving...' : 'Save & Continue'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#015dec',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FamilyProfileScreen;
