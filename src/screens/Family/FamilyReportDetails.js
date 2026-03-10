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

const FamilyReportDetails = ({ route, goBack, setScreen }) => {
  const selectedReportId = route?.params?.reportId;
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const res = await getReport(selectedReportId);
        setReport(res.data || res);
      } catch (err) {
        console.error(
          'Error fetching report:',
          err.response || err.message || err,
        );
        Alert.alert('Error', 'Could not load report details');
      } finally {
        setLoading(false);
      }
    };

    if (selectedReportId) fetchReport();
  }, [selectedReportId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4266BE" />
      </View>
    );
  }

  if (!report) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.emptyText}>No report found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Icon name="arrow-left" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Details</Text>
        <View style={{ width: 32 }} />
        <TouchableOpacity
          onPress={() =>
            setScreen('notification', { reportId: selectedReportId })
          }
          style={styles.backButton}
        >
          <Icon name="bell" size={22} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Section title="Reporter">
          <InfoRow label="Name" value={report.reporter?.full_name} />
          <InfoRow
            label="Address"
            value={report.reporter?.family_profile?.address}
          />
          <InfoRow
            label="Submitted"
            value={new Date(report.created_at).toDateString()}
          />
          <InfoRow label="Reported As" value={report.reporter?.role} />
        </Section>

        <Section title="Missing Person">
          <InfoRow label="Full Name" value={report.full_name} />
          <InfoRow label="Age" value={report.age} />
          <InfoRow label="Gender" value={report.gender} />
          <InfoRow label="Last Seen Date" value={report.last_seen_date} />
          <InfoRow label="Location" value={report.last_seen_location} />
          <InfoRow label="Clothing" value={report.clothing} />
          <InfoRow label="Notes" value={report.notes} />
          <InfoRow
            label="Status"
            value={report.status}
            valueStyle={{
              color:
                report.status === 'Missing'
                  ? '#e74c3c'
                  : report.status === 'Ongoing'
                  ? '#f39c12'
                  : '#27ae60',
              fontWeight: '700',
            }}
          />
        </Section>

        {report.media?.length > 0 && (
          <Section title="Attached Media">
            {report.media.map(file => (
              <View
                key={file.media_id || file.id || file.file_url}
                style={styles.mediaWrapper}
              >
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
            setScreen('familySighting', { reportId: selectedReportId })
          }
        >
          <Icon name="eye" size={18} color="#fff" />
          <Text style={styles.sightingText}>View Sighting</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => {
          // pass params however your app expects them
          setScreen('chat', { reportId: selectedReportId });
        }}
      >
        <Icon name="message-circle" size={26} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const Section = ({ title, children }) => (
  <>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
    <View style={[styles.card, styles.leftBorder]}>{children}</View>
  </>
);

const InfoRow = ({ label, value, valueStyle }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={[styles.value, valueStyle]}>{value || '—'}</Text>
  </View>
);

export default FamilyReportDetails;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f8f9fb',
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#777',
    fontSize: 15,
  },
  sectionHeader: {
    marginBottom: 6,
    marginTop: 10,
  },
  sectionHeaderText: {
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
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
