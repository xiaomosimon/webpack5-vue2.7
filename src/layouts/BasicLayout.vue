<template>
  <a-layout style="min-height: 100vh">
    <basic-layout-sider :selected-locale="selectedLocaleKey" />
    <a-layout>
      <basic-layout-header
:menu-locales="locales" :selected-locale="selectedLocaleKey"
        @locale-change="onLocaleChange" />
      <a-layout-content style="margin: 16px;">
        <config-provider :locale="locale">
          <router-view></router-view>
        </config-provider>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import { ConfigProvider } from 'ant-design-vue'; // config provider不能在render initial前注册
import BasicLayoutHeader from "./BasicLayoutHeader.vue";
import BasicLayoutSider from "./BasicLayoutSider.vue";
import useLocale from './hooks/useLocale';

const {
  locale,
  selectedLocaleKey,
  locales,
  onLocaleChange,
} = useLocale();
</script>