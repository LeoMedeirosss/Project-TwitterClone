import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export default function BottomBar() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  function handlePress(route: string) {
    if (isAuthenticated) {
      // Se logado, não fazer nada ou ir para outra tela
      console.log('Usuário logado - funcionalidade ainda não implementada');
    } else {
      router.push('/auth/login');
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Ionicons name="home-outline" size={28} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handlePress('search')}>
        <Feather name="search" size={26} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handlePress('more')}>
        <Feather name="more-horizontal" size={26} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handlePress('notifications')}>
        <Ionicons name="notifications-outline" size={26} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Feather name="mail" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#181818',
    height: 60,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    zIndex: 10,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
});
