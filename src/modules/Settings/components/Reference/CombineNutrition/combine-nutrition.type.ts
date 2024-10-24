import { NameType, StatusType } from "@/types/common.type";
import { PaginationParamsType, PaginationType } from "@/types/pagination.type";

export interface FoodFactoriesCreateFormType{
    name: NameType,
    management_id: number | "",
    status?: StatusType | boolean,
}

export interface FoodFactoryType{
    id: number,
    name: NameType,
    management: Record<string, any>,
    status: StatusType,
}

export interface FoodFactoriesType{
    food_factories: FoodFactoryType[],
    paginator: PaginationType
}

export interface FoodFactoriesParamsType extends PaginationParamsType{
    search?: string
}