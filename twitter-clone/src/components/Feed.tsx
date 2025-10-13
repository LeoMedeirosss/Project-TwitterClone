import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet } from 'react-native';
import FeedList from './FeedList';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useTweets } from '../contexts/TweetContext';

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

interface FeedRef {
  addNewTweet: (tweet: Tweet) => void;
}

// Feed component using forwardRef to expose functions externally
const Feed = forwardRef<FeedRef, { onScroll: any }>(({ onScroll }, ref) => {
  const [refreshing, setRefreshing] = useState(false); // Pull-to-refresh state
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // Controls infinite scroll
  const [searchUsername, setSearchUsername] = useState<string | null>(null); // New state for search
  const LIMIT = 10; // Number of tweets per page
  
  const { isAuthenticated } = useAuth();
  const { tweets, setTweets } = useTweets();

  const tweetsRef = React.useRef(tweets);
  tweetsRef.current = tweets;

  const loadingRef = React.useRef(loading);
  loadingRef.current = loading;

  const loadTweets = React.useCallback(async (pageNumber: number, refresh = false, username: string | null = null) => {
    if (loadingRef.current) return; // Prevent duplicate calls while loading
    
    try {
      setLoading(true);
      const endpoint = username ? 'tweets/search' : 'tweets';
      const params: any = {
        page: pageNumber,
        limit: LIMIT
      };
      if (username) {
        params.username = username;
      }

      const response = await api.get(endpoint, {
        params
      });
      
      const newTweets = response.data;
      
      if (newTweets.length < LIMIT) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      
      // Replace tweets if refreshing, otherwise append unique tweets
      if (refresh || pageNumber === 1) {
        setTweets(newTweets);
        setPage(1);
      } else {
        const existingIds = new Set(tweetsRef.current.map(tweet => tweet.id));
        const uniqueNewTweets = newTweets.filter((tweet: any) => !existingIds.has(tweet.id));
        
        if (uniqueNewTweets.length > 0) {
          setTweets([...tweetsRef.current, ...uniqueNewTweets]);
        } else {
          setHasMore(false);
        }
      }
      
    } catch (error) {
      console.log('Erro ao buscar tweets:', error);
    } finally {
      setLoading(false);
    }
  }, [setTweets]);

  useEffect(() => {
    if (isAuthenticated) {
      loadTweets(1, true, searchUsername);
    }
  }, [isAuthenticated, loadTweets, searchUsername]);

  const handleRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setHasMore(true);
    await loadTweets(1, true, searchUsername);
    setRefreshing(false);
  }, [loadTweets, searchUsername]);

  const handleSearch = React.useCallback((username: string) => {
    setSearchUsername(username);
    setPage(1);
    setHasMore(true);
    setTweets([]); // Clear current tweets to show search results
    loadTweets(1, true, username);
  }, [loadTweets, setTweets]);

  // Format API tweet into UI-friendly object
  function formatTweetData(tweet: Tweet) {
    const userEmail = tweet.user?.email || 'usuario@gmail.com';
    const username = tweet.user?.username || userEmail.split('@')[0]; // Use prefix of email as fallback username
    const timeAgo = getTimeAgo(tweet.created_at);
    
    return {
      id: tweet.id,
      user: {
        name: tweet.user?.username || 'Usuário',
        username: username,
        avatar: '',
      },
      content: tweet.content,
      createdAt: timeAgo,
      likes: tweet.likes_count || 0,
      likes_count: tweet.likes_count || 0,
      liked: tweet.liked || false, // Needed for toggle like feature
      comments: Math.floor(Math.random() * 1000),
      retweets: Math.floor(Math.random() * 500), 
      views: Math.floor(Math.random() * 100000),
      avatar_url: (tweet as any).avatar_url,
    };
  }

  // Utility: convert timestamp into "time ago" format
  function getTimeAgo(dateString: string) {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  }

  // Add new tweet at the top of the list
  function addNewTweet(newTweet: Tweet) {
    setTweets([newTweet, ...tweets]);
  }

  // Expose addNewTweet via ref so parent components can call it
  useImperativeHandle(ref, () => ({
    addNewTweet,
    handleSearch
  }));

  // Load more tweets when user reaches the end of the list
  const handleLoadMore = () => {
    if (hasMore && !loading && !refreshing) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadTweets(nextPage, false, searchUsername);
    }
  };

  return (
    <View style={styles.container}>
      <FeedList
        tweets={tweets}
        loading={loading}
        refreshing={refreshing}
        hasMore={hasMore}
        searchUsername={searchUsername}
        onScroll={onScroll}
        onEndReached={handleLoadMore}
        onRefresh={handleRefresh}
        formatTweetData={formatTweetData}
      />
    </View>
  );
});

Feed.displayName = 'Feed';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default Feed;