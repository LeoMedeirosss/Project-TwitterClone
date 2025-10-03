// Component that renders a tweet (user info, content, likes, stats, actions).
// Used inside the feed and profile screens.

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTweets } from '../contexts/TweetContext';
import api from '../services/api';

export default function TweetCard({ tweet }: { tweet: any }) {
  const { user, isAuthenticated } = useAuth();
  const { removeTweet, likeTweet, unlikeTweet } = useTweets();

  // Check if the user is logged in
  const isLoggedIn = isAuthenticated && user;

  // Check if the tweet belongs to the logged-in user
  // Since tweet doesn't contain user.id, compare using username or email
  const isOwner = user && tweet.user && (
    user.username === tweet.user.name ||
    user.email?.split('@')[0] === tweet.user.username ||
    user.username === tweet.user.username
  );

  // Handles tweet deletion with confirmation alert
  async function handleDeleteTweet() {
    Alert.alert(
      'Excluir Tweet',
      'Tem certeza que deseja excluir este tweet?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/tweets/${tweet.id}`);
              removeTweet(tweet.id); // Remove from local context
              Alert.alert('Sucesso', 'Tweet excluído com sucesso!');
            } catch (error) {
              console.error('Error deleting tweet:', error);
              Alert.alert('Erro', 'Não foi possível excluir o tweet. Tente novamente.');
            }
          },
        },
      ]
    );
  }

  async function handleLike() {
    try {
      if (tweet.liked) {
        await unlikeTweet(tweet.id);
      } else {
        await likeTweet(tweet.id);
      }
    } catch (error) {
      console.error('Error updating like:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o like. Tente novamente.');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* User avatar */}
        <View style={styles.avatarPlaceholder}>
          {tweet.avatar_url ? (
            <Image 
              source={{ uri: `http://10.0.2.2:3000${tweet.avatar_url}` }}
              style={styles.avatarImage}
            />
          ) : (
            <Feather name="user" size={20} color="#fff" />
          )}
        </View>

        {/* Tweet content */}
        <View style={{ flex: 1 }}>
          {/* User name, username and timestamp */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.name}>{tweet.user.name}</Text>
            <Text style={styles.username}> @{tweet.user.username} · {tweet.createdAt}</Text>
          </View>

          {/* Tweet text */}
          <Text style={styles.content}>{tweet.content}</Text>

          {/* Optional image */}
          {tweet.image ? (
            <Image source={{ uri: tweet.image }} style={styles.tweetImage} />
          ) : null}

          {/* Tweet actions: comments, retweets, likes, views */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Feather name="message-circle" size={16} color="#888" />
              <Text style={styles.statText}>{tweet.comments}</Text>
            </View>

            <View style={styles.stat}>
              <Feather name="repeat" size={16} color="#888" />
              <Text style={styles.statText}>{tweet.retweets}</Text>
            </View>

            {/* Like button - only enabled for logged-in users */}
            <TouchableOpacity 
              style={[
                styles.likeButton, 
                !isLoggedIn && styles.disabledButton
              ]} 
              onPress={handleLike}
              activeOpacity={isLoggedIn ? 0.7 : 1}
              disabled={!isLoggedIn}
            >
              <Feather 
                name={tweet.liked ? "heart" : "heart"} 
                size={16} 
                color={
                  !isLoggedIn 
                    ? "#555" 
                    : tweet.liked 
                      ? "#e0245e" 
                      : "#888"
                } 
                fill={tweet.liked ? "#e0245e" : "none"}
              />
              <Text style={[
                styles.statText, 
                !isLoggedIn && { color: "#555" },
                tweet.liked && isLoggedIn && { color: "#e0245e" }
              ]}>
                {tweet.likes_count || tweet.likes || 0}
              </Text>
            </TouchableOpacity>

            <View style={styles.stat}>
              <Feather name="bar-chart-2" size={16} color="#888" />
              <Text style={styles.statText}>{tweet.views}</Text>
            </View>

            {/* Delete button only visible for the owner */}
            {isOwner && (
              <TouchableOpacity onPress={handleDeleteTweet} style={styles.deleteButton}>
                <Feather name="trash-2" size={16} color="#888" />
              </TouchableOpacity>
            )}
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
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    padding: 8,
    borderRadius: 20,
    minWidth: 40,
    minHeight: 32,
  },
  disabledButton: {
    opacity: 0.5,
  },
  statText: {
    color: '#888',
    fontSize: 13,
    marginLeft: 3,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 20,
    marginLeft: 'auto'
  },
});
