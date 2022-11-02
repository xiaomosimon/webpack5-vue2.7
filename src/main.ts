import Vue from 'vue';
import { PiniaVuePlugin, createPinia } from 'pinia';
import VueRouter from 'vue-router';
import fixPiniaResetPlugin from './plugins/fixPiniaResetPlugin';
import importAntdPlugin from './plugins/importAntdPlugin';
import router from './router';
import App from './App.vue';
import i18n from './i18n';
import './styles/main.less';


Vue.use(importAntdPlugin); // ant导入组件

const pinia = createPinia();
pinia.use(fixPiniaResetPlugin);
Vue.use(PiniaVuePlugin); // 解决pinia $reset问题

Vue.use(VueRouter);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
  pinia,
  router,
  i18n,
}).$mount('#app');
