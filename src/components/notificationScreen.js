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
import Icon from 'react-native-vector-icons/Feather';
import {
  getNotifications,
  markNotificationAsRead,
  getAccount,
} from '../api/notificationAPI';

const NotificationScreen = ({ setScreen, goBack }) => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await getAccount();
      setUser(res.data);
    } catch (err) {
      console.error('Failed to load user:', err);
      Alert.alert('Error', 'Unable to load user account');
    }
  };

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      Alert.alert('Error', 'Unable to load notifications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchUser();
    };
    init();
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, []);

  const handleNotificationPress = async notif => {
    try {
      await markNotificationAsRead(notif.id);
      setNotifications(prev =>
        prev.map(n => (n.id === notif.id ? { ...n, is_read: true } : n)),
      );

      if (notif.related_report) {
        setScreen('reportDetail', { reportId: notif.related_report });
      }
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const renderNotificationIcon = action => {
    switch (action) {
      case 'case_verified':
        return <Icon name="check-circle" size={24} color="#27ae60" />;
      case 'report_assisted':
        return <Icon name="user-check" size={24} color="#2980b9" />;
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
        <Text style={styles.headerTitle}>Notifications</Text>
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
              {renderNotificationIcon(item.notification?.action)}
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.notificationText}>
                {item.notification?.title || item.title}
              </Text>
              <Text style={styles.timeText}>
                {new Date(
                  item.notification?.created_at || item.created_at,
                ).toLocaleString()}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notifications yet 🎉</Text>
        }
        contentContainerStyle={{ paddingVertical: 12 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7faff' },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: '#2E86DE',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    elevation: 3,
  },
  backButton: { padding: 4 },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  unread: {
    backgroundColor: '#e8f3ff',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  iconWrapper: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrapper: { flex: 1, paddingLeft: 8 },
  notificationText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  timeText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#777',
  },
});

export default NotificationScreen;
