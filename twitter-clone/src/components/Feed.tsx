import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import TweetCard from './tweetCard';

const mockTweets = [
  {
    id: '1',
    user: {
      name: 'Fabrizio Romano',
      username: 'FabrizioRomano',
      avatar: '',
    },
    content: 'Ballon d’Or rankings.\n9 — Nuno Mendes.\n8 — Gigio Donnarumma.\n7 — Cole Palmer.\n6 — Kylian Mbappé.\n5 — Raphinha.\n4 — Mohamed Salah.\n3 — Vitinha.',
    createdAt: '1h',
    likes: 51500,
    comments: 2100,
    retweets: 3800,
    views: 1900000,
  },
  {
    id: '2',
    user: {
      name: 'Ballon d\'Or',
      username: 'ballondor',
      avatar: '',
    },
    content: "OUSMANE DEMBÉLÉ IS THE 2025 MEN'S BALLON D'OR! #ballondor",
    createdAt: '1h',
    likes: 80000,
    comments: 5000,
    retweets: 12000,
    views: 2500000,
    image: '',
  },
];

export default function Feed({ onScroll }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={mockTweets}
        renderItem={({ item }) => <TweetCard tweet={item} />}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 90, paddingBottom: 70 }}
        onScroll={onScroll}
        scrollEventThrottle={16}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
