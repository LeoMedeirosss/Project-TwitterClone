// Context to manage tweets state across the app
import React, { createContext, useContext, useState, ReactNode } from 'react';
import api from '../services/api';

interface Tweet {
  id: string;
  content: string;
  created_at: string;
  likes_count: number;
  liked?: boolean; // Whether the logged user has liked this tweet
  user: {
    id: string;
    username: string;
    email: string;
  };
}

interface TweetContextType {
  tweets: Tweet[];
  addTweet: (tweet: Tweet) => void; // Add a new tweet
  removeTweet: (tweetId: string) => void; // Remove a tweet by ID
  refreshTweets: () => Promise<void>; // Reload tweets from API
  setTweets: (tweets: Tweet[]) => void; // Replace all tweets
  likeTweet: (tweetId: string) => Promise<void>;
  unlikeTweet: (tweetId: string) => Promise<void>;
}

// Create the context
const TweetContext = createContext<TweetContextType | undefined>(undefined);

// Provider component to wrap the app and provide tweets state
export function TweetProvider({ children }: { children: ReactNode }) {
  const [tweets, setTweetsState] = useState<Tweet[]>([]); // State for tweets

  // Add a new tweet at the beginning of the list
  function addTweet(newTweet: Tweet) {
    setTweetsState(prevTweets => [newTweet, ...prevTweets]);
  }

  // Remove a tweet by filtering it out
  function removeTweet(tweetId: string) {
    setTweetsState(prevTweets => prevTweets.filter(tweet => tweet.id !== tweetId));
  }

  // Replace the entire tweets state
  function setTweets(newTweets: Tweet[]) {
    setTweetsState(newTweets);
  }

  // Fetch tweets from API and normalize data
  async function refreshTweets() {
    try {
      console.log('🔄 Fetching tweets from API...');
      const response = await api.get('/tweets');
      console.log('📦 Tweets received:', response.data.length);

      // Normalize API data: ensure liked and likes_count exist
      const normalizedTweets = response.data.map((tweet: any) => ({
        ...tweet,
        liked: tweet.liked ?? false,
        likes_count: tweet.likes_count ?? 0,
      }));

      console.log('✅ Tweets normalized:', normalizedTweets.length);
      setTweetsState(normalizedTweets);
    } catch (error) {
      console.error('❌ Error fetching tweets:', error);
    }
  }

  // Like a tweet with optimistic UI update
  async function likeTweet(tweetId: string) {
    console.log('🔥 likeTweet called for ID:', tweetId);
    try {
      // Optimistic update (UI updates immediately)
      setTweetsState(prevTweets =>
        prevTweets.map(tweet =>
          tweet.id === tweetId
            ? { ...tweet, liked: true, likes_count: tweet.likes_count + 1 }
            : tweet
        )
      );

      // Send API request
      console.log('📡 POST to /tweets/' + tweetId + '/like');
      await api.post(`/tweets/${tweetId}/like`);
      console.log('✅ Like successful');
    } catch (error) {
      console.error('❌ Error liking tweet:', error);
      setTweetsState(prevTweets =>
        prevTweets.map(tweet =>
          tweet.id === tweetId
            ? { ...tweet, liked: false, likes_count: Math.max(0, tweet.likes_count - 1) }
            : tweet
        )
      );
    }
  }

  // Unlike a tweet with optimistic UI update
  async function unlikeTweet(tweetId: string) {
    console.log('💔 unlikeTweet called for ID:', tweetId);
    try {
      // Optimistic update (UI updates immediately)
      setTweetsState(prevTweets =>
        prevTweets.map(tweet =>
          tweet.id === tweetId
            ? { ...tweet, liked: false, likes_count: Math.max(0, tweet.likes_count - 1) }
            : tweet
        )
      );

      // Send API request
      console.log('📡 DELETE to /tweets/' + tweetId + '/like');
      await api.delete(`/tweets/${tweetId}/like`);
      console.log('✅ Unlike successful');
    } catch (error) {
      console.error('❌ Error unliking tweet:', error);
      setTweetsState(prevTweets =>
        prevTweets.map(tweet =>
          tweet.id === tweetId
            ? { ...tweet, liked: true, likes_count: tweet.likes_count + 1 }
            : tweet
        )
      );
    }
  }

  // Provide the context values to children
  return (
    <TweetContext.Provider
      value={{ tweets, addTweet, removeTweet, refreshTweets, setTweets, likeTweet, unlikeTweet }}
    >
      {children}
    </TweetContext.Provider>
  );
}

// Custom hook to use TweetContext in any component
export function useTweets() {
  const context = useContext(TweetContext);
  if (context === undefined) {
    throw new Error('useTweets must be used within a TweetProvider');
  }
  return context;
}
