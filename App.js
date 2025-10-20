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
import ChatScreen from './src/components/ChatScreen';
import VolunteerReportDetails from './src/screens/volunteer/VolunteerReportDetails';
import VolunteerCases from './src/screens/volunteer/VolunteerCases';
import ReportSightingScreen from './src/screens/volunteer/ReportSightingScreen';
import FamilySighting from './src/screens/Family/FamilySighting';
import NotificationScreen from './src/components/notificationScreen';

export default function App() {
  const [stack, setStack] = useState([{ name: 'Splash', params: {} }]);
  const [selectedReportId, setSelectedReportId] = useState(null);

  const currentScreen = stack[stack.length - 1];

  const navigate = (name, params = {}) => {
    setStack(prev => [...prev, { name, params }]);
  };

  const goBack = () => {
    setStack(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />

      {/* AUTH */}
      {currentScreen.name === 'Splash' && <SplashScreen setScreen={navigate} />}
      {currentScreen.name === 'Login' && <LoginScreen setScreen={navigate} />}
      {currentScreen.name === 'Register' && (
        <RegisterScreen setScreen={navigate} />
      )}
      {currentScreen.name === 'Verify' && (
        <VerifyScreen {...currentScreen.params} setScreen={navigate} />
      )}

      {/* ROLE SELECTION */}
      {currentScreen.name === 'Role' && <RoleSelection setScreen={navigate} />}

      {/* FAMILY SCREENS */}
      {currentScreen.name === 'family' && (
        <FamilyHomeScreen
          setScreen={navigate}
          setSelectedReportId={setSelectedReportId}
        />
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
      {currentScreen.name === 'familySighting' && (
        <FamilySighting
          setScreen={navigate}
          goBack={goBack}
          {...currentScreen.params}
        />
      )}
      {currentScreen.name === 'chat' && (
        <ChatScreen goBack={goBack} {...currentScreen.params} />
      )}

      {/* VOLUNTEER SCREENS */}
      {currentScreen.name === 'volunteer' && (
        <VolunteerHomeScreen
          setScreen={navigate}
          setSelectedReportId={setSelectedReportId}
        />
      )}
      {currentScreen.name === 'volunteerDetails' && (
        <VolunteerReportDetails
          setScreen={navigate}
          goBack={goBack}
          selectedReportId={selectedReportId}
        />
      )}
      {currentScreen.name === 'volunteerCases' && (
        <VolunteerCases
          setScreen={navigate}
          setSelectedReportId={setSelectedReportId}
        />
      )}
      {currentScreen.name === 'reportSighting' && (
        <ReportSightingScreen
          setScreen={navigate}
          goBack={goBack}
          {...currentScreen.params}
        />
      )}
      {currentScreen.name === 'notification' && (
        <NotificationScreen setScreen={navigate} goBack={goBack} />
      )}
    </View>
  );
}
