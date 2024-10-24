import { RouteLocationRaw } from "vue-router";

export interface BreadcrumbItemType {
  label: string;
  to?: RouteLocationRaw,
  isActionable?: boolean,
  click?: () => void,
}

export type BreadcrumbType = BreadcrumbItemType[];