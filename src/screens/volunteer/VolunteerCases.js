import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from '@react-native-vector-icons/feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderComponent from '../../components/header';
import { getMyAssistedReports } from '../../api/reportApi';

const VolunteerCases = ({ setScreen, setSelectedReportId }) => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCases = async () => {
    try {
      const res = await getMyAssistedReports();
      setCases(res.data);
    } catch (err) {
      console.error('Error loading assisted cases:', err);
      Alert.alert('Error', 'Could not load assisted reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedReportId(item.report_id);
        setScreen('volunteerDetails');
      }}
    >
      <View style={styles.cardHeader}>
        <Icon name="user" size={20} color="#4266BE" />
        <Text style={styles.name}>{item.full_name}</Text>
      </View>
      <Text style={styles.info}>Last seen at {item.last_seen_location}</Text>
      <Text style={styles.info}>
        Status: <Text style={{ color: '#f39c12' }}>{item.status}</Text>
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4266BE" />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#F9FBFF' }}
      edges={['top', 'bottom']}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>My Assisted Cases</Text>
          </View>

          {cases.length === 0 ? (
            <View style={styles.empty}>
              <Icon name="inbox" size={40} color="#ccc" />
              <Text style={styles.emptyText}>
                You haven't assisted any reports yet.
              </Text>
            </View>
          ) : (
            <FlatList
              data={cases}
              renderItem={renderItem}
              keyExtractor={item => item.report_id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 80 }}
            />
          )}
        </View>
        <HeaderComponent
          setScreen={setScreen}
          active="volunteerCases"
          role="volunteer"
        />
      </View>
    </SafeAreaView>
  );
};

export default VolunteerCases;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FBFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerSection: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4266BE',
    marginLeft: 8,
  },
  info: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
