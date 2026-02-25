import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@react-native-vector-icons/feather';
import {
  getNotifications,
  markNotificationAsRead,
  getAccount,
} from '../api/notificationAPI';

const NotificationScreen = ({ setScreen, goBack, route }) => {
  const reportId = route?.params?.reportId; // optional report filter
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // --- Fetch current user ---
  const fetchUser = async () => {
    try {
      const res = await getAccount();
      setUser(res.data);
    } catch (err) {
      console.error('Failed to load user:', err);
      Alert.alert('Error', 'Unable to load user account');
    }
  };

  // --- Fetch notifications ---
  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const params = reportId ? { report: reportId } : {};
      const data = await getNotifications(params);
      console.log('Fetching notifications for report:', reportId);
      setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      Alert.alert('Error', 'Failed to load notifications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // --- Refresh handler ---
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, [user, reportId]);

  // --- Load user on mount ---
  useEffect(() => {
    fetchUser();
  }, []);

  // --- Fetch notifications once user is loaded or reportId changes ---
  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchNotifications();
    }
  }, [user, reportId]);

  // --- Handle notification click ---
  const handleNotificationPress = async notif => {
    try {
      // Mark as read
      await markNotificationAsRead(notif.id);
      setNotifications(prev =>
        prev.map(n => (n.id === notif.id ? { ...n, is_read: true } : n)),
      );

      // Navigate to report details if related_report exists
      if (notif.related_report) {
        setScreen('reportDetails', { reportId: notif.related_report });
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      Alert.alert('Error', 'Could not mark notification as read');
    }
  };
  // --- Notification icon based on action ---
  const renderNotificationIcon = action => {
    switch (action) {
      case 'case_verified':
        return <Icon name="check-circle" size={24} color="#27ae60" />;
      case 'report_assisted':
        return <Icon name="user-check" size={24} color="#2980b9" />;
      case 'new_sighting':
        return <Icon name="eye" size={24} color="#8e44ad" />;
      case 'status_changed':
        return <Icon name="info" size={24} color="#f39c12" />;
      default:
        return <Icon name="bell" size={24} color="#555" />;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#2E86DE" />
        <Text style={{ color: '#555', marginTop: 10 }}>
          Loading notifications...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Icon name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {reportId ? 'Report Notifications' : 'Notifications'}
        </Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Notification List */}
      <FlatList
        data={notifications}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, !item.is_read && styles.unread, styles.shadow]}
            onPress={() => handleNotificationPress(item)}
          >
            <View style={styles.iconWrapper}>
              {renderNotificationIcon(item.action)}
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.notificationText}>{item.title}</Text>
              <Text style={styles.timeText}>
                {new Date(item.created_at).toLocaleString()}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {reportId
              ? 'No notifications for this report'
              : 'No notifications yet '}
          </Text>
        }
        contentContainerStyle={{ paddingVertical: 12 }}
      />
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2E86DE',
  },
  backButton: { padding: 4 },
  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  unread: { borderLeftWidth: 4, borderLeftColor: '#2E86DE' },
  shadow: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  iconWrapper: { marginRight: 12, justifyContent: 'center' },
  textWrapper: { flex: 1 },
  notificationText: { fontSize: 14, fontWeight: '500', color: '#333' },
  timeText: { fontSize: 12, color: '#888', marginTop: 2 },
  emptyText: {
    textAlign: 'center',
    color: '#555',
    marginTop: 40,
    fontSize: 14,
  },
});
