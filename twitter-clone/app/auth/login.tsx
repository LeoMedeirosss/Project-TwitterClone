// Login page
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../src/services/api';
import { useAuth } from '../../src/contexts/AuthContext';
import type { AxiosError } from 'axios';

// Utility function to validate email format using regex
function validateEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email);
}

export default function Login() {
  // Local state for form inputs and loading indicator
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  // Handles login process
  async function handleLogin() {
    // Basic client-side validations
    if (!validateEmail(email)) {
      Alert.alert('E-mail inválido', 'Digite um e-mail válido.');
      return;
    }
    if (!password) {
      Alert.alert('Senha obrigatória', 'Digite sua senha.');
      return;
    }

    setLoading(true);
    try {
      // Send login request to backend
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      // Save auth data in global context
      login(token, user);

      router.replace('/');
    } catch (err) {
      let message = 'Falha no login.';

      // Handle API error with AxiosError type
      if (err && typeof err === 'object' && 'response' in err) {
        console.log(err);
        const error = err as AxiosError<any>;
        message = error?.response?.data?.message || message;
      } else if (err instanceof Error) {
        console.log(err);
        message = err.message;
      }

      // Show error to user
      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>

      {/* Email input */}
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {/* Password input */}
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Submit button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
      </TouchableOpacity>

      {/* Navigation links */}
      <TouchableOpacity onPress={() => router.push('/auth/register')}>
        <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/')} style={styles.backButton}>
        <Text style={styles.backButtonText}>Voltar ao feed</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles for the Login screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    backgroundColor: '#181818',
    color: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1d9bf0',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    color: '#1d9bf0',
    marginTop: 8,
    fontSize: 15,
  },
  backButton: {
    marginTop: 16,
    padding: 12,
  },
  backButtonText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
});