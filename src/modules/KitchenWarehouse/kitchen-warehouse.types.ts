import { PaginationParamsType, PaginationType } from "@/types/pagination.type";

export interface ListProductsParamsType extends PaginationParamsType {

}

export interface ListProductType {

}

export interface ListProductsResponseType {
    products: ListProductType[],
    pagination: PaginationType
}

