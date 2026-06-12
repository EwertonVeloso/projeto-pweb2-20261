import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8080' // Porta do seu Spring Boot
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('financas_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});