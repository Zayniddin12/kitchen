import { RouteLocationRaw } from "vue-router";

export interface NavListItemType {
    icon?: string;
    to?: RouteLocationRaw,
    title?: string,
    items: NavListItemType[]
}

export interface NavListPropsType {
    items?: NavListItemType[],
    title?: string;
}