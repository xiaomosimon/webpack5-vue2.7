import { $axios } from './axiosInstance';

export interface FetchLoginParams {
  username: string;
  password: string;
}

export interface FetchChangeUserInfoParams {
  password?: string;
  locale: LocalesUnion;
}

export const login = (params: FetchLoginParams) =>
  $axios.get('/rest/login', { params });

export const changeUserInfo = (params: FetchChangeUserInfoParams) =>
  $axios.post('/rest/change/user', params);
