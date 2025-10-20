import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Icon from '@react-native-vector-icons/feather';
import {
  getNotifications,
  markNotificationAsRead,
} from '../api/notificationAPI';
import { SafeAreaView } from 'react-native-safe-area-context';

const NotificationScreen = ({ setScreen, goBack, user }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getNotifications();
      const filtered = data.filter(n => !n.is_deleted);
      setNotifications(filtered);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user?.role, user?.account_id]);

  const handlePress = async notification => {
    if (!notification.is_read) {
      await markNotificationAsRead(notification.id);
      fetchNotifications();
    }

    if (notification.related_report) {
      setScreen('reportDetails', { reportId: notification.related_report });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4266BE" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, !item.is_read && styles.unreadCard]}
            onPress={() => handlePress(item)}
          >
            <View style={styles.row}>
              <Icon
                name={
                  item.action === 'new_message'
                    ? 'message-circle'
                    : 'alert-circle'
                }
                size={22}
                color={item.is_read ? '#777' : '#4266BE'}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.titleText}>{item.title}</Text>
                <Text style={styles.dateText}>
                  {new Date(item.created_at).toLocaleString()}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 3,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4266BE',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  dateText: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
});
