import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/de';
import enGB from 'ant-design-vue/lib/locale-provider/en_GB';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n-composable';
import { useUserStore } from '@/store/user';
import { message } from 'ant-design-vue';

export default function useLocale() {
  const locales: LocalesTuple = ['enGB', 'zhCN', 'deDE'];

  const userStore = useUserStore();
  const i18n = useI18n();

  const locale = ref<LocaleLanguageInterface>(enGB);
  const selectedLocaleKey = ref<LocalesUnion>(userStore.locale);

  function setLocale(
    momentLocalKey: string,
    importLocale: LocaleLanguageInterface,
    localeKey: LocalesUnion
  ) {
    moment.locale(momentLocalKey);
    locale.value = importLocale;
    selectedLocaleKey.value = localeKey;
    i18n.locale.value = localeKey;
  }

  async function switchLocale(localeKey: LocalesUnion, fromFetch: boolean) {
    switch (localeKey) {
      case locales[0]:
        setLocale('en', enGB, localeKey);
        if (fromFetch) message.success('设置成功');
        break;
      case locales[1]:
        {
          const res = await import(
            /* webpackChunkName: "pre-locale" */ 'ant-design-vue/lib/locale-provider/zh_CN'
          );
          if (res && res.default) {
            setLocale('zh-cn', res.default, localeKey);
            if (fromFetch) message.success('设置成功');
          } else {
            message.error('加载语言失败，请稍后再试');
          }
        }
        break;
      case locales[2]:
        {
          const res = await import(
            /* webpackChunkName: "pre-locale" */ 'ant-design-vue/lib/locale-provider/de_DE'
          );
          if (res && res.default) {
            setLocale('de', res.default, localeKey);
            if (fromFetch) message.success('设置成功');
          } else {
            message.error('加载语言失败，请稍后再试');
          }
        }
        break;
      default:
        break;
    }
  }

  async function onLocaleChange(localeKey: LocalesUnion) {
    try {
      const res = await userStore.fetchChangeUserInfo({ locale: localeKey });
      if (res.data.code === 0) switchLocale(localeKey, true);
    } catch (error) {
      message.error('语言设置失败，请稍后再试');
    }
  }

  switchLocale(userStore.locale, false);

  return {
    locale,
    selectedLocaleKey,
    locales,
    onLocaleChange,
  };
}
