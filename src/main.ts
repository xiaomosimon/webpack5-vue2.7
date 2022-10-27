import Vue from 'vue';
import App from './App.vue';
Vue.config.productionTip = false;
console.log(webpackDefineEnvConfig);

new Vue({
  render: (h) => h(App),
}).$mount('#app');
