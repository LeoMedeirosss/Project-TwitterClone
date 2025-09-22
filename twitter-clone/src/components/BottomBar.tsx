import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function BottomBar() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Ionicons name="home-outline" size={28} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Feather name="search" size={26} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/auth/login')}>
        <Feather name="more-horizontal" size={26} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity>
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
