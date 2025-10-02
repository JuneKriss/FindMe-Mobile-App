import React, { useState } from 'react';
import { View, StatusBar } from 'react-native';

import SplashScreen from './src/screens/splash/SplashScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import RoleSelection from './src/screens/auth/RoleScreen';
import FamilyHomeScreen from './src/screens/Family/FamilyHomeScreen';
import VolunteerHomeScreen from './src/screens/volunteer/VolunteerScreen';
import ReportCaseScreen from './src/components/ReportCase';
import FamilyProfileScreen from './src/screens/Family/FamilyProfileScreen';
import FamilyReportDetails from './src/screens/Family/FamilyReportDetails';
import VerifyScreen from './src/screens/auth/VerificationScreen';

export default function App() {
  // 👇 Start with Splash as an object
  const [stack, setStack] = useState([{ name: 'Splash', params: {} }]);
  const [selectedReportId, setSelectedReportId] = useState(null);

  const currentScreen = stack[stack.length - 1];

  // ✅ navigate can take name + params
  const navigate = (name, params = {}) => {
    setStack(prev => [...prev, { name, params }]);
  };

  const goBack = () => {
    setStack(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />

      {currentScreen.name === 'Splash' && <SplashScreen setScreen={navigate} />}
      {currentScreen.name === 'Login' && <LoginScreen setScreen={navigate} />}
      {currentScreen.name === 'Register' && (
        <RegisterScreen setScreen={navigate} />
      )}
      {currentScreen.name === 'Verify' && (
        <VerifyScreen
          {...currentScreen.params} // ✅ userId + email arrive here
          setScreen={navigate}
        />
      )}
      {currentScreen.name === 'Role' && <RoleSelection setScreen={navigate} />}
      {currentScreen.name === 'family' && (
        <FamilyHomeScreen
          setScreen={navigate}
          setSelectedReportId={setSelectedReportId}
        />
      )}
      {currentScreen.name === 'volunteer' && (
        <VolunteerHomeScreen setScreen={navigate} />
      )}
      {currentScreen.name === 'reportCase' && (
        <ReportCaseScreen setScreen={navigate} />
      )}
      {currentScreen.name === 'familyProfile' && (
        <FamilyProfileScreen setScreen={navigate} />
      )}
      {currentScreen.name === 'reportDetails' && (
        <FamilyReportDetails
          setScreen={navigate}
          goBack={goBack}
          selectedReportId={selectedReportId}
        />
      )}
    </View>
  );
}
