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
import Icon from '@react-native-vector-icons/feather';
import { getReport } from '../../api/reportApi';

const FamilyReportDetails = ({ selectedReportId, goBack }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await getReport(selectedReportId);
        setReport(res.data);
      } catch (err) {
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
        <ActivityIndicator size="large" color="#015dec" />
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No report found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#f8f9fb' }}
      edges={['top', 'bottom']}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Icon name="arrow-left" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Details</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* Reporter Info */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Reporter</Text>
        </View>
        <View style={[styles.card, styles.leftBorder]}>
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
        </View>

        {/* Case Info */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Missing Person</Text>
        </View>
        <View style={[styles.card, styles.leftBorder]}>
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
        </View>

        {/* Media */}
        {report.media?.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Attached Media</Text>
            </View>
            <View style={[styles.card, styles.leftBorder]}>
              {report.media.map(file => (
                <View key={file.media_id} style={styles.mediaWrapper}>
                  {file.file_type?.startsWith('image') ? (
                    <Image
                      source={{ uri: file.file_url }}
                      style={styles.mediaImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.mediaChip}>
                      <Icon name="paperclip" size={14} color="#015dec" />
                      <Text style={styles.mediaText}>
                        {file.file ? file.file.split('/').pop() : 'Attachment'}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoRow = ({ label, value, valueStyle }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={[styles.value, valueStyle]}>{value || '—'}</Text>
  </View>
);

export default FamilyReportDetails;

const styles = StyleSheet.create({
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
    elevation: 2,
  },
  leftBorder: {
    borderLeftWidth: 4,
    borderLeftColor: '#015dec',
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
  mediaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef4ff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  mediaText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#015dec',
    fontWeight: '500',
  },
  mediaImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
});
