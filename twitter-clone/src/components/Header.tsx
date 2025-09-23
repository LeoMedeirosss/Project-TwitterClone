//Component that renders the header (tabs).
//Used in the feed and profile.
import { Animated, View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

const HEADER_HEIGHT = 90;

interface HeaderProps {
  scrollY: Animated.Value;
  onProfilePress?: () => void;
}

export default function Header({ scrollY, onProfilePress }: HeaderProps) {
  const router = useRouter();
  const { isAuthenticated, logout, user } = useAuth();
  
  const opacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  function handleProfilePress() {
    if (isAuthenticated) {
      onProfilePress?.();
    } else {
      router.push('/auth/login');
    }
  }

  function handleLogout() {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que quer sair do seu perfil?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  }

  return (
    <Animated.View style={[styles.header, { opacity }]}> 
      <View style={styles.headerContent}>
        <TouchableOpacity style={styles.profileIcon} onPress={handleProfilePress}>
          {isAuthenticated && (user as any)?.avatar_url ? (
            <Image 
              source={{ uri: `http://10.0.2.2:3000${(user as any).avatar_url}` }}
              style={styles.profileAvatar}
            />
          ) : (
            <Ionicons name="person-circle-outline" size={32} color="#fff" />
          )}
        </TouchableOpacity>
        <View style={styles.tabsContainer}>
          <View style={styles.tabActive}>
            <Text style={styles.tabTextActive}>Para você</Text>
            <View style={styles.tabIndicator} />
          </View>
          <View style={styles.tab}>
            <Text style={styles.tabText}>Seguindo</Text>
          </View>
        </View>
        {isAuthenticated && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: HEADER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#202020',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    position: 'absolute',
    top: 0,
    zIndex: 10,
  },
  headerContent: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 40,
    position: 'relative',
  },
  profileIcon: {
    position: 'absolute',
    top: 0,
    left: 16,
    zIndex: 1,
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 50,
  },
  logoutButton: {
    position: 'absolute',
    top: 0,
    right: 16,
    zIndex: 1,
    padding: 8,
  },
  tab: {
    padding: 15,
  },
  tabActive: {
    padding: 15,
  },
  tabText: {
    color: '#fff',
    paddingTop: 5,
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: 'bold',
    paddingTop: 5,
  },
  tabIndicator: {
    borderBottomWidth: 2.75,
    borderBottomColor: '#1d9bf0',
    width: '110%',
    alignSelf: 'center',
    borderRadius: 12,
  },
});
