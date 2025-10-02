import axios from 'axios';
import { getToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Device {
  id?: number;
  hostname: string;
  ip_address: string;
  device_type: string;
  platform?: string;
  vendor?: string;
  model?: string;
  ssh_port?: number;
  username?: string;
  password?: string;
  enable_password?: string;
  status?: string;
  description?: string;
  location?: string;
  last_sync?: string;
  configuration?: string;
  owner_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id?: number;
  username: string;
  email: string;
  full_name?: string;
  role: string;
  is_active?: boolean;
  created_at?: string;
}

// Device API
export const getDevices = async () => {
  const response = await api.get('/api/devices');
  return response.data;
};

export const getDevice = async (id: number) => {
  const response = await api.get(`/api/devices/${id}`);
  return response.data;
};

export const createDevice = async (device: Device) => {
  const response = await api.post('/api/devices', device);
  return response.data;
};

export const updateDevice = async (id: number, device: Partial<Device>) => {
  const response = await api.put(`/api/devices/${id}`, device);
  return response.data;
};

export const deleteDevice = async (id: number) => {
  const response = await api.delete(`/api/devices/${id}`);
  return response.data;
};

// User API
export const getUsers = async () => {
  const response = await api.get('/api/users');
  return response.data;
};

export const getUser = async (id: number) => {
  const response = await api.get(`/api/users/${id}`);
  return response.data;
};

export const updateUser = async (id: number, user: Partial<User>) => {
  const response = await api.put(`/api/users/${id}`, user);
  return response.data;
};

export const deleteUser = async (id: number) => {
  const response = await api.delete(`/api/users/${id}`);
  return response.data;
};

export default api;
