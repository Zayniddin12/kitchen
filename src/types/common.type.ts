import { Component } from "vue";

export interface TableColumnType {
    prop: string;
    label: string;
    sortable?: boolean;
    width?: number | string;
    align?: "left" | "center" | "right";

    [key: string]: any;
}

export interface NameType {
    uz: string,
    ru: string,
}

export type StatusType = "active" | "inactive" | "";

export type StatusTextType = "Активация" | "Деактивация"

export type GenderType = null | "m" | "f";

export interface GenderResponseType {
    name: string,
    photo: string
}

export type IsTranslateType = boolean;