<template>
  <a-layout style="min-height: 100vh">
    <base-layout-sider :selected-locale="selectedLocaleKey" />
    <a-layout>
      <base-layout-header
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
import BaseLayoutHeader from "./BaseLayoutHeader.vue";
import BaseLayoutSider from "./BaseLayoutSider.vue";
import useLocale from './hooks/useLocale';

const {
  locale,
  selectedLocaleKey,
  locales,
  onLocaleChange,
} = useLocale();
</script>