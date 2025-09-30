// Register page
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../src/services/api';
import type { AxiosError } from 'axios';

// Utility function to validate email format using regex
function validateEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email);
}

// At least 7 characters, one uppercase letter and one number
function validatePassword(password: string) {
  return /^(?=.*[A-Z])(?=.*\d).{7,}$/.test(password);
}

export default function Register() {
  // Local state for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Handles registration process
  async function handleRegister() {
    if (!name) {
      Alert.alert('Nome obrigatório', 'Digite seu nome.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('E-mail inválido', 'Digite um e-mail válido.');
      return;
    }
    if (!validatePassword(password)) {
      Alert.alert(
        'Senha inválida',
        'A senha deve ter no mínimo 7 caracteres, pelo menos uma letra maiúscula e um número.'
      );
      return;
    }

    setLoading(true);
    try {
      // Send register request to backend
      await api.post('/auth/register', { username: name, email, password });

      // Show success and redirect to login
      Alert.alert('Sucesso', 'Cadastro realizado! Faça login.');
      router.replace('/auth/login');
    } catch (err) {
      let message = 'Falha no cadastro.';

      // Handle API error with AxiosError type
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as AxiosError<any>;
        message = error?.response?.data?.message || message;
      } else if (err instanceof Error) {
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
      <Text style={styles.title}>Criar conta</Text>

      {/* Name input */}
      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />

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
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Cadastrando...' : 'Cadastrar'}</Text>
      </TouchableOpacity>

      {/* Navigation links */}
      <TouchableOpacity onPress={() => router.push('/auth/login')}>
        <Text style={styles.link}>Já tem conta? Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/')} style={styles.backButton}>
        <Text style={styles.backButtonText}>Voltar ao feed</Text>
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