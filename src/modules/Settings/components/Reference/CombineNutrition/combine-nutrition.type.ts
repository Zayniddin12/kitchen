import { NameType, StatusType } from "@/types/common.type";
import { PaginationParamsType, PaginationType } from "@/types/pagination.type";
import { BaseWarehouseType } from "@/modules/Settings/components/Reference/MainBases/base-warehouses.type";

export interface FoodFactoriesCreateFormType {
    name: NameType,
    management_id: number | "",
    status?: StatusType | boolean,
}

export interface FoodFactoryType {
    id: number,
    name: NameType,
    management: Record<string, any>,
    status: StatusType,
}

export type FoodFactoryListType = Omit<FoodFactoryType, 'name'> & {
    name: string;
};

export interface FoodFactoriesType {
    food_factories: FoodFactoriesType[],
    paginator: PaginationType;
}

export interface FoodFactoriesParamsType extends PaginationParamsType {
    search?: string;
}