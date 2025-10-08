//Button to create a new tweet
// If user is not authenticated, the button is not rendered
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export default function FloatingButton() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={() => router.push('/app/createTweet')}
    >
      <Ionicons name="add" size={24} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1d9bf0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
});
