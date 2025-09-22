//Component that renders a tweet (user, content, likes).
//Used in the feed and profile.
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function TweetCard({ tweet }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Avatar (pode ser adicionado depois) */}
        <View style={styles.avatarPlaceholder} />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.name}>{tweet.user.name}</Text>
            <Text style={styles.username}> @{tweet.user.username} · {tweet.createdAt}</Text>
          </View>
          <Text style={styles.content}>{tweet.content}</Text>
          {tweet.image ? (
            <Image source={{ uri: tweet.image }} style={styles.tweetImage} />
          ) : null}
          <View style={styles.statsRow}>
            <View style={styles.stat}><Feather name="message-circle" size={16} color="#888" /><Text style={styles.statText}>{tweet.comments}</Text></View>
            <View style={styles.stat}><Feather name="repeat" size={16} color="#888" /><Text style={styles.statText}>{tweet.retweets}</Text></View>
            <View style={styles.stat}><Feather name="heart" size={16} color="#888" /><Text style={styles.statText}>{tweet.likes}</Text></View>
            <View style={styles.stat}><Feather name="bar-chart-2" size={16} color="#888" /><Text style={styles.statText}>{tweet.views}</Text></View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#222',
    marginRight: 10,
  },
  name: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  username: {
    color: '#aaa',
    fontSize: 14,
    marginLeft: 4,
  },
  content: {
    color: '#fff',
    fontSize: 15,
    marginTop: 2,
    marginBottom: 6,
  },
  tweetImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 6,
    marginBottom: 6,
    backgroundColor: '#222',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 18,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statText: {
    color: '#888',
    fontSize: 13,
    marginLeft: 3,
  },
});
