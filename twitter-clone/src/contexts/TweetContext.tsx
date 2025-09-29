import React, { createContext, useContext, useState, ReactNode } from 'react';
import api from '../services/api';

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

interface TweetContextType {
  tweets: Tweet[];
  addTweet: (tweet: Tweet) => void;
  removeTweet: (tweetId: string) => void;
  refreshTweets: () => Promise<void>;
  setTweets: (tweets: Tweet[]) => void;
  likeTweet: (tweetId: string) => Promise<void>;
  unlikeTweet: (tweetId: string) => Promise<void>;
}

const TweetContext = createContext<TweetContextType | undefined>(undefined);

export function TweetProvider({ children }: { children: ReactNode }) {
  const [tweets, setTweetsState] = useState<Tweet[]>([]);

  function addTweet(newTweet: Tweet) {
    setTweetsState(prevTweets => [newTweet, ...prevTweets]);
  }

  function removeTweet(tweetId: string) {
    setTweetsState(prevTweets => prevTweets.filter(tweet => tweet.id !== tweetId));
  }

  function setTweets(newTweets: Tweet[]) {
    setTweetsState(newTweets);
  }

  async function refreshTweets() {
    try {
      console.log('🔄 Buscando tweets da API...');
      const response = await api.get('/tweets');
      console.log('📦 Tweets recebidos:', response.data.length);
      console.log('📦 Primeiro tweet:', JSON.stringify(response.data[0], null, 2));
      
      // Normalizar dados da API para incluir liked como false se não especificado
      const normalizedTweets = response.data.map((tweet: any) => ({
        ...tweet,
        liked: tweet.liked ?? false,
        likes_count: tweet.likes_count ?? 0,
      }));
      console.log('✅ Tweets normalizados:', normalizedTweets.length);
      setTweetsState(normalizedTweets);
    } catch (error) {
      console.error('❌ Erro ao buscar tweets:', error);
    }
  }

  async function likeTweet(tweetId: string) {
    console.log('🔥 likeTweet chamado para ID:', tweetId);
    try {
      // Atualização otimista - atualiza UI imediatamente
      setTweetsState(prevTweets => 
        prevTweets.map(tweet => 
          tweet.id === tweetId 
            ? { ...tweet, liked: true, likes_count: tweet.likes_count + 1 }
            : tweet
        )
      );

      // Chama a API
      console.log('📡 Fazendo POST para /tweets/' + tweetId + '/like');
      await api.post(`/tweets/${tweetId}/like`);
      console.log('✅ Like realizado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao curtir tweet:', error);
      // Reverte a atualização otimista em caso de erro
      setTweetsState(prevTweets => 
        prevTweets.map(tweet => 
          tweet.id === tweetId 
            ? { ...tweet, liked: false, likes_count: Math.max(0, tweet.likes_count - 1) }
            : tweet
        )
      );
    }
  }

  async function unlikeTweet(tweetId: string) {
    console.log('💔 unlikeTweet chamado para ID:', tweetId);
    try {
      // Atualização otimista - atualiza UI imediatamente
      setTweetsState(prevTweets => 
        prevTweets.map(tweet => 
          tweet.id === tweetId 
            ? { ...tweet, liked: false, likes_count: Math.max(0, tweet.likes_count - 1) }
            : tweet
        )
      );

      // Chama a API
      console.log('📡 Fazendo DELETE para /tweets/' + tweetId + '/like');
      await api.delete(`/tweets/${tweetId}/like`);
      console.log('✅ Unlike realizado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao descurtir tweet:', error);
      // Reverte a atualização otimista em caso de erro
      setTweetsState(prevTweets => 
        prevTweets.map(tweet => 
          tweet.id === tweetId 
            ? { ...tweet, liked: true, likes_count: tweet.likes_count + 1 }
            : tweet
        )
      );
    }
  }

  return (
    <TweetContext.Provider value={{ tweets, addTweet, removeTweet, refreshTweets, setTweets, likeTweet, unlikeTweet }}>
      {children}
    </TweetContext.Provider>
  );
}

export function useTweets() {
  const context = useContext(TweetContext);
  if (context === undefined) {
    throw new Error('useTweets must be used within a TweetProvider');
  }
  return context;
}
