import axios from 'axios';

const host = (process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8000')
  .trim()
  .replace(/\/+$/, '');

const baseURL = `${host}/api`;

console.log('[API] env =', process.env.EXPO_PUBLIC_API_BASE_URL);
console.log('[API] baseURL =', baseURL);

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// helper to set/remove the bearer token
export function setAuthToken(token?: string) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete (api.defaults.headers.common as any).Authorization;
  }
}

// don't attach Authorization on login
api.interceptors.request.use((config) => {
  if (config.url?.endsWith('/login')) {
    delete (config.headers as any).Authorization;
  }
  return config;
});
