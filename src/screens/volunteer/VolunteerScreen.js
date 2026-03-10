import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderComponent from '../../components/header';
import { getAccount } from '../../api/accountApi';
import {
  getAvailableReports,
  assistReport,
  getMyAssistedReports,
} from '../../api/reportApi';

const VolunteerHomeScreen = ({ setScreen, setSelectedReportId }) => {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [assistingReports, setAssistingReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await getAccount();
      setUser(res.data);
    } catch (err) {
      Alert.alert('Error', 'Could not load user info');
    }
  };

  const fetchReports = async () => {
    try {
      const res = await getAvailableReports();
      // Only Verified reports
      const verifiedReports = res.data.filter(r => r.status === 'Verified');
      setReports(verifiedReports || []);
    } catch (err) {
      Alert.alert('Error', 'Could not load reports');
    }
  };

  const fetchAssistedReports = async () => {
    try {
      const res = await getMyAssistedReports();
      const assistedIds = res.data.map(r => r.report_id);
      setAssistingReports(assistedIds);
    } catch (err) {
      console.log('Error fetching assisted reports');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchUser();
    };
    loadData();
  }, []);

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([fetchReports(), fetchAssistedReports()]).finally(() =>
        setLoading(false),
      );
    }
  }, [user]);

  const handleAssist = async reportId => {
    try {
      if (assistingReports.includes(reportId)) {
        Alert.alert('Notice', 'You are already assisting this report.');
        return;
      }

      await assistReport(reportId);

      setReports(prev => prev.filter(r => r.report_id !== reportId));
      setAssistingReports(prev => [...prev, reportId]);

      Alert.alert('Success', 'You are now assisting this case.');
      setSelectedReportId(reportId);
      setScreen('volunteerDetails');
    } catch (err) {
      Alert.alert(
        'Error',
        err.response?.data?.detail || 'Failed to assist this report.',
      );
    }
  };

  const missingCount = reports.filter(r => r.status === 'Verified').length;
  const assistedCount = assistingReports.length;
  const foundCount = reports.filter(
    r => r.status === 'Found' || r.status === 'Closed - Safe',
  ).length;

  const stats = [
    {
      label: 'Missing',
      count: missingCount,
      color: 'red',
      icon: 'alert-circle',
    },
    { label: 'Assisted', count: assistedCount, color: 'orange', icon: 'clock' },
    { label: 'Found', count: foundCount, color: 'green', icon: 'check-circle' },
  ];

  const renderReport = ({ item }) => {
    const isAssisting = assistingReports.includes(item.report_id);

    return (
      <View style={style.card}>
        <View style={style.infoContainer}>
          <Text style={style.name}>{item.full_name}</Text>
          <Text style={style.date}>
            Reported on {new Date(item.created_at).toDateString()}
          </Text>
          <Text style={style.date}>Last seen at {item.last_seen_location}</Text>
          <Text
            style={[
              style.status,
              {
                color:
                  item.status === 'Verified'
                    ? 'red'
                    : item.status === 'In Progress'
                    ? 'orange'
                    : 'green',
              },
            ]}
          >
            {item.status}
          </Text>

          <View style={style.actionRow}>
            <TouchableOpacity
              style={[
                style.assistButton,
                { backgroundColor: isAssisting ? '#7f8c8d' : '#28a745' },
              ]}
              onPress={() => handleAssist(item.report_id)}
              disabled={isAssisting}
            >
              <Text style={style.assistText}>
                {isAssisting ? 'Assisting' : 'Assist'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={style.center}>
        <ActivityIndicator size="large" color="#4266BE" />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#f8f9fb' }}
      edges={['top', 'bottom']}
    >
      <View style={style.container}>
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
                    <Text style={style.greeting}>Welcome Back,</Text>
                    <Text style={style.username}>{user?.full_name}</Text>
                  </View>
                </View>

                <View style={style.summaryCard}>
                  <Icon name="users" size={28} color="#4266BE" />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={style.summaryText}>
                      You can assist in updating missing cases
                    </Text>
                  </View>
                </View>

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

        {user && (
          <HeaderComponent
            setScreen={setScreen}
            active="volunteer"
            role={user.role}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default VolunteerHomeScreen;

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FBFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40,
  },
  content: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 16,
  },
  greeting: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    elevation: 3,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 16,
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
  assistButton: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  assistText: {
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
