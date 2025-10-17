import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from '@react-native-vector-icons/feather';

const HeaderComponent = ({ setScreen, active, role }) => {
  const menuItems =
    role === 'volunteer'
      ? [
          { name: 'home', label: 'Home', icon: 'home', screen: 'volunteer' },
          {
            name: 'case',
            label: 'Cases',
            icon: 'clipboard',
            screen: 'volunteerCases',
          },
          {
            name: 'notification',
            label: 'Notification',
            icon: 'bell',
            screen: 'notification',
          },
          { name: 'logout', label: 'Logout', icon: 'log-out', screen: 'Login' },
        ]
      : [
          { name: 'home', label: 'Home', icon: 'home', screen: 'family' },
          {
            name: 'report',
            label: 'Report',
            icon: 'plus-square',
            screen: 'reportCase',
          },
          {
            name: 'notification',
            label: 'Notification',
            icon: 'bell',
            screen: 'notification',
          },
          { name: 'logout', label: 'Logout', icon: 'log-out', screen: 'Login' },
        ];

  return (
    <View style={style.container}>
      {menuItems.map(item => (
        <TouchableOpacity
          key={item.name}
          style={style.menuItem}
          onPress={() => setScreen(item.screen)}
        >
          <Icon
            name={item.icon}
            size={22}
            color={active === item.screen ? '#4266BE' : '#000'}
          />
          <Text
            style={[
              style.label,
              { color: active === item.screen ? '#4266BE' : '#000' },
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default HeaderComponent;

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e6e6e6',
    elevation: 6,
  },
  menuItem: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});
