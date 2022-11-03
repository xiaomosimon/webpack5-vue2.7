import { createI18n } from 'vue-i18n-composable';
import { useLocalStorage } from '@vueuse/core';
import enGB from './enGB';
import zhCN from './zhCN';
import deDE from './deDE';

export default function backCreatedI18n() {
  const userStore = useLocalStorage<{
    userInfo: {
      locale?: string;
    } | null;
  }>('user', { userInfo: null });
  return createI18n({
    locale: userStore.value.userInfo?.locale || 'enGB',
    messages: {
      enGB,
      zhCN,
      deDE,
    },
  });
}
