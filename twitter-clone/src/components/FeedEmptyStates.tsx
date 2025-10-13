import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface FeedEmptyStatesProps {
  loading: boolean;
  tweetsLength: number;
  searchUsername: string | null;
}

export default function FeedEmptyStates({ loading, tweetsLength, searchUsername }: FeedEmptyStatesProps) {
  // Loading state (initial load)
  if (loading && tweetsLength === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1d9bf0" />
      </View>
    );
  }

  // Empty state for search results
  if (tweetsLength === 0 && searchUsername) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Nenhum tweet encontrado para "{searchUsername}"</Text>
        <Text style={styles.emptySubtitle}>Tente pesquisar por outro nome de usuário.</Text>
      </View>
    );
  }

  // Empty state for no tweets
  if (tweetsLength === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Faça seu primeiro tweet!</Text>
        <Text style={styles.emptySubtitle}>Toque no botão de criar tweet para começar.</Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  loaderContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 120,
  },
  emptyTitle: {
    color: '#e6e6e6',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  emptySubtitle: {
    color: '#9ca3af',
    fontSize: 14,
  },
});
