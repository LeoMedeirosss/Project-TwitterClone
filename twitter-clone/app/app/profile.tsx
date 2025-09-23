//profile screen → shows tweets from a specific user.
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../src/contexts/AuthContext';
import TweetCard from '../../src/components/tweetCard';
import api from '../../src/services/api';

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

export default function Profile() {
  const [userTweets, setUserTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const { user, logout, updateUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      loadUserTweets();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadUserTweets() {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/tweets/${user.id}`);
      setUserTweets(response.data);
    } catch (error) {
      console.error('Erro ao carregar tweets do usuário:', error);
      Alert.alert('Erro', 'Não foi possível carregar seus tweets.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadUserTweets();
    setRefreshing(false);
  }

  function handleLogout() {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/');
          }
        }
      ]
    );
  }

  async function handleAvatarPress() {
    Alert.alert(
      'Foto de Perfil',
      'Escolha uma opção',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Escolher da Galeria', onPress: pickImage },
        { text: 'Remover Foto', style: 'destructive', onPress: removeAvatar }
      ]
    );
  }

  async function pickImage() {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permissão necessária', 'É necessário permitir acesso à galeria para alterar a foto de perfil.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadAvatar(result.assets[0]);
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }
  }

  async function uploadAvatar(imageAsset: any) {
    try {
      setUploadingAvatar(true);

      const formData = new FormData();
      formData.append('avatar', {
        uri: imageAsset.uri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      } as any);

      const response = await api.post('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Atualizar o usuário no contexto com os novos dados
      if (response.data.user) {
        updateUser(response.data.user);
      }

      Alert.alert('Sucesso', 'Foto de perfil atualizada com sucesso!');
      
    } catch (error) {
      console.error('Erro no upload:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a foto de perfil.');
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function removeAvatar() {
    try {
      setUploadingAvatar(true);
      await api.delete('/users/avatar');
      
      // Atualizar o usuário no contexto removendo o avatar
      if (user) {
        updateUser({ ...user, avatar_url: null } as any);
      }
      
      Alert.alert('Sucesso', 'Foto de perfil removida com sucesso!');
    } catch (error) {
      console.error('Erro ao remover avatar:', error);
      Alert.alert('Erro', 'Não foi possível remover a foto de perfil.');
    } finally {
      setUploadingAvatar(false);
    }
  }

  function formatTweetData(tweet: Tweet) {
    const timeAgo = getTimeAgo(tweet.created_at);
    
    return {
      id: tweet.id,
      user: {
        name: tweet.user?.username || user?.username || 'Usuário',
        username: tweet.user?.email?.split('@')[0] || user?.email?.split('@')[0] || 'usuario',
        avatar: '',
      },
      content: tweet.content,
      createdAt: timeAgo,
      likes: tweet.likes_count || 0,
      comments: Math.floor(Math.random() * 100),
      retweets: Math.floor(Math.random() * 50), 
      views: Math.floor(Math.random() * 1000),
      avatar_url: (tweet as any).avatar_url, 
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

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Usuário não encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{user.username}</Text>
          <Text style={styles.headerSubtitle}>{userTweets.length} tweets</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Feather name="log-out" size={20} color="#ff4444" />
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View style={styles.profileSection}>
        <TouchableOpacity 
          style={styles.avatarContainer} 
          onPress={handleAvatarPress}
          disabled={uploadingAvatar}
        >
          <View style={styles.avatar}>
            {(user as any)?.avatar_url ? (
              <Image 
                source={{ uri: `http://10.0.2.2:3000${(user as any).avatar_url}` }}
                style={styles.avatarImage}
              />
            ) : (
              <Feather name="user" size={40} color="#fff" />
            )}
            {uploadingAvatar && (
              <View style={styles.uploadingOverlay}>
                <Text style={styles.uploadingText}>...</Text>
              </View>
            )}
          </View>
          <View style={styles.cameraIcon}>
            <Feather name="camera" size={16} color="#fff" />
          </View>
        </TouchableOpacity>
        
        <View style={styles.userInfo}>
          <Text style={styles.displayName}>{user.username}</Text>
          <Text style={styles.username}>@{user.email?.split('@')[0]}</Text>
          <Text style={styles.joinDate}>
            <Feather name="calendar" size={14} color="#888" />
            {' '}Entrou em {new Date((user as any).created_at || Date.now()).toLocaleDateString('pt-BR', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{userTweets.length}</Text>
            <Text style={styles.statLabel}>Tweets</Text>
          </View>
        </View>
      </View>

      {/* Tweets List */}
      <View style={styles.tweetsSection}>
        <Text style={styles.sectionTitle}>Tweets</Text>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Carregando tweets...</Text>
          </View>
        ) : userTweets.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="message-circle" size={48} color="#333" />
            <Text style={styles.emptyText}>Nenhum tweet ainda</Text>
            <Text style={styles.emptySubtext}>Quando você tweetar, aparecerá aqui.</Text>
          </View>
        ) : (
          <FlatList
            data={userTweets.map(formatTweetData)}
            renderItem={({ item }) => <TweetCard tweet={item} />}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#1d9bf0"
                colors={["#1d9bf0"]}
              />
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  errorText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    backgroundColor: '#000',
  },
  backButton: {
    padding: 10,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#888',
  },
  logoutButton: {
    padding: 10,
  },
  profileSection: {
    padding: 20,
    backgroundColor: '#000',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1d9bf0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1d9bf0',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  uploadingText: {
    color: '#fff',
    fontSize: 12,
  },
  userInfo: {
    marginBottom: 16,
  },
  displayName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  username: {
    fontSize: 15,
    color: '#888',
    marginBottom: 8,
  },
  joinDate: {
    fontSize: 14,
    color: '#888',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
  },
  tweetsSection: {
    flex: 1,
    backgroundColor: '#000',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#888',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
  },
});