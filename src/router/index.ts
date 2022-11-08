import VueRouter from 'vue-router';
import { routes, infrastructureRoutes } from './routes';
import verifyRoutePermission from './verifyRoutePermission';

const router = new VueRouter({
  mode: 'hash',
  routes,
});

verifyRoutePermission(
  router,
  infrastructureRoutes.map((v) => v.path)
);

export default router;
