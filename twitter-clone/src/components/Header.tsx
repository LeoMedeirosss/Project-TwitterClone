// Component that renders the header (tabs).
// Used in the feed and profile screens.
import { Animated, View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import SearchBar from './SearchBar';

const HEADER_HEIGHT = 130; // Aumentado para acomodar a barra de pesquisa

interface HeaderProps {
  scrollY: Animated.Value;
  onProfilePress?: () => void;
  onSearch?: (username: string) => void;
}

export default function Header({ scrollY, onProfilePress, onSearch }: HeaderProps) {
  const router = useRouter();
  const { isAuthenticated, logout, user } = useAuth();
  
  // Interpolates opacity based on scroll position
  const opacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // Handles profile press (redirects to login if not authenticated)
  function handleProfilePress() {
    if (isAuthenticated) {
      onProfilePress?.();
    } else {
      router.push('/auth/login');
    }
  }

  // Handles logout confirmation
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

        {/* Profile button: shows avatar if logged in, otherwise default icon */}
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

        {/* Tabs (For You / Following) */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabActive}>
            <Text style={styles.tabTextActive}>Para você</Text>
            <View style={styles.tabIndicator} />
          </View>
          <View style={styles.tab}>
            <Text style={styles.tabText}>Seguindo</Text>
          </View>
        </View>

        {/* Logout button (only visible if authenticated) */}
        {isAuthenticated && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <SearchBar onSearch={onSearch || ((username) => console.log('Pesquisando por:', username))} />
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
    backgroundColor: '#101010',
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
    left: 15,
    zIndex: 1,
    bottom: 8,
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
    right: 16,
    zIndex: 1,
    padding: 8,
    bottom: 6,
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
  searchBarContainer: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 5,
    marginBottom: 10,
  },
});