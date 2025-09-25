import React, { createContext, useContext, useState, ReactNode } from 'react';

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
    // Esta função será implementada quando conectarmos com a API real
    // Por enquanto, apenas mantém os tweets existentes
  }

  return (
    <TweetContext.Provider value={{ tweets, addTweet, removeTweet, refreshTweets, setTweets }}>
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
