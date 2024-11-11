import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    layout?: string;
    title?: string;
    breadcrumbItemTitle?: string;
    uniqueKeys?: Record<string, boolean>,
    apiUrl?: string;
  }
}
