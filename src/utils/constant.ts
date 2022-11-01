import { routes } from '@/router';
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

function backPageRoute(routesSource: RoutesArray) {
  return routesSource.map((v) => {
    const pageRoute: PageRoute = {
      path: v.path,
      ...v.meta,
    };
    if (v.children) {
      pageRoute.children = backPageRoute(v.children);
    }
    return pageRoute;
  });
}
export const pageRoutes = backPageRoute(routes[0].children as RoutesArray);

export const abc = 1;
