import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from '@react-native-vector-icons/feather';
// API IMPORT
import { loadToken } from '../../api/api';
import { updateRole } from '../../api/accountApi';
import { getAccount } from '../../api/accountApi';

const RoleSelection = ({ setScreen }) => {
  // Load token when component mounts
  useEffect(() => {
    loadToken()
      .then(() => console.log('Token loaded successfully'))
      .catch(err => console.log('Error loading token:', err.message));
  }, []);

  const handleRoleSelect = async role => {
    try {
      const { data } = await updateRole(role);

      if (data.role === 'family') {
        const res = await getAccount();

        if (res.data.family_profile) {
          setScreen('family');
        } else {
          setScreen('familyProfile');
        }
      } else {
        setScreen('volunteer');
      }
    } catch (error) {
      console.log('Login error details:', error.response || error.message);
      Alert.alert('Error', `Something went wrong: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textLogo}>FindMe</Text>
      <Text style={styles.subText}>Choose your role to continue</Text>
      <Text style={styles.pickText}>Are you acting as:</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => handleRoleSelect('family')}
      >
        <View style={styles.row}>
          <View style={[styles.iconBox, { backgroundColor: '#4266BE' }]}>
            <Icon name="user" size={30} color="#fff" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>FAMILY</Text>
            <Text style={styles.description}>
              Report a missing loved one, and track search updates.
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => handleRoleSelect('volunteer')}
      >
        <View style={styles.row}>
          <View style={[styles.iconBox, { backgroundColor: '#333' }]}>
            <Icon name="users" size={28} color="#fff" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>VOLUNTEER</Text>
            <Text style={styles.description}>
              Assist in search operations, and coordinate with the police.
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <Text style={styles.footerText}>
          Please select how you’ll be using FindMe today.
        </Text>
        <Text style={styles.footerText}>
          If you’re reporting a missing family or relatives, choose Family.
        </Text>
        <Text style={styles.footerText}>
          If you’re helping in the search, choose Volunteer.
        </Text>
      </View>
    </View>
  );
};

export default RoleSelection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  textLogo: {
    fontSize: 55,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: '#4266BE',
  },
  subText: {
    fontSize: 14,
    color: '#565656',
  },
  pickText: {
    fontSize: 14,
    color: '#565656',
    marginBottom: 25,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '90%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconBox: {
    width: 55,
    height: 55,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    flexShrink: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 12,
    color: '#555',
  },
  footerText: {
    fontSize: 11,
    color: '#565656',
    textAlign: 'center',
  },
});
