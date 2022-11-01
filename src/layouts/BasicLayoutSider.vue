<template>
  <a-layout-sider :collapsed="collapsed" collapsible @collapse="onCollapse">
    <div class="basic-layout-menu-logo" />
    <a-menu
v-model="selectedKeys" :default-open-keys="[]" :open-keys="openedKeys" theme="dark" mode="inline"
      @select="onMenuSelect" @openChange="onOpenChange">
      <template v-for="menuRoute in pageRoutes">
        <a-sub-menu v-if="menuRoute.children" :key="menuRoute.path">
          <span slot="title">
            <a-icon :type="menuRoute.icon" /><span>{{ menuRoute.i18n }}</span>
          </span>
          <a-menu-item v-for="menuChildrenRoute in menuRoute.children" :key="menuChildrenRoute.path">
            {{ menuChildrenRoute.i18n }}</a-menu-item>
        </a-sub-menu>
        <a-menu-item v-else :key="menuRoute.path">
          <a-icon :type="menuRoute.icon" />
          <span>{{ menuRoute.i18n }}</span>
        </a-menu-item>
      </template>
    </a-menu>
  </a-layout-sider>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router/composables';
import { pageRoutes } from '@/utils/constant';

const router = useRouter();
const rootSubmenuKeys = pageRoutes.filter((v) => !!v.children).map((v) => v.path);
const selectedKeys = ref([pageRoutes[0].path || '']);
const openedKeys = ref<Array<string>>([]);
const collapsed = ref<boolean>(false);
let oldOpenedKeys = openedKeys.value;
function onCollapse(collapse: boolean) {
  openedKeys.value = collapse ? [] : oldOpenedKeys;
  collapsed.value = collapse;
}

function onMenuSelect({ key }: { key: string }) {
  router.push(key);
}

function onOpenChange(openKeys: Array<string>) {
  const latestOpenKey = openKeys.find((key: string) => openedKeys.value.indexOf(key) === -1);
  if (rootSubmenuKeys.indexOf(latestOpenKey || '') === -1) {
    openedKeys.value = openKeys;
  } else {
    openedKeys.value = latestOpenKey ? [latestOpenKey] : [];
  }
  oldOpenedKeys = openedKeys.value;
}
</script>

<style lang="less">
.basic-layout-menu-logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>
