import React, { useState } from 'react';
import { View } from 'react-native';

import RegisterScreen from './src/auth/RegisterScreen';
import LoginScreen from './src/auth/LoginScreen';
import SplashScreen from './src/splash/SplashScreen';
import RoleScreen from './src/auth/RoleScreen';

export default function App() {
  const [screen, setScreen] = useState('Role');

  return (
    <View style={{ flex: 1 }}>
      {screen === 'Login' && <LoginScreen setScreen={setScreen} />}
      {screen === 'Register' && <RegisterScreen setScreen={setScreen} />}
      {screen === 'Spash' && <SplashScreen setScreen={setScreen} />}
      {screen === 'Role' && <RoleScreen setScreen={setScreen} />}
    </View>
  );
}
