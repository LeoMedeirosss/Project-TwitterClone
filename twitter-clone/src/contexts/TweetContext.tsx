import React, { createContext, useContext, useState, ReactNode } from 'react';

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

interface TweetContextType {
  tweets: Tweet[];
  addTweet: (tweet: Tweet) => void;
  removeTweet: (tweetId: string) => void;
  refreshTweets: () => Promise<void>;
  setTweets: (tweets: Tweet[]) => void;
}

const TweetContext = createContext<TweetContextType | undefined>(undefined);

export function TweetProvider({ children }: { children: ReactNode }) {
  const [tweets, setTweetsState] = useState<Tweet[]>(getInitialTweets());

  function getInitialTweets(): Tweet[] {
    return [
      {
        id: '1',
        content: 'Ballon d\'Or rankings.\n9 — Nuno Mendes.\n8 — Gigio Donnarumma.\n7 — Cole Palmer.\n6 — Kylian Mbappé.\n5 — Raphinha.\n4 — Mohamed Salah.\n3 — Vitinha.',
        created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
        likes_count: 51500,
        user: {
          id: '1',
          username: 'FabrizioRomano',
          email: 'fabrizio@gmail.com',
        },
      },
      {
        id: '2',
        content: "OUSMANE DEMBÉLÉ IS THE 2025 MEN'S BALLON D'OR! #ballondor",
        created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
        likes_count: 80000,
        user: {
          id: '2',
          username: 'ballondor',
          email: 'ballondor@hotmail.com',
        },
      },
    ];
  }

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
