import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  StatusBar,
  View,
  Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import HeaderComponent from './header';
//API
import { createReport } from '../api/reportApi';

const ReportCaseScreen = ({ setScreen }) => {
  //stores all input data
  const [form, setForm] = useState({
    full_name: '',
    age: '',
    gender: '',
    last_seen_date: '',
    last_seen_location: '',
    clothing: '',
    notes: '',
  });
  const [photo, setPhoto] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  //e update niya any field nga di kailangan daghan useState
  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const pickImage = () => {
    launchImageLibrary(
      { mediaType: 'photo', maxWidth: 800, maxHeight: 800, quality: 1 },
      response => {
        if (response.didCancel) return;
        if (response.errorMessage) {
          console.error('ImagePicker Error:', response.errorMessage);
        } else {
          setPhoto(response.assets[0].uri);
        }
      },
    );
  };
  //e reset niya sa empty form pag human submit
  const resetForm = () => {
    setForm({
      full_name: '',
      age: '',
      gender: '',
      last_seen_date: '',
      last_seen_location: '',
      clothing: '',
      notes: '',
    });
    setPhoto(null);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (photo) {
      formData.append('photo', {
        uri: photo,
        name: 'report-photo.jpg',
        type: 'image/jpeg',
      });
    }

    createReport(formData)
      .then(res => {
        console.log('Report created:', res.data);
        resetForm();
        Alert.alert('Success', 'Report submitted successfully!');
        setScreen('family');
      })
      .catch(err => {
        console.error(
          'Error creating report:',
          err.response?.data || err.message,
        );
        Alert.alert('Error', 'Failed to submit report.');
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />
        <Text style={styles.title}>Report Missing Case</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={form.full_name}
          onChangeText={val => handleChange('full_name', val)}
        />

        <View style={styles.wrapper}>
          <TextInput
            style={[styles.input, { width: 160 }]}
            placeholder="Age"
            keyboardType="numeric"
            value={form.age}
            onChangeText={val => handleChange('age', val)}
          />
          <TextInput
            style={[styles.input, { width: 160 }]}
            placeholder="Gender"
            value={form.gender}
            onChangeText={val => handleChange('gender', val)}
          />
        </View>

        <View style={styles.wrapper}>
          <TouchableOpacity
            style={[styles.input, { width: 160, justifyContent: 'center' }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>
              {form.last_seen_date
                ? form.last_seen_date
                : 'Select Last Seen Date'}
            </Text>
          </TouchableOpacity>
          <TextInput
            style={[styles.input, { width: 160 }]}
            placeholder="Last Seen Location"
            value={form.last_seen_location}
            onChangeText={val => handleChange('last_seen_location', val)}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Clothing Description"
          value={form.clothing}
          onChangeText={val => handleChange('clothing', val)}
        />
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Additional Notes"
          value={form.notes}
          onChangeText={val => handleChange('notes', val)}
          multiline
        />

        <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.uploadedImage} />
          ) : (
            <Text style={{ color: '#888' }}>Tap to Upload Photo</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit Report</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* DateTimePicker */}
      {showDatePicker && (
        <DateTimePicker
          value={
            form.last_seen_date ? new Date(form.last_seen_date) : new Date()
          }
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              const isoDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
              handleChange('last_seen_date', isoDate);
            }
          }}
        />
      )}

      <HeaderComponent setScreen={setScreen} active="report" />
    </View>
  );
};

export default ReportCaseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
    padding: 16,
  },
  title: {
    marginTop: 50,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  uploadBox: {
    height: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  submitButton: {
    backgroundColor: '#4266BE',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 30,
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
