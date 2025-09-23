//api comunication
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "http://10.0.2.2:3000", // Para Android Emulator
  timeout: 10000,
});

// Intercepta requests e adiciona token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});

// Intercepta responses para melhor tratamento de erros
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Error:', error.message);
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      console.error('Verifique se o backend está rodando na porta 3000');
    }
    return Promise.reject(error);
  }
);

export default api;
