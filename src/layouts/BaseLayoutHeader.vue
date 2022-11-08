<template>
  <a-layout-header style="background: #fff; padding: 0 16px;">
    <a-row type="flex" align="middle" justify="space-between">
      <a-breadcrumb>
        <a-breadcrumb-item v-for="breadcrumbRoute in breadcrumbRoutes" :key="breadcrumbRoute.path">
          <span v-if="breadcrumbRoute.isCurrentPage">{{ breadcrumbRoute.i18n }}</span>
          <router-link v-else :to="breadcrumbRoute.path">{{ breadcrumbRoute.i18n }}</router-link>
        </a-breadcrumb-item>
      </a-breadcrumb>
      <a-space>
        <!-- 联系客服 -->
        <a @click="e => e.preventDefault()">
          <a-icon type="customer-service" /> 联系客服
        </a>
        <a-divider type="vertical" />
        <!-- 帮助中心 -->
        <a @click="e => e.preventDefault()">帮助中心</a>
        <a-divider type="vertical" />
        <!-- 语言切换 -->
        <a-dropdown :trigger="['click']">
          <a class="ant-dropdown-link" @click="e => e.preventDefault()">
            {{ $t(`common.${selectedLocale}`) }}
            <a-icon type="down" />
          </a>
          <a-menu slot="overlay" @click="onLocaleChange">
            <a-menu-item
v-for="menuLocale in props.menuLocales" :key="menuLocale"
              :disabled="menuLocale === selectedLocale">
              {{ $t(`common.${menuLocale}`) }}
            </a-menu-item>
          </a-menu>
        </a-dropdown>
        <a-divider type="vertical" />
        <!-- 密码修改 -->
        <a @click="() => router.push('/changePassword')">
          <a-icon type="setting" /> 修改密码
        </a>
        <a-divider type="vertical" />
        <!-- 登出 -->
        <a @click="logout">
          <a-icon type="logout" /> 退出登录
        </a>
      </a-space>
    </a-row>
  </a-layout-header>
</template>
<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router/composables';
import { useUserStore } from '@/store/user';
import { useRouterStore } from '@/store/router';
import { useBreadcrumbRoutes } from './hooks/useBreadcrumbRoutes';

const router = useRouter();
const breadcrumbRoutes = useBreadcrumbRoutes(useRoute());

const props = defineProps<{
  selectedLocale: LocalesUnion,
  menuLocales: Array<string>
}>();

const emit = defineEmits<{
  (e: 'locale-change', localeKey: LocalesUnion): void
}>();

function onLocaleChange({ key }: { key: LocalesUnion }) {
  emit('locale-change', key);
}

function logout() {
  const userStore = useUserStore();
  const routerStore = useRouterStore();
  userStore.$reset();
  routerStore.$reset();
  router.replace('/login');
}
</script>