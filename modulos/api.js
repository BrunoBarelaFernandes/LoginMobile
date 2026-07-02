import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.144.181.72:3009'; 
const CHAVE_ESPERTINHO = "chave_para_desencorajar_curiosos_123";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('@Token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    config.headers['x-api-key'] = CHAVE_ESPERTINHO;
    config.chave = CHAVE_ESPERTINHO;
    
  } catch (error) {
    console.error("Erro ao recuperar token", error);
  }
  return config;
});

export default api;