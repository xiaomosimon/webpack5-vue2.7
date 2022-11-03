import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { nanoid } from 'nanoid';
import { useRouterStore } from './router';

interface FetchResult {
  code: number;
  message: string;
}

export type RolesTuple = ['admin', 'operator', 'shop'];

export type RolesUnion = RolesTuple[number];

interface UserInfo {
  token: string;
  username: string;
  password: string;
  name: string;
  locale: LocalesUnion;
  role: RolesUnion;
}

type ChangeUserInfoParams = Partial<UserInfo>;

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref<UserInfo | null>(null);

    const role = computed(() => (userInfo.value ? userInfo.value.role : ''));

    const token = computed(() => userInfo.value?.token);

    const locale = computed(() =>
      userInfo.value ? userInfo.value.locale : 'enGB'
    );

    function fetchUserInfo(params: {
      username: string;
      password: string;
    }): Promise<FetchResult> {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (params.username === 'admin') {
            userInfo.value = {
              ...params,
              name: 'Admin',
              locale: 'zhCN',
              role: 'admin',
              token: nanoid(10),
            };
          } else if (params.username === 'operator') {
            userInfo.value = {
              ...params,
              name: 'Operator',
              locale: 'enGB',
              role: 'operator',
              token: nanoid(10),
            };
          } else {
            userInfo.value = {
              ...params,
              name: 'Shop Name',
              locale: 'enGB',
              role: 'shop',
              token: nanoid(10),
            };
          }
          const routerStore = useRouterStore();
          routerStore.setPageRoutes(role.value);
          resolve({
            code: 0,
            message: '',
          });
        }, 1000);
      });
    }

    function fetchChangeUserInfo(
      params: ChangeUserInfoParams
    ): Promise<FetchResult> {
      return new Promise((resolve) => {
        setTimeout(() => {
          userInfo.value = {
            ...userInfo.value,
            ...params,
          } as UserInfo;
          resolve({
            code: 0,
            message: '',
          });
        }, 1000);
      });
    }

    return { token, userInfo, role, locale, fetchUserInfo, fetchChangeUserInfo };
  },
  {
    persist: {
      paths: ['userInfo'],
    },
  }
);
