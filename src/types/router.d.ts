import "vue-router";
import { RouteLocationRaw } from "vue-router";
import { IsTranslateType } from "@/types/common.type";

export type LayoutType = "MainLayout" | "LoginLayout" | "ErrorLayout";

declare module "vue-router" {
  interface RouteMeta {
    layout?: LayoutType;
    title?: string;
    isTranslate?: IsTranslateType;
    breadcrumbItemTitle?: string;
    breadcrumbItemIsTranslate?: IsTranslateType;
    uniqueKeys?: Record<string, boolean>,
    apiUrl?: string;
    parentRouteTitle?: string;
    parentRouteIsTranslate?: IsTranslateType;
    parentRouteUrl?: RouteLocationRaw,

    [key: string]: any,
  }
}
