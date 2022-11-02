import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/de';
import enGB from 'ant-design-vue/lib/locale-provider/en_GB';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n-composable';

export default function useLocale() {
  const i18n = useI18n();
  moment.locale('en');
  i18n.locale.value = 'enGB';
  const locale = ref<LocaleLanguageInterface>(enGB);
  const selectedLocaleKey = ref<LocalesUnion>('enGB');
  const locales: LocalesTuple = ['enGB', 'zhCN', 'deDE'];
  function onLocaleChange(localeKey: LocalesUnion) {
    switch (localeKey) {
      case locales[0]:
        moment.locale('en');
        locale.value = enGB;
        selectedLocaleKey.value = localeKey;
        i18n.locale.value = localeKey;
        break;
      case locales[1]:
        import('ant-design-vue/lib/locale-provider/zh_CN').then((results) => {
          if (results && results.default) {
            moment.locale('zh-cn');
            locale.value = results.default;
            selectedLocaleKey.value = localeKey;
            i18n.locale.value = localeKey;
          }
        });
        break;
      case locales[2]:
        import('ant-design-vue/lib/locale-provider/de_DE').then((results) => {
          if (results && results.default) {
            moment.locale('de');
            locale.value = results.default;
            selectedLocaleKey.value = localeKey;
            i18n.locale.value = localeKey;
          }
        });
        break;
      default:
    }
  }
  return {
    locale,
    selectedLocaleKey,
    locales,
    onLocaleChange,
  };
}
