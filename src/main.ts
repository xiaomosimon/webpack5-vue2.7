import Vue from 'vue';
import { PiniaVuePlugin, createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';
import fixPiniaResetPlugin from './plugins/fixPiniaResetPlugin';
import importAntdPlugin from './plugins/importAntdPlugin';
import router from './router';
import backCreatedI18n from './i18n';
import App from './App.vue';
import './styles/main.less';

Vue.use(importAntdPlugin); // ant导入组件

Vue.use(PiniaVuePlugin); // pinia的vue2安装方式
const pinia = createPinia();
pinia.use(fixPiniaResetPlugin); // 解决pinia $reset问题
pinia.use(piniaPluginPersistedstate); // 持久化

Vue.use(VueRouter);

Vue.use(VueI18n); 
const i18n = backCreatedI18n(); // 先注册才可用createI18n

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
  pinia,
  router,
  i18n,
}).$mount('#app');
