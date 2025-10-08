// handles API communication
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// create axios instance with base configuration
const api = axios.create({
  baseURL: "http://10.0.2.2:3000/api", // Android Emulator local server address
  timeout: 10000, // request timeout in milliseconds
});

// intercepts all outgoing requests to include the authentication token
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Authorization Header:", config.headers.Authorization);
    } else {
      console.log("Nenhum token encontrado no AsyncStorage");
    }
  } catch (error) {
    console.error("Erro ao recuperar token:", error);
  }
  
  console.log(
    `API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
  );
  return config;
});

// intercepts responses to handle errors and logging
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    console.error("API Error:", error.message);
    
    if (error.response && error.response.status === 401) {
      console.error("Erro de autenticação: Token inválido ou expirado");
      
      try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('userData');
        console.log("Token e dados do usuário removidos devido a erro de autenticação");
        
      } catch (storageError) {
        console.error("Erro ao limpar dados de autenticação:", storageError);
      }
    }
    
    // handle network or connection issues
    if (error.code === "NETWORK_ERROR" || error.message === "Network Error") {
      console.error("Verifique se o backend está rodando na porta 3000");
    }
    
    return Promise.reject(error);
  }
);

export default api;
