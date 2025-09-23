import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import TweetCard from './tweetCard';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useTweets } from '../contexts/TweetContext';

interface Tweet {
  id: string;
  content: string;
  created_at: string;
  likes_count: number;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

interface FeedRef {
  addNewTweet: (tweet: Tweet) => void;
}

const Feed = forwardRef<FeedRef, { onScroll: any }>(({ onScroll }, ref) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { isAuthenticated } = useAuth();
  const { tweets, setTweets, refreshTweets } = useTweets();

  useEffect(() => {
    setLoading(false); // Os tweets já vêm do contexto
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      const response = await api.get('/tweets');
      setTweets(response.data);
    } catch (error) {
      console.log('Erro ao buscar tweets:', error);
    }
    setRefreshing(false);
  }

  function formatTweetData(tweet: Tweet) {
    // Verificar se tweet.user existe e tem email
    const userEmail = tweet.user?.email || 'usuario@gmail.com';
    const username = userEmail.split('@')[0]; // Remove @gmail.com etc
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
      comments: Math.floor(Math.random() * 1000),
      retweets: Math.floor(Math.random() * 500), 
      views: Math.floor(Math.random() * 100000),
      avatar_url: (tweet as any).avatar_url, // Incluir avatar_url do tweet
    };
  }

  function getTimeAgo(dateString: string) {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  }

  // Função para adicionar novo tweet (será chamada quando um tweet for criado)
  function addNewTweet(newTweet: Tweet) {
    setTweets(prevTweets => [newTweet, ...prevTweets]);
  }

  // Expor a função para outros componentes
  useImperativeHandle(ref, () => ({
    addNewTweet,
  }));

  return (
    <View style={styles.container}>
      <FlatList
        data={tweets ? tweets.map(formatTweetData) : []}
        renderItem={({ item }) => <TweetCard tweet={item} />}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 90, paddingBottom: 70 }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#1d9bf0"
            colors={["#1d9bf0"]}
          />
        }
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