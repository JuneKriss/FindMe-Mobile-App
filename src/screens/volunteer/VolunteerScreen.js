import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from '@react-native-vector-icons/feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderComponent from '../../components/header';
//API
import { getAccount } from '../../api/accountApi';
import { getReports } from '../../api/reportApi';

const VolunteerHomeScreen = ({ setScreen }) => {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const response = await getReports();
      setReports(response.data);
    } catch (err) {
      console.error('Error fetching data', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // fake stats
  const stats = [
    { label: 'Missing', count: 1, color: 'red', icon: 'alert-circle' },
    { label: 'Ongoing', count: 2, color: 'orange', icon: 'clock' },
    { label: 'Found', count: 0, color: 'green', icon: 'check-circle' },
  ];

  const renderReport = ({ item }) => (
    <View style={style.card}>
      <View style={style.infoContainer}>
        <Text style={style.name}>{item.full_name}</Text>
        <Text style={style.date}>
          Reported on {new Date(item.created_at).toDateString()}
        </Text>
        <Text
          style={[
            style.status,
            {
              color:
                item.status === 'Missing'
                  ? 'red'
                  : item.status === 'Ongoing'
                  ? 'orange'
                  : 'green',
            },
          ]}
        >
          {item.status}
        </Text>

        <View style={style.actionRow}>
          <TouchableOpacity
            style={style.viewButton}
            onPress={() => setScreen('reportDetails')}
          >
            <Text style={style.viewText}>View</Text>
          </TouchableOpacity>

          <TouchableOpacity style={style.acceptButton} onPress={() => {}}>
            <Text style={style.acceptText}>Accept Case</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#f8f9fb' }}
      edges={['top', 'bottom']}
    >
      <View style={style.container}>
        {/* Main Content */}
        <View style={style.content}>
          <FlatList
            data={reports}
            keyExtractor={item => item.report_id.toString()}
            renderItem={renderReport}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
            ListHeaderComponent={
              <>
                <View style={style.header}>
                  <View>
                    <Text style={style.greeting}>Welcome Volunteer,</Text>
                    <Text style={style.username}>HOLAAA PAPI</Text>
                  </View>
                </View>
                <View style={style.summaryCard}>
                  <Icon name="users" size={28} color="#015dec" />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={style.summaryText}>
                      You can view and assist in all reports
                    </Text>
                  </View>
                </View>
                {/* Dashboard Stats */}
                <View style={style.statsRow}>
                  {stats.map((s, index) => (
                    <View key={index} style={style.statCard}>
                      <Icon name={s.icon} size={22} color={s.color} />
                      <Text style={[style.statCount, { color: s.color }]}>
                        {s.count}
                      </Text>
                      <Text style={style.statLabel}>{s.label}</Text>
                    </View>
                  ))}
                </View>
                <Text style={style.sectionTitle}>All Reports</Text>
              </>
            }
            ListEmptyComponent={
              <View style={style.emptyState}>
                <Icon name="file" size={40} color="#bdc3c7" />
                <Text style={style.emptyText}>No reports available</Text>
              </View>
            }
          />
        </View>

        {/* Bottom Navigation */}
        <HeaderComponent setScreen={setScreen} active="volunteer" />
      </View>
    </SafeAreaView>
  );
};

export default VolunteerHomeScreen;

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FBFF',
  },
  content: {
    flex: 1,
  },
  header: {
    marginTop: 12,
    marginHorizontal: 16,
  },
  greeting: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 12,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    elevation: 3,
    marginHorizontal: 16,
    marginBottom: 15,
  },
  summaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2c3e50',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 5,
    elevation: 2,
  },
  statCount: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginHorizontal: 16,
    marginBottom: 12,
    color: '#2c3e50',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 15,
    elevation: 2,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  date: {
    fontSize: 13,
    color: '#7f8c8d',
    marginVertical: 2,
  },
  status: {
    fontSize: 13,
    fontWeight: '600',
    marginVertical: 2,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  viewButton: {
    backgroundColor: '#015dec',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginRight: 10,
  },
  viewText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  acceptButton: {
    backgroundColor: '#2ecc71',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  acceptText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    marginTop: 8,
    color: '#7f8c8d',
    fontSize: 14,
  },
});
