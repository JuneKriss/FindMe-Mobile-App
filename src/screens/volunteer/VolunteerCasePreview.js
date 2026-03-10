import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Icon from '@react-native-vector-icons/feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getReport } from '../../api/reportApi';

const VolunteerCasePreview = ({ goBack, setScreen, selectedReportId }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await getReport(selectedReportId);
        setReport(res.data || res);
      } catch (err) {
        Alert.alert('Error', 'Could not load case.');
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

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Icon name="arrow-left" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Case Preview</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        {/* Missing Person Section */}
        <Section title="Missing Person">
          <Info label="Full Name" value={report.full_name} />
          <Info label="Age" value={report.age} />
          <Info label="Gender" value={report.gender} />
          <Info label="Last Seen" value={report.last_seen_location} />
          <Info label="Date" value={report.last_seen_date} />
          <Info label="Clothing" value={report.clothing} />
          <Info label="Status" value={report.status} status />
        </Section>

        {/* Reporter Section */}
        <Section title="Reporter">
          <Info label="Name" value={report.reporter?.full_name} />
          <Info label="Contact" value={report.reporter?.email} />
          <Info
            label="Address"
            value={report.reporter?.family_profile?.address}
          />
        </Section>

        {/* Attachments Section */}
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
      </ScrollView>
    </SafeAreaView>
  );
};

// Reusable Section
const Section = ({ title, children }) => (
  <>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    <View style={[styles.card, styles.leftBorder]}>{children}</View>
  </>
);

// Reusable Info row
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

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f8f9fb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  container: {
    padding: 16,
  },
  sectionHeader: {
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  leftBorder: {
    borderLeftWidth: 4,
    borderLeftColor: '#4266BE',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  label: {
    fontSize: 14,
    color: '#555',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  mediaWrapper: {
    marginBottom: 8,
  },
  mediaImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  mediaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    padding: 6,
    borderRadius: 6,
  },
  mediaText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#333',
  },
  assistBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  assistText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VolunteerCasePreview;
