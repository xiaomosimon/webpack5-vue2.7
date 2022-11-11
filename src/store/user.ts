import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  login,
  changeUserInfo,
  FetchLoginParams,
  FetchChangeUserInfoParams,
} from '@/request/userApis';
import { useRouterStore } from './router';

export type RolesTuple = ['admin', 'operator', 'shop'];

export type RolesUnion = RolesTuple[number];

export interface UserInfo {
  token: string;
  username: string;
  password: string;
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
      if (params.username === 'admin') {
        // TODO mock
        const routerStore = useRouterStore();
        const res: { data: { code: number; content: UserInfo } } = {
          data: {
            code: 0,
            content: {
              token: '123456',
              ...params,
              locale: 'zhCN',
              role: 'admin',
            },
          },
        };
        token.value = res.data.content.token;
        userInfo.value = res.data.content;
        routerStore.setPageRoutes(res.data.content.role);
        return res;
      }
      const res = await login(params);
      const content = res.data?.content;
      if (res.data.code === 0 && content) {
        userInfo.value = content;
        token.value = content.token;
        const routerStore = useRouterStore();
        routerStore.setPageRoutes(content.role);
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
