import React, { useEffect, UseEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from '@react-native-vector-icons/feather';

const SplashScreen = ({ setScreen }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen('Login');
    }, 2000);
  });
  return (
    <View style={styles.container}>
      <Icon name="map-pin" size={250} style={styles.icon} />
      <Text style={styles.title}>FindMe</Text>
      <Text style={styles.quote}>
        Connecting Communities,{'\n'}Saving Lives
      </Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, // fills full screen
    justifyContent: 'center', // vertical center
    alignItems: 'center', // horizontal center
    backgroundColor: '#4266BE',
    padding: 20,
  },
  icon: {
    size: 300,
    color: '#fff',
    marginBottom: 5,
  },
  title: {
    fontSize: 55,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: '#fff',
    marginBottom: 2,
  },
  quote: {
    fontSize: 15,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 18,
    letterSpacing: 2,
    marginBottom: 50,
  },
});
