import RouterViewLayout from '@/layouts/RouterViewLayout';
import { RouteConfig } from 'vue-router';

// 基础页面
export const baseRoutes: Array<RouteConfig> = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "pre-base" */ '@/layouts/BaseLayout.vue'),
    children: [
      {
        path: '/dashboard',
        component: () => import('@/views/DashboardPage.vue'),
        meta: {
          i18n: 'dashboard',
          icon: 'home',
          roles: ['admin', 'operator'],
        },
      },
      {
        path: '/shopSetting',
        component: () => import(/* webpackChunkName: "pre-role-shop" */ '@/views/ShopSetting.vue'),
        meta: {
          i18n: 'shopSetting',
          icon: 'home',
          roles: ['shop'],
        },
      },
      {
        path: '/foo',
        component: RouterViewLayout,
        redirect: '/foo/list',
        meta: {
          i18n: 'foo',
          icon: 'user',
          roles: ['admin', 'operator'],
        },
        children: [
          {
            path: '/foo/list',
            component: () =>
              import(
                /* webpackChunkName: "pre-foo" */ '@/views/foo/ListPage.vue'
              ),
            meta: {
              i18n: 'fooList',
              roles: ['admin', 'operator'],
            },
          },
          {
            path: '/foo/edit',
            component: () =>
              import(
                /* webpackChunkName: "pre-foo" */ '@/views/foo/EditPage.vue'
              ),
            meta: {
              siblingParentPath: '/foo/list',
              i18n: 'fooEdit',
              roles: ['admin', 'operator'],
            },
          },
          {
            path: '/foo/operateHistory',
            component: () => import(/* webpackChunkName: "pre-role-shop" */ '@/views/foo/OperateHistory.vue'),
            meta: {
              i18n: 'operateHistory',
              roles: ['admin'],
            },
          },
        ],
      },
      {
        path: '/changePassword',
        component: () => import(/* webpackChunkName: "pre-base" */ '@/views/setting/ChangePassword.vue'),
        meta: {
          hide: true,
          i18n: 'changePassword',
          roles: ['admin', 'operator'],
        },
      },
    ],
  },
];

export const infrastructureRoutes: Array<RouteConfig> = [
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "pre-infrastructure" */ '@/views/infrastructure/LoginPage.vue'),
  },
  {
    path: '/error',
    component: () => import(/* webpackChunkName: "pre-infrastructure" */ '@/views/infrastructure/ErrorPage.vue'),
  }
];

export const routes = baseRoutes.concat(infrastructureRoutes);
