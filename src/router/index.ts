import VueRouter, { RouteConfig } from 'vue-router';
import RouterViewLayout from '@/layouts/RouterViewLayout';
// 基础页面
export const routes: Array<RouteConfig> = [
  {
    path: '/',
    component: () => import('@/layouts/BasicLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        component: () => import('@/views/DashboardPage.vue'),
        meta: {
          i18n: 'dashboard',
          icon: 'home'
        },
      },
      {
        path: '/dashboard1',
        component: () => import('@/views/DashboardPage.vue'),
        meta: {
          i18n: 'dashboard1',
          icon: 'home'
        },
      },
      {
        path: '/foo',
        component: RouterViewLayout,
        redirect: '/foo/list',
        meta: {
          i18n: 'foo',
          icon: 'user'
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
      {
        path: '/foo2',
        component: RouterViewLayout,
        redirect: '/foo2/list',
        meta: {
          i18n: 'foo2',
          icon: 'user'
        },
        children: [
          {
            path: '/foo2/list',
            component: () =>
              import(
                /* webpackChunkName: "sub-pages" */ '@/views/foo/FooPage.vue'
              ),
            meta: {
              i18n: 'foo2List',
            },
          },
          {
            path: '/foo2/edit',
            component: () => import('@/views/foo/FooEdit.vue'),
            meta: {
              siblingParentPath: '/foo/list',
              i18n: 'foo2Edit',
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

const router = new VueRouter({
  mode: 'hash',
  routes: routes.concat(infrastructureRoutes),
});

export default router;
