<template>
  <a-layout-sider :width="siderWidth" theme="dark" :collapsed="collapsed" collapsible @collapse="onCollapse">
    <div class="h-8 m-4 bg-slate-200">123123</div>
    <a-menu
v-model="selectedKeys" :default-open-keys="[]" :open-keys="openedKeys" theme="dark" mode="inline"
      @select="onMenuSelect" @openChange="onOpenChange">
      <template v-for="menuRoute in routerStore.pageRoutes">
        <a-sub-menu v-if="menuRoute.children" :key="menuRoute.path">
          <span slot="title">
            <a-icon :type="menuRoute.icon" /><span>{{ menuRoute.i18n }}</span>
          </span>
          <a-menu-item
v-for="menuChildrenRoute in menuRoute.children" :key="menuChildrenRoute.path"
            :class="{ 'hidden-i hidden': menuChildrenRoute.siblingParentPath }">
            {{ menuChildrenRoute.i18n }}</a-menu-item>
        </a-sub-menu>
        <a-menu-item v-else :key="menuRoute.path" :class="{ 'hidden': menuRoute.hide }">
          <a-icon v-if="menuRoute.icon" :type="menuRoute.icon" />
          <span>{{ menuRoute.i18n }}</span>
        </a-menu-item>
      </template>
    </a-menu>
  </a-layout-sider>
</template>
<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router/composables';
import { useRouterStore } from '@/store/router';

const router = useRouter();
const route = useRoute();
const routerStore = useRouterStore();

const collapsed = ref<boolean>(false);
const rootSubmenuKeys = routerStore.pageRoutes.filter((v) => !!v.children).map((v) => v.path);
const selectedKeys = ref([route.path]);
const openedKeys = ref<Array<string>>([]);
let oldOpenedKeys = openedKeys.value;

const props = defineProps<{
  selectedLocale: LocalesUnion,
}>();

const siderWidth = computed<number>(() => props.selectedLocale === 'zhCN' ? 200 : 260);

// 监听路由变化切换菜单选中
watch(() => route.path, (newV) => {
  if (selectedKeys.value[0] !== newV) {
    selectedKeys.value = [newV];
  }
});

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