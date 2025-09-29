//Component that renders a tweet (user, content, likes).
//Used in the feed and profile.
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTweets } from '../contexts/TweetContext';
import api from '../services/api';

export default function TweetCard({ tweet }: { tweet: any }) {
  const { user, isAuthenticated } = useAuth();
  const { removeTweet, likeTweet, unlikeTweet } = useTweets();

  // Verifica se o usuário está logado
  const isLoggedIn = isAuthenticated && user;

  // Verifica se o tweet pertence ao usuário logado
  // Como o tweet não tem user.id, vamos usar o username ou email para comparar
  const isOwner = user && tweet.user && (
    user.username === tweet.user.name || // Compara nome completo
    user.email?.split('@')[0] === tweet.user.username || // Compara username do email
    user.username === tweet.user.username // Compara username direto
  );

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
              removeTweet(tweet.id); // Remove do contexto local
              Alert.alert('Sucesso', 'Tweet excluído com sucesso!');
            } catch (error) {
              console.error('Erro ao excluir tweet:', error);
              Alert.alert('Erro', 'Não foi possível excluir o tweet. Tente novamente.');
            }
          },
        },
      ]
    );
  }

  async function handleLike() {
    // Verifica se o usuário está logado
    if (!isLoggedIn) {
      Alert.alert(
        'Login Necessário', 
        'Você precisa estar logado para curtir tweets.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    console.log('=== DEBUG LIKE ===');
    console.log('Tweet ID:', tweet.id);
    console.log('Tweet liked:', tweet.liked);
    console.log('Tweet likes_count:', tweet.likes_count);
    
    try {
      if (tweet.liked) {
        console.log('🔴 Descurtindo tweet...');
        await unlikeTweet(tweet.id);
      } else {
        console.log('❤️ Curtindo tweet...');
        await likeTweet(tweet.id);
      }
    } catch (error) {
      console.error('Erro ao atualizar like:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o like. Tente novamente.');
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Avatar do usuário */}
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
            <View style={styles.stat}><Feather name="bar-chart-2" size={16} color="#888" /><Text style={styles.statText}>{tweet.views}</Text></View>
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
