import { RouteLocationRaw } from "vue-router";
import { IsTranslateType } from "@/types/common.type";

export interface BreadcrumbItemType {
  label: string;
  to?: RouteLocationRaw,
  isActionable?: boolean,
  isTranslate?: IsTranslateType,
  click?: () => void,
}

export type BreadcrumbType = BreadcrumbItemType[];