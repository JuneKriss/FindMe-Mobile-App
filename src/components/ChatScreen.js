import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@react-native-vector-icons/feather';
import { jwtDecode } from 'jwt-decode';
import { loadToken } from '../api/api';
import { getMessages, sendMessage as apiSendMessage } from '../api/messagesAPI';

const ChatScreen = ({ goBack, reportId }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      try {
        const token = await loadToken();
        if (token) {
          const decoded = jwtDecode(token);
          setCurrentUser(decoded.account_id);
        }
        await fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
      } catch (err) {
        console.error('Initialization error:', err.message);
      }
    };
    init();
  }, [reportId]);

  const fetchMessages = async () => {
    try {
      const res = await getMessages(reportId);
      // Sort messages oldest → newest
      const sorted = (res.data || res).sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at),
      );
      setMessages(sorted);
    } catch (err) {
      console.error(
        'Error fetching messages:',
        err.response?.data || err.message,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      await apiSendMessage(reportId, text);
      setText('');
      await fetchMessages();
      scrollToBottom();
    } catch (err) {
      console.error(
        'Error sending message:',
        err.response?.data || err.message,
      );
    }
  };

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const formatTime = timestamp => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderItem = ({ item }) => {
    const senderId =
      item.sender_id?.toString() ||
      item.sender?.account_id?.toString() ||
      item.sender?.toString();

    const currentId = currentUser?.toString();
    const isUser = senderId === currentId;

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userContainer : styles.otherContainer,
        ]}
      >
        <Text style={styles.senderName}>
          {item.sender_name || item.sender?.full_name || item.sender}
        </Text>
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.otherBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser ? styles.userText : styles.otherText,
            ]}
          >
            {item.text}
          </Text>
          <Text
            style={[
              styles.timeText,
              isUser ? styles.userTime : styles.otherTime,
            ]}
          >
            {formatTime(item.created_at)}
          </Text>
        </View>
      </View>
    );
  };

  useEffect(() => {
    if (messages.length > 0) scrollToBottom();
  }, [messages]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Icon name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Update</Text>
      </View>

      {/* Chat Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item =>
          (item.message_id || item.id || Math.random()).toString()
        }
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        onContentSizeChange={scrollToBottom}
        ListEmptyComponent={
          !isLoading && (
            <Text style={{ textAlign: 'center', color: '#777' }}>
              No messages yet.
            </Text>
          )
        }
      />

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={text}
          onChangeText={setText}
          multiline
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Icon name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8f9fb' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4266BE',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  messageContainer: {
    marginBottom: 12,
  },
  userContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  senderName: {
    fontSize: 12,
    color: '#555',
    marginBottom: 2,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 12,
    maxWidth: '75%',
  },
  userBubble: {
    backgroundColor: '#e5e7e9',
    borderBottomRightRadius: 2,
  },
  userText: {
    color: '#000',
  },
  userTime: {
    fontSize: 11,
    color: '#333',
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  otherBubble: {
    backgroundColor: '#0084ff',
    borderBottomLeftRadius: 2,
  },
  otherText: {
    color: '#fff',
  },
  otherTime: {
    fontSize: 11,
    color: '#f0f0f0',
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#000',
  },
  sendButton: {
    backgroundColor: '#4266BE',
    padding: 10,
    borderRadius: 8,
    marginLeft: 6,
  },
});
