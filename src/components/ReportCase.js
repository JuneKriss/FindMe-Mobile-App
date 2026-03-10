import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary } from 'react-native-image-picker';
import HeaderComponent from '../components/header';

// APIs
import { createReport, uploadReportMedia } from '../api/reportApi';

const ReportCaseScreen = ({ setScreen }) => {
  const [form, setForm] = useState({
    full_name: '',
    age: '',
    gender: '',
    last_seen_date: '',
    last_seen_location: '',
    clothing: '',
    notes: '',
  });
  const [photoUris, setPhotoUris] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const pickImages = () => {
    launchImageLibrary(
      { mediaType: 'photo', selectionLimit: 0, quality: 0.8 },
      response => {
        if (response.didCancel) return;
        if (response.errorMessage)
          return Alert.alert('Error', response.errorMessage);
        const newUris = (response.assets || []).map(a => a.uri).filter(Boolean);
        setPhotoUris(prev => [...prev, ...newUris]);
      },
    );
  };

  const removeImage = uri => setPhotoUris(prev => prev.filter(u => u !== uri));

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
    setPhotoUris([]);
  };

  const handleSubmit = async () => {
    if (!form.full_name.trim() || !form.last_seen_location.trim()) {
      return Alert.alert(
        'Validation',
        'Please provide full name and last seen location.',
      );
    }

    setLoading(true);
    try {
      const res = await createReport(form);
      const reportId = res.data?.report_id || res.report_id;
      if (!reportId) throw new Error('No report ID returned.');

      for (const uri of photoUris) {
        const formData = new FormData();

        let fileUri = uri;
        if (Platform.OS === 'android' && !fileUri.startsWith('file://')) {
          fileUri = 'file://' + fileUri;
        }

        formData.append('report', reportId);
        formData.append('file', {
          uri: fileUri,
          type: 'image/jpeg',
          name: `report_${Date.now()}.jpg`,
        });

        await uploadReportMedia(formData);
      }

      Alert.alert('Success', 'Report submitted successfully!');
      resetForm();
      setScreen('family');
    } catch (err) {
      console.error('Report submission error:', err.response?.data || err);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Report Missing Person</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={[styles.card, styles.leftAccent]}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter full name"
            value={form.full_name}
            onChangeText={val => handleChange('full_name', val)}
          />

          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Age"
                value={form.age}
                onChangeText={val => handleChange('age', val)}
              />
            </View>
            <View style={styles.half}>
              <Text style={styles.label}>Gender</Text>
              <TextInput
                style={styles.input}
                placeholder="Gender"
                value={form.gender}
                onChangeText={val => handleChange('gender', val)}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>Last Seen Date</Text>
              <TouchableOpacity
                style={[styles.input, styles.dateButton]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text
                  style={
                    form.last_seen_date
                      ? styles.dateText
                      : styles.placeholderText
                  }
                >
                  {form.last_seen_date || 'Select date'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.half}>
              <Text style={styles.label}>Last Seen Location</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter location"
                value={form.last_seen_location}
                onChangeText={val => handleChange('last_seen_location', val)}
              />
            </View>
          </View>

          <Text style={styles.label}>Clothing Description</Text>
          <TextInput
            style={styles.input}
            placeholder="What was the person wearing?"
            value={form.clothing}
            onChangeText={val => handleChange('clothing', val)}
          />

          <Text style={styles.label}>Additional Notes</Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Any additional information?"
            multiline
            value={form.notes}
            onChangeText={val => handleChange('notes', val)}
          />

          <Text style={styles.label}>Attach Photos (optional)</Text>
          <TouchableOpacity style={styles.imagePicker} onPress={pickImages}>
            <Icon name="camera" size={20} color="#4266BE" />
            <Text style={styles.imagePickerText}>Upload Images</Text>
          </TouchableOpacity>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {photoUris.map((uri, idx) => (
              <View key={uri + idx} style={styles.photoWrap}>
                <Image source={{ uri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => removeImage(uri)}
                >
                  <Text style={styles.removeText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={[styles.submitButton, loading && { opacity: 0.6 }]}
            disabled={loading}
            onPress={handleSubmit}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Submit Report</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <HeaderComponent
        setScreen={setScreen}
        active="reportCase"
        role="family"
      />

      {showDatePicker && (
        <DateTimePicker
          value={
            form.last_seen_date ? new Date(form.last_seen_date) : new Date()
          }
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
          onChange={(event, selectedDate) => {
            if (Platform.OS === 'android') setShowDatePicker(false);
            if (selectedDate) {
              const isoDate = selectedDate.toISOString().split('T')[0];
              handleChange('last_seen_date', isoDate);
            }
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default ReportCaseScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  leftAccent: {
    borderLeftWidth: 4,
    borderLeftColor: '#4266BE',
  },
  label: {
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: '#000', 
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  half: { width: '48%' },
  imagePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6f8',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  imagePickerText: {
    marginLeft: 8,
    color: '#4266BE',
    fontWeight: '500',
  },
  photoWrap: {
    position: 'relative',
    marginRight: 8,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ff4d4d',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  removeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 16,
  },
  submitButton: {
    backgroundColor: '#4266BE',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  placeholderText: {
    color: '#888',
  },
  dateText: {
    color: '#333',
  },
  dateButton: {
    justifyContent: 'center',
  },
});
