import api from './api';

export interface LoginParams {
  username: string;
  password: string;
}

export interface RegisterParams {
  username: string;
  password: string;
}

export interface UserInfo {
  id: string;
  username: string;
  role: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: UserInfo;
}

export interface RegisterResponse {
  message: string;
  user: UserInfo;
}

// 登录
export const login = async (params: LoginParams): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/users/login', params);
  return response.data;
};

// 注册
export const register = async (params: RegisterParams): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>('/users/register', params);
  return response.data;
};

// 获取用户信息
export const getProfile = async (): Promise<{ user: UserInfo }> => {
  const response = await api.get<{ user: UserInfo }>('/users/profile');
  return response.data;
};
