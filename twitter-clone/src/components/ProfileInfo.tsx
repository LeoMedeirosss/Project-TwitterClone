import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface User {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  created_at?: string;
}

interface ProfileInfoProps {
  user: User;
  tweetsCount: number;
  uploadingAvatar: boolean;
  onAvatarPress: () => void;
}

export default function ProfileInfo({ 
  user, 
  tweetsCount, 
  uploadingAvatar, 
  onAvatarPress 
}: ProfileInfoProps) {
  return (
    <View style={styles.profileSection}>
      <TouchableOpacity 
        style={styles.avatarContainer} 
        onPress={onAvatarPress}
        disabled={uploadingAvatar}
      >
        <View style={styles.avatar}>
          {user?.avatar_url ? (
            <Image 
              source={{ uri: `http://10.0.2.2:3000${user.avatar_url}` }}
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
          {' '}Entrou em {new Date(user.created_at || Date.now()).toLocaleDateString('pt-BR', { 
            month: 'long', 
            year: 'numeric' 
          })}
        </Text>
      </View>

      {/* User stats */}
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{tweetsCount}</Text>
          <Text style={styles.statLabel}>Tweets</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
