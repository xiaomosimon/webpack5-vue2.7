<template>
  <a-layout-header style="background: #fff;">
    <a-row type="flex" align="middle" justify="space-between">
      <a-breadcrumb>
        <a-breadcrumb-item v-for="breadcrumbRoute in breadcrumbRoutes" :key="breadcrumbRoute.path">
          <span v-if="breadcrumbRoute.isCurrentPage">{{ breadcrumbRoute.i18n }}</span>
          <router-link v-else :to="breadcrumbRoute.path">{{ breadcrumbRoute.i18n }}</router-link>
        </a-breadcrumb-item>
      </a-breadcrumb>
      <a-space size="large">
        <a @click="e => e.preventDefault()">帮助中心</a>
        <a-dropdown :trigger="['click']">
          <a class="ant-dropdown-link" @click="e => e.preventDefault()">
            {{ $t(`common.${selectedLocale}`) }}
            <a-icon type="down" />
          </a>
          <a-menu slot="overlay" @click="onClick">
            <a-menu-item
v-for="menuLocale in props.menuLocales" :key="menuLocale"
              :disabled="menuLocale === selectedLocale">
              {{ $t(`common.${menuLocale}`) }}
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-space>
    </a-row>
  </a-layout-header>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router/composables';
import { useBreadcrumbRoutes } from './hooks/useBreadcrumbRoutes';

const breadcrumbRoutes = useBreadcrumbRoutes(useRoute());

const props = defineProps<{
  selectedLocale: LocalesUnion,
  menuLocales: Array<string>
}>();

const emit = defineEmits<{
  (e: 'locale-change', localeKey: LocalesUnion): void
}>();

function onClick({ key }: { key: LocalesUnion }) {
  emit('locale-change', key);
}
</script>