import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// IMPORT
import Icon from '@react-native-vector-icons/feather';
import HeaderComponent from '../../components/header';

const VolunteerHomeScreen = () => {
  return (
    <View style={style.container}>
      <HeaderComponent />
      {/* first wrapper */}
      <View style={style.wrapper}>
        <View style={style.row}>
          <View style={style.buttonContainer}>
            <View style={style.iconCircle}>
              <Icon name="list" size={20} color="#fff" />
            </View>
            <Text style={style.buttonText}>My Reports</Text>
          </View>
          <View style={style.buttonContainer}>
            <View style={style.iconCircle}>
              <Icon name="bell" size={20} color="#fff" />
            </View>
            <Text style={style.buttonText}>Notification</Text>
          </View>
        </View>
        <View
          style={[
            style.buttonContainer,
            { marginTop: 5, justifyContent: 'center' },
          ]}
        >
          <View style={style.innerContent}>
            <View style={style.iconCircle}>
              <Icon name="plus" size={20} color="#fff" />
            </View>
            <Text style={style.reportText}>Report Missing Person</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default VolunteerHomeScreen;

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  wrapper: {
    backgroundColor: '#F4F6FA',
    borderRadius: 6,
    marginBottom: 10,
    height: '85%',
    padding: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4266BE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    marginLeft: 15,
  },
  reportText: {
    marginLeft: 8,
  },
  innerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
