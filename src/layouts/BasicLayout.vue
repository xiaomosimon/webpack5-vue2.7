<template>
  <a-layout style="min-height: 100vh">
    <basic-layout-sider />
    <a-layout>
      <basic-layout-header />
      <a-layout-content class="m-16">
        <config-provider :locale="zhCN">
          <router-view></router-view>
        </config-provider>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import { ConfigProvider } from 'ant-design-vue';
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import BasicLayoutHeader from "./BasicLayoutHeader.vue";
import BasicLayoutSider from "./BasicLayoutSider.vue";
// import { ConfigProvider } from 'ant-design-vue';
// import deDE from 'ant-design-vue/lib/locale-provider/de_DE';
// import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
// import moment from 'moment';
// import 'moment/locale/zh-cn';
// import 'moment/locale/de';
// import { ref } from 'vue';

// const locale = ref<null | LocaleLanguageInterface>(null);
// function changeLocale(e: Event) {
//   const localeValue = (e.target as HTMLInputElement).value;
//   if (!localeValue) {
//     locale.value = null;
//     moment.locale('en');
//   } else if (localeValue === 'zhCN') {
//     locale.value = zhCN;
//     moment.locale('zh-cn');
//   } else if (localeValue === 'deDE') {
//     locale.value = deDE;
//     moment.locale('de');
//   }
// }
</script>