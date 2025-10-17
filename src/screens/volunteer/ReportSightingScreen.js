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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@react-native-vector-icons/feather';
import { launchImageLibrary } from 'react-native-image-picker';
import { createSighting, uploadSightingMedia } from '../../api/sightingApi';

const ReportSightingScreen = ({ goBack, reportId }) => {
  const [form, setForm] = useState({ location: '', details: '' });
  const [photoUris, setPhotoUris] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pick one or multiple images
  const pickImages = () => {
    launchImageLibrary(
      { mediaType: 'photo', selectionLimit: 0, quality: 0.8 },
      response => {
        if (response.didCancel) return;
        if (response.errorMessage) {
          return Alert.alert('Error', response.errorMessage);
        }

        const newUris = (response.assets || []).map(a => a.uri).filter(Boolean);
        setPhotoUris(prev => [...prev, ...newUris]);
      },
    );
  };

  const removeImage = uri => {
    setPhotoUris(prev => prev.filter(u => u !== uri));
  };

  const resetForm = () => {
    setForm({ location: '', details: '' });
    setPhotoUris([]);
  };

  const handleSubmit = async () => {
    if (!form.location.trim() || !form.details.trim()) {
      return Alert.alert('Validation', 'Please fill out all fields.');
    }

    setLoading(true);
    try {
      const sightingRes = await createSighting({
        report: reportId,
        location: form.location,
        description: form.details,
        date_seen: new Date().toISOString().split('T')[0],
      });

      const sightingId =
        sightingRes.data?.sighting_id ||
        sightingRes.data?.id ||
        sightingRes.sighting_id;
      if (!sightingId) throw new Error('No sighting ID returned');

      // Upload attached images
      for (const uri of photoUris) {
        const formData = new FormData();

        let fileUri = uri;
        if (Platform.OS === 'android' && !fileUri.startsWith('file://')) {
          fileUri = 'file://' + fileUri;
        }

        formData.append('sighting', sightingId);
        formData.append('file', {
          uri: fileUri,
          type: 'image/jpeg',
          name: `sighting_${Date.now()}.jpg`,
        });

        await uploadSightingMedia(formData);
      }

      Alert.alert('Success', 'Your sighting has been reported.');
      resetForm();
      goBack();
    } catch (err) {
      console.error('Sighting submit error:', err.response?.data || err);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Icon name="arrow-left" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Sighting</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={[styles.card, styles.leftAccent]}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Where did you see the person?"
            value={form.location}
            onChangeText={text =>
              setForm(prev => ({ ...prev, location: text }))
            }
          />
          <Text style={styles.label}>Details</Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Describe what you saw..."
            multiline
            value={form.details}
            onChangeText={text => setForm(prev => ({ ...prev, details: text }))}
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
              <Text style={styles.submitText}>Submit Sighting</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportSightingScreen;

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
  backButton: {
    padding: 6,
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
  },
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
});
