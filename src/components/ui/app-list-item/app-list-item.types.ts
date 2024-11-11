import { RouteLocationRaw } from "vue-router";

export interface AppListItemPropsType {
    icon?: string,
    to?: RouteLocationRaw,
    key?: string,
    title?: string,
}