import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../../src/services/api';
import { useAuth } from '../../src/contexts/AuthContext';
import { useTweets } from '../../src/contexts/TweetContext';

const MAX_CHARS = 280;

export default function CreateTweet() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { addTweet } = useTweets();

  async function handleCreateTweet() {
    if (!content.trim()) {
      Alert.alert('Erro', 'O tweet não pode estar vazio.');
      return;
    }

    if (content.length > MAX_CHARS) {
      Alert.alert('Erro', `O tweet não pode ter mais que ${MAX_CHARS} caracteres.`);
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/tweets', { content: content.trim() });
      const newTweet = response.data;
      
      // Simular resposta da API com dados do usuário atual
      const tweetWithUser = {
        ...newTweet,
        user: {
          id: user?.id || '1',
          username: user?.username || 'Usuario',
          email: user?.email || 'usuario@gmail.com',
        }
      };
      
      // Adicionar o tweet ao contexto global
      addTweet(tweetWithUser);
      
      setLoading(false);
      Alert.alert('Sucesso', 'Tweet criado com sucesso!');
      router.back(); // Volta para a tela anterior
    } catch (error) {
      setLoading(false);
      Alert.alert('Erro', 'Falha ao criar o tweet. Tente novamente.');
    }
  }

  function handleCancel() {
    if (content.trim()) {
      Alert.alert(
        'Descartar tweet',
        'Tem certeza que quer descartar este tweet?',
        [
          { text: 'Continuar editando', style: 'cancel' },
          { text: 'Descartar', style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  }

  const charsRemaining = MAX_CHARS - content.length;
  const isOverLimit = content.length > MAX_CHARS;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tweetButton, (!content.trim() || loading) && styles.tweetButtonDisabled]} 
          onPress={handleCreateTweet}
          disabled={!content.trim() || loading}
        >
          <Text style={[styles.tweetButtonText, (!content.trim() || loading) && styles.tweetButtonTextDisabled]}>
            {loading ? 'Tweetando...' : 'Tweetar'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.profileImage}>
          <Ionicons name="person" size={24} color="#fff" />
        </View>
        
        <View style={styles.textContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="O que está acontecendo?"
            placeholderTextColor="#666"
            value={content}
            onChangeText={setContent}
            multiline
            maxLength={MAX_CHARS}
            autoFocus
          />
          
          <View style={styles.footer}>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="image-outline" size={20} color="#1d9bf0" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="happy-outline" size={20} color="#1d9bf0" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="location-outline" size={20} color="#1d9bf0" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.charCounter}>
              <Text style={[styles.charText, isOverLimit && styles.charTextOverLimit]}>
                {charsRemaining}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  tweetButton: {
    backgroundColor: '#1d9bf0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tweetButtonDisabled: {
    backgroundColor: '#333',
  },
  tweetButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  tweetButtonTextDisabled: {
    color: '#666',
  },
  content: {
    flexDirection: 'row',
    padding: 16,
    flex: 1,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  textInput: {
    color: '#fff',
    fontSize: 18,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    padding: 8,
  },
  charCounter: {
    minWidth: 30,
    alignItems: 'center',
  },
  charText: {
    color: '#666',
    fontSize: 14,
  },
  charTextOverLimit: {
    color: '#ff4444',
  },
});