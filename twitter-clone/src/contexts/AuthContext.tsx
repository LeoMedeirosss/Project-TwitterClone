// Context to manage authentication state across the app
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  username: string;
  email: string;
}

// Type definition for the AuthContext
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, userData: User) => void; // Function to log in
  logout: () => void; // Function to log out
  updateUser: (userData: User) => void; // Function to update user info
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component to wrap the app and provide auth state
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user; // True if there is a logged-in user

  // Runs once when the app starts to check if a user is stored in AsyncStorage
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check if token and user data exist in AsyncStorage
  async function checkAuthStatus() {
    try {
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('userData');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.log('Error while checking authentication:', error);
    } finally {
      setLoading(false);
    }
  }

  // Log in: save token and user in AsyncStorage and state
  function login(token: string, userData: User) {
    AsyncStorage.setItem('token', token);
    AsyncStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
  }

  // Log out: remove token and user data from AsyncStorage and state
  function logout() {
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('userData');
    setUser(null);
  }

  // Update user data both in AsyncStorage and state
  function updateUser(updatedUserData: User) {
    AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
    setUser(updatedUserData);
  }

  // Provide the auth state and functions to the rest of the app
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context in any component
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
