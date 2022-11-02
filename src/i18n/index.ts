import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { createI18n } from 'vue-i18n-composable';
import enGB from './enGB';
import zhCN from './zhCN';
import deDE from './deDE';

Vue.use(VueI18n); // 先注册才可用createI18n
const i18n = createI18n({
  locale: 'enGB',
  messages: {
    enGB,
    zhCN,
    deDE,
  },
});
export default i18n;
