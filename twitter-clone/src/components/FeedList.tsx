import React from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import TweetCard from './tweetCard';
import FeedEmptyStates from './FeedEmptyStates';

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

interface FeedListProps {
  tweets: Tweet[];
  loading: boolean;
  refreshing: boolean;
  hasMore: boolean;
  searchUsername: string | null;
  onScroll: any;
  onEndReached: () => void;
  onRefresh: () => void;
  formatTweetData: (tweet: Tweet) => any;
}

export default function FeedList({
  tweets,
  loading,
  refreshing,
  hasMore,
  searchUsername,
  onScroll,
  onEndReached,
  onRefresh,
  formatTweetData
}: FeedListProps) {
  // Footer loader (appears while loading more tweets)
  const renderFooter = () => {
    if (!loading || tweets.length === 0) return null;
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color="#1d9bf0" />
      </View>
    );
  };

  // Empty states component
  const renderEmptyComponent = () => (
    <FeedEmptyStates 
      loading={loading}
      tweetsLength={tweets.length}
      searchUsername={searchUsername}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tweets ? tweets.map(formatTweetData) : []}
        renderItem={({ item }) => <TweetCard tweet={item} />}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        contentContainerStyle={{ paddingTop: 130, paddingBottom: 70 }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#1d9bf0"
            colors={["#1d9bf0"]}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loaderContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
