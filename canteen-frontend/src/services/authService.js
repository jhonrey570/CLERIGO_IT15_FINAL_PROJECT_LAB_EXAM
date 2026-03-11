 import api from './api';

export const login = async (email, password) => {
  const response = await api.post('/login', { email, password });
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/logout');
  return response.data;
};

export const register = async (name, email, password, password_confirmation, role) => {
  const response = await api.post('/register', {
    name, email, password, password_confirmation, role
  });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/me');
  return response.data;
};
