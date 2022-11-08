import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  login,
  changeUserInfo,
  FetchLoginParams,
  FetchChangeUserInfoParams,
} from '@/request/userApis';

export type RolesTuple = ['admin', 'operator', 'shop'];

export type RolesUnion = RolesTuple[number];

export interface UserInfo {
  token: string;
  username: string;
  password: string;
  name: string;
  locale: LocalesUnion;
  role: RolesUnion;
}

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref<UserInfo | null>(null);

    const role = computed(() => (userInfo.value ? userInfo.value.role : ''));

    const token = ref<string>();

    const locale = computed(() =>
      userInfo.value ? userInfo.value.locale : 'enGB'
    );

    async function fetchUserInfo(params: FetchLoginParams) {
      const res = await login(params);
      if (res.data.code === 0 && res.data.content) {
        userInfo.value = res.data.content;
      }
      return res;
    }

    async function fetchChangeUserInfo(params: FetchChangeUserInfoParams) {
      const res = await changeUserInfo(params);
      if (res.data.code === 0 && res.data.content) {
        userInfo.value = res.data.content;
      }
      return res;
    }

    return {
      token,
      userInfo,
      role,
      locale,
      fetchUserInfo,
      fetchChangeUserInfo,
    };
  },
  {
    persist: {
      paths: ['userInfo', 'token'],
    },
  }
);
