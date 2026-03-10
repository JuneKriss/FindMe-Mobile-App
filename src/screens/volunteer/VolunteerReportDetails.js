import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { getReport } from '../../api/reportApi';
import { createSighting } from '../../api/sightingApi';

const VolunteerReportDetails = ({ setScreen, goBack, selectedReportId }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const response = await getReport(selectedReportId);
        setReport(response.data || response);
      } catch (err) {
        console.error('Error fetching report', err);
        Alert.alert('Error', 'Could not load report details.');
      } finally {
        setLoading(false);
      }
    };
    if (selectedReportId) fetchReport();
  }, [selectedReportId]);

  const handleSendUpdate = async () => {
    if (!notes.trim()) {
      return Alert.alert('Missing Field', 'Please enter an update first.');
    }

    setSending(true);
    try {
      await createSighting({ report: selectedReportId, notes });
      Alert.alert('Success', 'Your update has been submitted.');
      setNotes('');
    } catch (err) {
      console.error('Error sending update:', err);
      Alert.alert('Error', 'Failed to send update. Try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4266BE" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Icon name="arrow-left" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Case Details</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        <Section title="Missing Person">
          <Info label="Full Name" value={report.full_name} />
          <Info label="Age" value={report.age} />
          <Info label="Gender" value={report.gender} />
          <Info label="Last Seen" value={report.last_seen_location} />
          <Info label="Date" value={report.last_seen_date} />
          <Info label="Clothing" value={report.clothing} />
          <Info label="Status" value={report.status} status />
        </Section>

        <Section title="Reporter">
          <Info label="Name" value={report.reporter?.full_name} />
          <Info label="Contact" value={report.reporter?.email} />
          <Info
            label="Address"
            value={report.reporter?.family_profile?.address}
          />
        </Section>

        {report.media?.length > 0 && (
          <Section title="Attachments">
            {report.media.map((file, index) => (
              <View key={index} style={styles.mediaWrapper}>
                {file.file_type?.startsWith('image') ? (
                  <Image
                    source={{ uri: file.file_url }}
                    style={styles.mediaImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.mediaChip}>
                    <Icon name="paperclip" size={14} color="#4266BE" />
                    <Text style={styles.mediaText}>
                      {file.file ? file.file.split('/').pop() : 'Attachment'}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </Section>
        )}

        <TouchableOpacity
          style={styles.sightingButton}
          onPress={() =>
            setScreen('reportSighting', { reportId: selectedReportId })
          }
        >
          <Icon name="eye" size={18} color="#fff" />
          <Text style={styles.sightingText}>Report a Sighting</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Chat Floating Button */}
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => setScreen('chat', { reportId: selectedReportId })}
      >
        <Icon name="message-circle" size={26} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const Section = ({ title, children }) => (
  <>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    <View style={[styles.card, styles.leftBorder]}>{children}</View>
  </>
);

const Info = ({ label, value, status }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}</Text>
    <Text
      style={[
        styles.value,
        status && {
          color:
            value === 'Missing'
              ? '#e74c3c'
              : value === 'Ongoing'
              ? '#f39c12'
              : '#27ae60',
          fontWeight: '700',
        },
      ]}
    >
      {value || '—'}
    </Text>
  </View>
);

export default VolunteerReportDetails;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f8f9fb',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  backButton: {
    padding: 6,
    borderRadius: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    marginBottom: 6,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  leftBorder: {
    borderLeftWidth: 4,
    borderLeftColor: '#4266BE',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    color: '#888',
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    flexShrink: 1,
    textAlign: 'right',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textArea: {
    flex: 1,
    backgroundColor: '#f1f3f6',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#4266BE',
    padding: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaWrapper: {
    marginBottom: 10,
  },
  mediaImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 6,
  },
  mediaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef4ff',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  mediaText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#4266BE',
    fontWeight: '500',
  },
  chatButton: {
    position: 'absolute',
    bottom: 60,
    right: 20,
    backgroundColor: '#4266BE',
    borderRadius: 50,
    padding: 16,
    elevation: 5,
  },
  sightingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2e86de',
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 10,
    gap: 8,
  },
  sightingText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
