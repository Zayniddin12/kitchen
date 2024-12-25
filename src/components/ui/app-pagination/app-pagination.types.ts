import { PaginationType } from "@/types/pagination.type";

export type PaginationPageType = number | null;

export interface AppPaginationPropsType{
    pagination?: PaginationType
}