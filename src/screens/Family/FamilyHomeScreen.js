import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from '@react-native-vector-icons/feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderComponent from '../../components/header';
import { getAccount } from '../../api/accountApi';
import { getReports } from '../../api/reportApi';
import { cancelReport } from '../../api/reportApi';

const FamilyHomeScreen = ({ setScreen, setSelectedReportId }) => {
  const [user, setUser] = useState(null);
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user info
  const fetchUser = async () => {
    try {
      const response = await getAccount();
      setUser(response.data);
    } catch (err) {
      console.log('Error loading user info:', err);
      Alert.alert('Error', 'Could not load user info');
    }
  };

  // Fetch reports
  const fetchReports = async () => {
    try {
      const response = await getReports();
      // Filter out cancelled reports
      const activeReports = response.data.filter(
        report =>
          report.status !== 'Cancelled' && report.status !== 'PendingOTP',
      );
      setMyReports(activeReports);
    } catch (err) {
      Alert.alert('Error', 'Could not load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchReports();
  }, []);

  const handleCancelReport = async reportId => {
    try {
      await cancelReport(reportId); // now this correctly calls the API
      Alert.alert('Success', 'Report has been cancelled.');
      fetchReports(); // refresh the list
    } catch (err) {
      console.error('Cancel report error:', err);
      Alert.alert('Error', 'Failed to cancel report.');
    }
  };

  // Render each report
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
                  : item.status === 'Pending'
                  ? 'gray'
                  : 'green',
            },
          ]}
        >
          {item.status}
        </Text>

        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <TouchableOpacity
            style={style.viewButton}
            onPress={() =>
              setScreen('reportDetails', { reportId: item.report_id })
            }
          >
            <Text style={style.viewText}>View</Text>
          </TouchableOpacity>

          {/* Show Cancel button if Pending */}
          {item.status === 'Pending' && (
            <TouchableOpacity
              style={[
                style.viewButton,
                { backgroundColor: '#e74c3c', marginLeft: 8 },
              ]}
              onPress={() => handleCancelReport(item.report_id)}
            >
              <Text style={style.viewText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

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
            data={myReports}
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
                  <Icon name="file-text" size={28} color="#4266BE" />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={style.summaryText}>
                      You have {myReports.length} active reports
                    </Text>
                    <TouchableOpacity onPress={() => setScreen('reportCase')}>
                      <Text style={style.addNew}>+ Add New Report</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={style.sectionTitle}>My Reports</Text>
              </>
            }
            ListEmptyComponent={
              <View style={style.emptyState}>
                <Icon name="file" size={40} color="#bdc3c7" />
                <Text style={style.emptyText}>No reports submitted yet</Text>
              </View>
            }
          />
        </View>

        {/* Bottom Navigation */}
        {user && (
          <HeaderComponent
            setScreen={setScreen}
            active="family"
            role={user.role}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default FamilyHomeScreen;

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
  addNew: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4266BE',
    marginTop: 4,
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
  viewButton: {
    marginTop: 6,
    backgroundColor: '#4266BE',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  viewText: {
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
