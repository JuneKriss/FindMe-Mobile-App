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
  Platform,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderComponent from './header';
// API
import { createReport, uploadReportMedia } from '../api/reportApi';

const ReportCaseScreen = ({ setScreen }) => {
  // Stores all input data
  const [form, setForm] = useState({
    full_name: '',
    age: '',
    gender: '',
    last_seen_date: '',
    last_seen_location: '',
    clothing: '',
    notes: '',
  });

  const [photos, setPhotos] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  // Pick multiple images
  const pickImage = () => {
    launchImageLibrary(
      { mediaType: 'photo', selectionLimit: 0, quality: 1 },
      response => {
        if (!response.didCancel && !response.errorMessage) {
          const newPhotos = response.assets.map(asset => asset.uri);
          setPhotos(prev => [...prev, ...newPhotos]);
        }
      },
    );
  };

  // Reset form after submit
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
    setPhotos([]);
  };

  const handleSubmit = async () => {
    try {
      // Create report (wala pic)
      const reportRes = await createReport(form);
      const reportId = reportRes.data.report_id;

      // Upload photos separately (if mag add ug pic)
      if (photos.length > 0) {
        for (const uri of photos) {
          const formData = new FormData();
          formData.append('report', reportId);
          formData.append('file', {
            uri,
            name: `report-${Date.now()}.jpg`,
            type: 'image/jpeg',
          });
          await uploadReportMedia(formData);
        }
      }

      resetForm();
      Alert.alert('Success', 'Report submitted successfully!');
      setScreen('family');
    } catch (err) {
      console.error(
        'Error creating report:',
        err.response?.data || err.message,
      );
      Alert.alert('Error', 'Failed to submit report.');
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#f8f9fb' }}
      edges={['top', 'bottom']}
    >
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
            <Text style={{ color: '#888' }}>Tap to Upload Photos</Text>
          </TouchableOpacity>

          <ScrollView horizontal style={{ marginVertical: 10 }}>
            {photos.map((uri, idx) => (
              <Image key={idx} source={{ uri }} style={styles.uploadedImage} />
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit Report</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={
              form.last_seen_date ? new Date(form.last_seen_date) : new Date()
            }
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
            onChange={(event, selectedDate) => {
              if (Platform.OS === 'android') {
                setShowDatePicker(false); // auto close on Android
              }
              if (selectedDate) {
                const isoDate = selectedDate.toISOString().split('T')[0];
                handleChange('last_seen_date', isoDate);
              }
            }}
          />
        )}

        <HeaderComponent setScreen={setScreen} active="report" />
      </View>
    </SafeAreaView>
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
    marginTop: 8,
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
  uploadedImage: { width: 80, height: 80, marginRight: 10, borderRadius: 6 },
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
