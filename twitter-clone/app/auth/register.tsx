//Register page
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../src/services/api';
import type { AxiosError } from 'axios';

function validateEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email);
}
function validatePassword(password: string) {
  // Mínimo 7 caracteres, pelo menos uma maiúscula e um número
  return /^(?=.*[A-Z])(?=.*\d).{7,}$/.test(password);
}

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
      Alert.alert('Senha inválida', 'A senha deve ter no mínimo 7 caracteres, pelo menos uma letra maiúscula e um número.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/register', { username: name, email, password });
      Alert.alert('Sucesso', 'Cadastro realizado! Faça login.');
      router.replace('/auth/login');
    } catch (err) {
      let message = 'Falha no cadastro.';
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as AxiosError<any>;
        message = error?.response?.data?.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar conta</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />
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
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Cadastrando...' : 'Cadastrar'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/auth/login')}>
        <Text style={styles.link}>Já tem conta? Entrar</Text>
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