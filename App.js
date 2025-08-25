import React, { useState } from 'react';
import { View } from 'react-native';

import RegisterScreen from './src/screens/auth/RegisterScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import SplashScreen from './src/screens/splash/SplashScreen';
import RoleSelection from './src/screens/auth/RoleScreen';

export default function App() {
  const [screen, setScreen] = useState('Splash');

  return (
    <View style={{ flex: 1 }}>
      {screen === 'Login' && <LoginScreen setScreen={setScreen} />}
      {screen === 'Register' && <RegisterScreen setScreen={setScreen} />}
      {screen === 'Spash' && <SplashScreen setScreen={setScreen} />}
      {screen === 'Role' && <RoleSelection setScreen={setScreen} />}
    </View>
  );
}
