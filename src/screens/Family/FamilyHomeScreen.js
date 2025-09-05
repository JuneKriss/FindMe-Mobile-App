import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import Icon from '@react-native-vector-icons/feather';
import HeaderComponent from '../../components/header';
import { getMe } from '../../api/accountApi';
import { getReports } from '../../api/reportApi';

const FamilyHomeScreen = ({ setScreen }) => {
  const [user, setUser] = useState({ username: '' });
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getMe();
        console.log('Fetched user:', response.data);
        setUser(response.data);
      } catch (err) {
        console.log('Error fetching user:', err.response || err.message);
      }
    };

    const fetchReports = async () => {
      try {
        const response = await getReports();
        console.log('Fetched reports:', response.data);
        setMyReports(response.data); // ✅ set backend reports
      } catch (err) {
        console.log('Error fetching reports:', err.response || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchReports();
  }, []);

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

        <TouchableOpacity style={style.viewButton}>
          <Text style={style.viewText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#F9FBFF',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40,
      }}
    >
      {/* Main Content */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={myReports}
          keyExtractor={item => item.report_id.toString()}
          renderItem={renderReport}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <View style={style.header}>
                <View>
                  <Text style={style.greeting}>Welcome Back,</Text>
                  <Text style={style.username}>{user.username || '...'}</Text>
                </View>
              </View>

              <View style={style.summaryCard}>
                <Icon name="file-text" size={28} color="#015dec" />
                <View style={{ marginLeft: 10 }}>
                  <Text style={style.summaryText}>
                    You have {myReports.length} active reports
                  </Text>
                  <TouchableOpacity onPress={() => setScreen('report')}>
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
      <HeaderComponent setScreen={setScreen} active="family" />
    </View>
  );
};

export default FamilyHomeScreen;

const style = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 16,
    marginTop: 20,
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
    color: '#015dec',
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
    backgroundColor: '#015dec',
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
