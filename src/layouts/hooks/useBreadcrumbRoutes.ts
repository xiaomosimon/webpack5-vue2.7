import { useRouterStore, PageRoute } from '@/store/router';
import { computed, ComputedRef } from 'vue';
import { Route } from 'vue-router';

interface BreadcrumbRoute extends PageRoute {
  isCurrentPage?: boolean;
}

type BreadcrumbRoutes = Array<BreadcrumbRoute>;

function backBreadcrumbRoutes(
  routePath: string,
  routeChildren: Array<PageRoute>
): BreadcrumbRoutes {
  const foundRoute = routeChildren.find((v) => routePath.includes(v.path));
  if (!foundRoute) {
    return [];
  }
  const list: BreadcrumbRoutes = [
    {
      ...foundRoute,
      isCurrentPage: foundRoute.path === routePath,
    },
  ];
  if (foundRoute.siblingParentPath) {
    const foundParentRoute = routeChildren.find(
      (v) => v.path === foundRoute.siblingParentPath
    );
    if (foundParentRoute) {
      list.unshift({
        ...foundParentRoute,
        isCurrentPage: false,
      });
    }
  }
  if (foundRoute.children) {
    return list.concat(...backBreadcrumbRoutes(routePath, foundRoute.children));
  }
  return list;
}

export function useBreadcrumbRoutes(
  route: Route
): ComputedRef<BreadcrumbRoutes>;

export function useBreadcrumbRoutes(route: Route) {
  const userStore = useRouterStore();
  return computed<BreadcrumbRoutes>(() => {
    const routePath = route.path;
    const foundRoute = userStore.pageRoutes.find((v) =>
      routePath.includes(v.path)
    );
    if (!foundRoute) {
      return [];
    }
    if (foundRoute.children) {
      return backBreadcrumbRoutes(routePath, foundRoute.children);
    }
    return [
      {
        ...foundRoute,
        isCurrentPage: foundRoute.path === routePath,
      },
    ];
  });
}
