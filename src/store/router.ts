import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { RouteConfig } from 'vue-router';
import { baseRoutes } from '@/router/routes';
import { pushArray } from '@/utils/array';

export interface PageRoute {
  path: string;
  i18n: string;
  icon?: string;
  hide?: boolean;
  siblingParentPath?: string;
  children?: Array<PageRoute>;
}

type MetaRouteConfig = RouteConfig & {
  meta: {
    i18n: string;
    icon?: string;
    siblingParentPath?: string;
    roles: Array<string>;
  };
  children?: Array<MetaRouteConfig>;
};

export type MetaRoutes = Array<MetaRouteConfig>;

function backPageRoutes(source: MetaRoutes, role: string) {
  return source
    .filter((v) => v.meta.roles.includes(role))
    .map((v) => {
      const pageRoute: PageRoute = {
        path: v.path,
        ...v.meta,
      };
      if (v.children) {
        pageRoute.children = backPageRoutes(v.children, role);
      }
      return pageRoute;
    });
}

function backPageRoutePaths(source: Array<PageRoute>): Array<string> {
  const list: Array<string> = [];
  source.forEach((v) => {
    list.push(v.path);
    if (v.children) {
      pushArray<string>(list, backPageRoutePaths(v.children));
    }
  });
  return list;
}

export const useRouterStore = defineStore(
  'router',
  () => {

    const pageRoutes = ref<Array<PageRoute>>([]);

    const pageRoutePaths = computed(() => backPageRoutePaths(pageRoutes.value));

    function setPageRoutes(role: string) {
      pageRoutes.value = backPageRoutes(
        baseRoutes[0].children as MetaRoutes,
        role
      );
    }
    return { pageRoutes, pageRoutePaths, setPageRoutes };
  },
  {
    persist: {
      paths: ['pageRoutes'],
    },
  }
);
