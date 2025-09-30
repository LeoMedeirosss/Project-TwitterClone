import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Text, ActivityIndicator } from 'react-native';
import TweetCard from './tweetCard';
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

const Feed = forwardRef<FeedRef, { onScroll: any }>(({ onScroll }, ref) => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 10; // Número de tweets por página
  
  const { isAuthenticated } = useAuth();
  const { tweets, setTweets } = useTweets();

  const tweetsRef = React.useRef(tweets);
  tweetsRef.current = tweets;

  const loadingRef = React.useRef(loading);
  loadingRef.current = loading;

  // Definindo a função loadTweets com useCallback para evitar dependência cíclica
  const loadTweets = React.useCallback(async (pageNumber: number, refresh = false) => {
    if (loadingRef.current) return;
    
    try {
      setLoading(true);
      const response = await api.get('/tweets', {
        params: {
          page: pageNumber,
          limit: LIMIT
        }
      });
      
      const newTweets = response.data;
      
      // Verificar se há mais tweets para carregar
      if (newTweets.length < LIMIT) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      
      // Filtrar tweets duplicados usando um Set para armazenar IDs
      if (refresh || pageNumber === 1) {
        setTweets(newTweets);
        setPage(1);
      } else {
        // Criar um conjunto de IDs existentes para evitar duplicatas
        const existingIds = new Set(tweetsRef.current.map(tweet => tweet.id));
        // Filtrar apenas tweets que não existem na lista atual
        const uniqueNewTweets = newTweets.filter((tweet : any) => !existingIds.has(tweet.id));
        
        if (uniqueNewTweets.length > 0) {
          setTweets((prevTweets: Tweet[]) => [...prevTweets, ...uniqueNewTweets]);
        } else {
          // Se não há novos tweets únicos, desativar carregamento infinito
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
    // Carrega tweets da API quando o componente é montado
    if (isAuthenticated) {
      loadTweets(1);
    }
  }, [isAuthenticated, loadTweets]);

  const handleRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setHasMore(true);
    await loadTweets(1, true);
    setRefreshing(false);
  }, [loadTweets]);

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
      likes_count: tweet.likes_count || 0, // Manter ambos para compatibilidade
      liked: tweet.liked || false, // Campo essencial para o toggle
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
    setTweets([newTweet, ...tweets]);
  }

  // Expor a função para outros componentes
  useImperativeHandle(ref, () => ({
    addNewTweet,
  }));

  const handleLoadMore = () => {
    if (hasMore && !loading && !refreshing) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadTweets(nextPage);
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color="#1d9bf0" />
      </View>
    );
  };

  const renderEmptyOrLoading = () => {
    if (loading && tweets.length === 0) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#1d9bf0" />
        </View>
      );
    } else if (tweets.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Faça seu primeiro tweet!</Text>
          <Text style={styles.emptySubtitle}>Toque no botão de criar tweet para começar.</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={tweets ? tweets.map(formatTweetData) : []}
        renderItem={({ item }) => <TweetCard tweet={item} />}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        contentContainerStyle={{ paddingTop: 90, paddingBottom: 70 }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        ListEmptyComponent={renderEmptyOrLoading()}
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

export default Feed;