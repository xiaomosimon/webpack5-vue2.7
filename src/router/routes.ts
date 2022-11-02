import RouterViewLayout from '@/layouts/RouterViewLayout';
import { RouteConfig } from 'vue-router';

// 基础页面
export const baseRoutes: Array<RouteConfig> = [
  {
    path: '/',
    component: () => import('@/layouts/BasicLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        component: () => import('@/views/DashboardPage.vue'),
        meta: {
          i18n: 'dashboarddashboarddashboarddashboard',
          icon: 'home',
        },
      },
      {
        path: '/foo',
        component: RouterViewLayout,
        redirect: '/foo/list',
        meta: {
          i18n: 'foo',
          icon: 'user',
        },
        children: [
          {
            path: '/foo/list',
            component: () =>
              import(
                /* webpackChunkName: "sub-pages" */ '@/views/foo/FooPage.vue'
              ),
            meta: {
              i18n: 'fooList',
            },
          },
          {
            path: '/foo/edit',
            component: () => import('@/views/foo/FooEdit.vue'),
            meta: {
              siblingParentPath: '/foo/list',
              i18n: 'fooEdit',
            },
          },
        ],
      },
    ],
  },
];

const infrastructureRoutes: Array<RouteConfig> = [
  {
    path: '/login',
    component: () => import('@/views/infrastructure/LoginPage.vue'),
  },
  {
    path: '/error',
    component: () => import('@/views/infrastructure/ErrorPage.vue'),
  },
];

export const routes = baseRoutes.concat(infrastructureRoutes);
