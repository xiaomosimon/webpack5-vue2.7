import VueRouter from 'vue-router';
import { message } from 'ant-design-vue';
import { useUserStore } from '@/store/user';
import { useRouterStore } from '@/store/router';

export default function verifyRoutePermission(
  router: VueRouter,
  whitelist: Array<string>
) {
  router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    if (whitelist.includes(to.path)) {
      // 白名单
      next();
      return;
    }
    if (!userStore.token) {
      // 无token直接去登录
      next('/login');
      return;
    }
    // 有token，无论是否失效
    const routerStore = useRouterStore();
    if (to.path === '/') {
      // 初始地址跳首页
      // 判断角色，进行首页跳转
      switch (userStore.role) {
        case 'shop':
          next('/dashboard');
          break;
        case 'admin':
        case 'operator':
          next('/mainDashboard');
          break;
        default:
          message.error('无权限访问，请联系管理员');
          next(false);
          break;
      }
      return;
    }
    // 非初始地址跳转
    if (routerStore.pageRoutePaths.includes(to.path)) {
      next();
      return;
    }
    next('/error');
  });
}
