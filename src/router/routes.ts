import RouterViewLayout from '@/layouts/RouterViewLayout';
import { RouteConfig } from 'vue-router';

// 基础页面
export const baseRoutes: Array<RouteConfig> = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "pre-base" */ '@/layouts/BaseLayout.vue'),
    children: [
      {
        path: '/mainDashboard',
        component: () => import(/* webpackChunkName: "pre-base" */ '@/views/MainDashboardPage.vue'),
        meta: {
          i18n: 'dashboard',
          icon: 'home',
          roles: ['admin', 'operator'],
        },
      },
      {
        path: '/dashboard',
        component: () => import(/* webpackChunkName: "pre-base" */ '@/views/ShopDashboardPage.vue'),
        meta: {
          i18n: 'shopDashboard',
          icon: 'home',
          roles: ['shop'],
        },
      },
      {
        path: '/product',
        component: RouterViewLayout,
        redirect: '/product/list',
        meta: {
          i18n: 'product',
          icon: 'user',
          roles: ['admin', 'operator', 'shop'],
        },
        children: [
          {
            path: '/product/list',
            component: () =>
              import(
                /* webpackChunkName: "pre-product" */ '@/views/product/ListPage.vue'
              ),
            meta: {
              i18n: 'productList',
              roles: ['admin', 'operator', 'shop'],
            },
          },
          {
            path: '/product/edit',
            component: () =>
              import(
                /* webpackChunkName: "pre-product" */ '@/views/product/EditPage.vue'
              ),
            meta: {
              siblingParentPath: '/product/list',
              i18n: 'productEdit',
              roles: ['admin', 'operator', 'shop'],
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
          roles: ['admin', 'operator', 'shop'],
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
