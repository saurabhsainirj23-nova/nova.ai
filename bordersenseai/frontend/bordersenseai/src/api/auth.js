import { request } from '../api/client';

export const login = (username, password) => 
  request('/auth/login', { method: 'POST', body: { username, password } });

export const logout = () => 
  request('/auth/logout', { method: 'POST' });

export const refreshToken = (refreshToken) => 
  request('/auth/refresh-token', { method: 'POST', body: { refresh_token: refreshToken } });