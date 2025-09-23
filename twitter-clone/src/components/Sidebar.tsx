import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Easing, Image } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

export default function Sidebar({ visible, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const slideAnim = React.useRef(new Animated.Value(-width * 0.7)).current;
  const overlayOpacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      // Animação de entrada: aparece da esquerda para a direita com curva suave
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animação de saída: volta da direita para a esquerda com curva suave
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -width * 0.7,
          duration: 300,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Garante que a sidebar seja completamente removida após a animação
        slideAnim.setValue(-width * 0.7);
      });
    }
  }, [visible]);

  function handleLogout() {
    logout();
    onClose();
  }

  function handleProfilePress() {
    router.push('/app/profile');
    onClose();
  }

  if (!visible) return null;

  return (
    <>
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <TouchableOpacity style={styles.overlayTouchable} onPress={onClose} />
      </Animated.View>
      
      <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
        {/* Header do usuário */}
        <View style={styles.userSection}>
          <View style={styles.profileImage}>
            {(user as any)?.avatar_url ? (
              <Image 
                source={{ uri: `http://10.0.2.2:3000${(user as any).avatar_url}` }}
                style={styles.profileAvatar}
              />
            ) : (
              <Ionicons name="person" size={60} color="#fff" />
            )}
          </View>
          <Text style={styles.userName}>{user?.username || 'Usuário'}</Text>
          <Text style={styles.userHandle}>@{user?.username?.toLowerCase() || 'usuario'}</Text>
          <View style={styles.followStats}>
            <Text style={styles.followText}>372 Seguindo</Text>
            <Text style={styles.followText}>92 Seguidores</Text>
          </View>
        </View>

        {/* Menu items */}
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem} onPress={handleProfilePress}>
            <Ionicons name="person-outline" size={24} color="#fff" />
            <Text style={styles.menuText}>Perfil</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="diamond-outline" size={24} color="#fff" />
            <Text style={styles.menuText}>Premium</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="play-outline" size={24} color="#fff" />
            <Text style={styles.menuText}>Vídeo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="chatbubble-outline" size={24} color="#fff" />
            <Text style={styles.menuText}>Bate-papo</Text>
            <View style={styles.betaTag}>
              <Text style={styles.betaText}>BETA</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="people-outline" size={24} color="#fff" />
            <Text style={styles.menuText}>Comunidades</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="bookmark-outline" size={24} color="#fff" />
            <Text style={styles.menuText}>Itens salvos</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="list-outline" size={24} color="#fff" />
            <Text style={styles.menuText}>Listas</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="radio-outline" size={24} color="#fff" />
            <Text style={styles.menuText}>Espaços</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="cash-outline" size={24} color="#fff" />
            <Text style={styles.menuText}>Monetização</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom section */}
        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="settings-outline" size={24} color="#fff" />
            <Text style={styles.menuText}>Configurações e privacidade</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={24} color="#fff" />
            <Text style={styles.menuText}>Central de Ajuda</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
            <Text style={styles.menuText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  overlayTouchable: {
    flex: 1,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: width * 0.7,
    backgroundColor: '#000',
    zIndex: 1001,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  userSection: {
    marginBottom: 30,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    overflow: 'hidden',
  },
  profileAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  userName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userHandle: {
    color: '#888',
    fontSize: 16,
    marginBottom: 15,
  },
  followStats: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 15,
  },
  followText: {
    color: '#888',
    fontSize: 14,
  },
  menuSection: {
    marginBottom: 30,
  },
  bottomSection: {
    marginTop: 'auto',
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  menuText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 15,
    flex: 1,
  },
  betaTag: {
    backgroundColor: '#1d9bf0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 10,
  },
  betaText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
