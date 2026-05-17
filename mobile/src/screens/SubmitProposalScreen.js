import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:5001/api/v1';

export default function SubmitProposalScreen({ route, navigation }) {
  const { job } = route.params;
  const [proposalText, setProposalText] = useState('');
  const [proposedPrice, setProposedPrice] = useState('');
  const [proposedTimeline, setProposedTimeline] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!proposalText || !proposedPrice || !proposedTimeline) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      // Backend expects 'jobId', 'proposalText', 'proposedPrice', 'proposedTimeline' at /bookings
      await axios.post(`${API_URL}/bookings`, {
        jobId: job.jobId,
        proposalText,
        proposedPrice: parseFloat(proposedPrice),
        proposedTimeline: parseInt(proposedTimeline, 10),
      });
      
      Alert.alert('Success', 'Your proposal has been submitted to the patron!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      console.error('Proposal error:', err);
      Alert.alert('Error', err.response?.data?.message || 'Failed to submit proposal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.jobSummary}>
          <Text style={styles.jobTitle}>Proposal for: {job.title}</Text>
          <Text style={styles.jobBudget}>Patron Budget: ${job.budgetMax}</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Your Bid Amount ($) *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 120"
            placeholderTextColor="#6b7280"
            keyboardType="numeric"
            value={proposedPrice}
            onChangeText={setProposedPrice}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Estimated Timeline (Days) *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 3"
            placeholderTextColor="#6b7280"
            keyboardType="numeric"
            value={proposedTimeline}
            onChangeText={setProposedTimeline}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cover Letter / Proposal Details *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Explain why you are the best fit for this job..."
            placeholderTextColor="#6b7280"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            value={proposalText}
            onChangeText={setProposalText}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.primaryButtonText}>Send Proposal</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  scrollContent: {
    padding: 24,
  },
  jobSummary: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  jobTitle: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  jobBudget: {
    fontSize: 14,
    color: '#9ca3af',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#d1d5db',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
  },
  textArea: {
    minHeight: 150,
  },
  footer: {
    padding: 24,
    backgroundColor: '#1f2937',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  primaryButton: {
    backgroundColor: '#8b5cf6', // Violet for proposals
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
