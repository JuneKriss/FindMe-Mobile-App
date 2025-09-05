import React, { useState } from 'react';
import { View, StatusBar } from 'react-native';

import RegisterScreen from './src/screens/auth/RegisterScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import SplashScreen from './src/screens/splash/SplashScreen';
import RoleSelection from './src/screens/auth/RoleScreen';
import FamilyHomeScreen from './src/screens/Family/FamilyHomeScreen';
import VolunteerHomeScreen from './src/screens/volunteer/VolunteerScreen';
import ReportCaseScreen from './src/components/ReportCase';
import HeaderComponent from './src/components/header';

export default function App() {
  const [screen, setScreen] = useState('Login');

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />

      {screen === 'Login' && <LoginScreen setScreen={setScreen} />}
      {screen === 'Register' && <RegisterScreen setScreen={setScreen} />}
      {screen === 'Spash' && <SplashScreen setScreen={setScreen} />}
      {screen === 'Role' && <RoleSelection setScreen={setScreen} />}
      {screen === 'family' && <FamilyHomeScreen setScreen={setScreen} />}
      {screen === 'volunteer' && <VolunteerHomeScreen setScreen={setScreen} />}
      {screen === 'report' && <ReportCaseScreen setScreen={setScreen} />}
    </View>
  );
}
