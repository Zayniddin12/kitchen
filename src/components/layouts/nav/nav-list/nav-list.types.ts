import { RouteLocationRaw } from "vue-router";

export type ModelValueType = boolean;

export interface NavListItemType {
    icon?: string;
    to?: RouteLocationRaw,
    key?: string,
    title: string,
    items?: NavListItemType[]
}

export interface NavListPropsType {
    items?: NavListItemType[],
    title?: string;
}