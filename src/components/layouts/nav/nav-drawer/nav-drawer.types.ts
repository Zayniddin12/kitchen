import { RouteLocationRaw } from "vue-router";
import { NavListItemType } from "@/components/layouts/nav/nav-list/nav-list.types";

export interface NavDrawerItemType {
    icon: string,
    to?: RouteLocationRaw,
    key: string,
    title: string,
    items?: NavListItemType[],
    itemsOpen?: boolean,
}

export interface NavDrawerPropsType {
    items?: NavDrawerItemType[] | [];
}