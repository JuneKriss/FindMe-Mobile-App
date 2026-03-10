import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { getSightings } from '../../api/sightingApi';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FamilySighting({ goBack, reportId }) {
  const [sightings, setSightings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchSightings();
  }, []);

  const fetchSightings = async () => {
    try {
      setLoading(true);
      const response = await getSightings(reportId);
      setSightings(response.data);
    } catch (error) {
      console.error('Error fetching sightings:', error);
      Alert.alert('Error', 'Failed to load sightings.');
    } finally {
      setLoading(false);
    }
  };

  const openImage = url => {
    setSelectedImage(url);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <TouchableOpacity style={styles.backBtn} onPress={goBack}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>

        <Text style={styles.title}>Sightings Reported by Volunteers</Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#2e86de"
            style={{ marginVertical: 20 }}
          />
        ) : sightings.length > 0 ? (
          sightings.map((item, index) => (
            <View key={index} style={styles.sightingCard}>
              <View style={styles.labelRow}>
                <Icon name="map-pin" size={16} color="#333" />
                <Text style={styles.sightingLabel}> Location:</Text>
              </View>
              <Text style={styles.sightingText}>{item.location}</Text>

              <View style={styles.labelRow}>
                <Icon name="file-text" size={16} color="#333" />
                <Text style={styles.sightingLabel}> Description:</Text>
              </View>
              <Text style={styles.sightingText}>{item.description}</Text>

              {item.media?.length > 0 && (
                <TouchableOpacity
                  style={styles.viewImageBtn}
                  onPress={() => openImage(item.media[0].file_url)}
                >
                  <Icon
                    name="image"
                    size={16}
                    color="#fff"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.viewImageText}>View Attached Images</Text>
                </TouchableOpacity>
              )}

              {item.user_name && (
                <>
                  <View style={styles.labelRow}>
                    <Icon name="user" size={16} color="#333" />
                    <Text style={styles.sightingLabel}> Reported by:</Text>
                  </View>
                  <Text style={styles.sightingText}>{item.user_name}</Text>
                </>
              )}

              <Text style={styles.sightingDate}>
                {new Date(item.created_at).toLocaleString()}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noSightings}>
            No sightings have been reported yet.
          </Text>
        )}

        {/* Modal for viewing full image */}
        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setModalVisible(false)}
            >
              <Icon name="x" size={30} color="#fff" />
            </TouchableOpacity>
            <Image
              source={{ uri: selectedImage }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backBtn: {
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#2c3e50',
  },
  sightingCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  viewImageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2e86de',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
    marginBottom: 12,
  },
  viewImageText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  sightingLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  sightingText: {
    marginBottom: 8,
    color: '#555',
  },
  sightingDate: {
    marginTop: 8,
    fontSize: 12,
    color: '#777',
    textAlign: 'right',
  },
  noSightings: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    marginVertical: 20,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '90%',
    height: '70%',
    borderRadius: 10,
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 2,
  },
});
