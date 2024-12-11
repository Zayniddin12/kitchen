import "vue-router";
import { RouteLocationRaw } from "vue-router";

export type LayoutType = "MainLayout" | "LoginLayout" | "ErrorLayout";

declare module "vue-router" {
  interface RouteMeta {
    layout?: LayoutType;
    title?: string;
    isTranslate?: boolean;
    breadcrumbItemTitle?: string;
    uniqueKeys?: Record<string, boolean>,
    apiUrl?: string;
    parentRouteTitle?: string;
    parentRouteUrl?: RouteLocationRaw,

    [key: string]: any,
  }
}
