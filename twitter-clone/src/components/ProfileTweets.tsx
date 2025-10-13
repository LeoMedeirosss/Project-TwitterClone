import React from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Feather } from '@expo/vector-icons';
import TweetCard from './tweetCard';

interface Tweet {
  id: string;
  content: string;
  created_at: string;
  likes_count: number;
  liked?: boolean;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

interface ProfileTweetsProps {
  tweets: Tweet[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  formatTweetData: (tweet: Tweet) => any;
}

export default function ProfileTweets({ 
  tweets, 
  loading, 
  refreshing, 
  onRefresh, 
  formatTweetData 
}: ProfileTweetsProps) {
  return (
    <View style={styles.tweetsSection}>
      <Text style={styles.sectionTitle}>Tweets</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando tweets...</Text>
        </View>
      ) : tweets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="message-circle" size={48} color="#333" />
          <Text style={styles.emptyText}>Nenhum tweet ainda</Text>
          <Text style={styles.emptySubtext}>Quando você tweetar, aparecerá aqui.</Text>
        </View>
      ) : (
        <FlatList
          data={tweets.map(formatTweetData)}
          renderItem={({ item }) => <TweetCard tweet={item} />}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#1d9bf0"
              colors={["#1d9bf0"]}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tweetsSection: {
    flex: 1,
    backgroundColor: '#000',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#888',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
  },
});
