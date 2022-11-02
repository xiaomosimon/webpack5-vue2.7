import { baseRoutes } from '@/router/routes';
import { RouteConfig } from 'vue-router';

export interface PageRoute {
  path: string;
  i18n: string;
  icon?: string;
  siblingParentPath?: string;
  children?: Array<PageRoute>;
}

type PageRouteConfig = RouteConfig & {
  meta: {
    i18n: string;
    icon?: string;
    siblingParentPath?: string;
  };
  children?: Array<PageRouteConfig>;
};

type RoutesArray = Array<PageRouteConfig>;

function backPageRoutes(source: RoutesArray) {
  return source.map((v) => {
    const pageRoute: PageRoute = {
      path: v.path,
      ...v.meta,
    };
    if (v.children) {
      pageRoute.children = backPageRoutes(v.children);
    }
    return pageRoute;
  });
}
export const pageRoutes = backPageRoutes(baseRoutes[0].children as RoutesArray);
