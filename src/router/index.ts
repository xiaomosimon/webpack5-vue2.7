import Router from 'vue-router';

const Home = () => import('@/views/HomePage.vue');
// const Foo = () => import(/* webpackChunkName: "sub-pages" */ './Foo.vue');
// const Bar = () => import(/* webpackChunkName: "sub-pages" */ './Bar.vue');

// 基础页面
const routes = [
  { path: '/', name: 'Home', component: Home },
  // { path: '/bar', name: 'Bar', component: Bar },
  // { path: '/foo', name: 'Foo', component: Foo },
];

const router = new Router({
  mode: 'hash',
  routes,
});

export default router;
