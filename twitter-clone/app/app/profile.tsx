// Profile screen → shows tweets from the logged-in user
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../src/contexts/AuthContext';
import ProfileHeader from '../../src/components/ProfileHeader';
import ProfileInfo from '../../src/components/ProfileInfo';
import ProfileTweets from '../../src/components/ProfileTweets';
import api from '../../src/services/api';

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

export default function Profile() {
  // State to store user tweets
  const [userTweets, setUserTweets] = useState<Tweet[]>([]);
  // Loading state when fetching tweets
  const [loading, setLoading] = useState(true);
  // State for pull-to-refresh
  const [refreshing, setRefreshing] = useState(false);
  // State while uploading or removing avatar
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const { user, logout, updateUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      loadUserTweets();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch user tweets from API
  async function loadUserTweets() {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/tweets/${user.id}`);
      
      // Normalizar os dados para garantir que o campo liked exista
      const normalizedTweets = response.data.map((tweet: any) => ({
        ...tweet,
        liked: tweet.liked ?? false,
        likes_count: tweet.likes_count ?? 0,
      }));
      
      setUserTweets(normalizedTweets);
    } catch (error) {
      console.error('Erro ao carregar tweets do usuário:', error);
      Alert.alert('Erro', 'Não foi possível carregar seus tweets.');
    } finally {
      setLoading(false);
    }
  }

  // Refresh tweets when pulling down
  async function handleRefresh() {
    setRefreshing(true);
    await loadUserTweets();
    setRefreshing(false);
  }

  // Logout confirmation
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

  // Handle avatar press → choose between gallery or remove
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

  // Open image picker to select new avatar
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

  // Upload avatar to API
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

      // Update user in context with new avatar
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
      
      // Update user in context removing avatar_url
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

  // Format tweet data for rendering in TweetCard
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
      likes_count: tweet.likes_count || 0,
      liked: tweet.liked || false,
      comments: Math.floor(Math.random() * 100), // Mocked comments
      retweets: Math.floor(Math.random() * 50),  // Mocked retweets
      views: Math.floor(Math.random() * 1000),   // Mocked views
      avatar_url: (tweet as any).avatar_url, 
    };
  }

  // Format timestamp → "Agora", "Xm", "Xh", "Xd"
  function getTimeAgo(dateString: string) {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  }

  // If user not found
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Usuário não encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProfileHeader 
        username={user.username}
        tweetsCount={userTweets.length}
        onLogout={handleLogout}
      />

      <ProfileInfo 
        user={user}
        tweetsCount={userTweets.length}
        uploadingAvatar={uploadingAvatar}
        onAvatarPress={handleAvatarPress}
      />

      <ProfileTweets 
        tweets={userTweets}
        loading={loading}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        formatTweetData={formatTweetData}
      />
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
});