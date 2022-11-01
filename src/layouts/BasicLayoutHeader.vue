<template>
  <a-layout-header style="background: #fff; padding:0 16px;">
    <a-space align="center" :size="8">
      <a-breadcrumb>
        <a-breadcrumb-item v-for="breadcrumbRoute in breadcrumbRoutes" :key="breadcrumbRoute.path">
          <span v-if="breadcrumbRoute.isCurrentPage">{{ breadcrumbRoute.i18n }}</span>
          <router-link v-else :to="breadcrumbRoute.path">{{ breadcrumbRoute.i18n }}</router-link>
        </a-breadcrumb-item>
      </a-breadcrumb>
    </a-space>
  </a-layout-header>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router/composables';
import { pageRoutes, PageRoute } from '@/utils/constant';
import { computed } from 'vue';

interface BreadcrumbRoute extends PageRoute {
  isCurrentPage?: boolean;
}

type BreadcrumbRoutes = Array<BreadcrumbRoute>;

function backBreadcrumbRoutes(routePath: string, routeChildren: Array<PageRoute>): BreadcrumbRoutes {
  const foundRoute = routeChildren.find((v) => routePath.includes(v.path));
  if (!foundRoute) {
    return [];
  }
  const list: BreadcrumbRoutes = [{
    ...foundRoute,
    isCurrentPage: foundRoute.path === routePath
  }];
  if (foundRoute.siblingParentPath) {
    const foundParentRoute = routeChildren.find((v) => v.path === foundRoute.siblingParentPath);
    if (foundParentRoute) {
      list.unshift({
        ...foundParentRoute,
        isCurrentPage: false
      });
    }
  }
  if (foundRoute.children) {
    return list.concat(...backBreadcrumbRoutes(routePath, foundRoute.children));
  }
  return list;
}

const route = useRoute();

const breadcrumbRoutes = computed<BreadcrumbRoutes>(() => {
  const routePath = route.path;
  const foundRoute = pageRoutes.find((v) => routePath.includes(v.path));
  if (!foundRoute) {
    return [];
  }
  if (foundRoute.children) {
    return backBreadcrumbRoutes(routePath, foundRoute.children);
  }
  return [{
    ...foundRoute,
    isCurrentPage: foundRoute.path === routePath
  }];
});

</script>

<style scoped>

</style>
