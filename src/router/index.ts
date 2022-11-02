import VueRouter from 'vue-router';
import { routes } from './routes';

const router = new VueRouter({
  mode: 'hash',
  routes,
});

export default router;
