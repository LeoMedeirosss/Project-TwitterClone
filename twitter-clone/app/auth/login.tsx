//Login page
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../src/services/api';
import type { AxiosError } from 'axios';

function validateEmail(email: string) {
  // Regex simples para validar formato de e-mail
  return /^\S+@\S+\.\S+$/.test(email);
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin() {
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
      const response = await api.post('/auth/login', { email, password });
      const { token } = response.data;
      await AsyncStorage.setItem('token', token);
      router.replace('/'); // Redireciona para o feed
    } catch (err) {
      let message = 'Falha no login.';
      if (err && typeof err === 'object' && 'response' in err) {
        console.log(err);
        const error = err as AxiosError<any>;
        message = error?.response?.data?.message || message;
      } else if (err instanceof Error) {
        console.log(err);
        message = err.message;
      }
      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/auth/register')}>
        <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

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
});