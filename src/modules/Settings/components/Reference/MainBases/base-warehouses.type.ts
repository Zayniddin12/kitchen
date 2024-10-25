import { NameType, StatusType } from "@/types/common.type";
import { PaginationParamsType, PaginationType } from "@/types/pagination.type";

export interface BaseWarehousesParamsType extends PaginationParamsType{
    search?: string;
}

export interface WarehouseProductType{
    id: number;
    name: string;
}

export interface BaseWarehouseType {
    id: number;
    name: NameType,
    base_id: number,
    capacity: number,
    measure_id: number,
    status: StatusType,
    warehouseProducts: WarehouseProductType[],
}

export type BaseWarehouseListType = Omit<BaseWarehouseType, 'name' | 'warehouseProducts'> & {
    name: string;
    products: WarehouseProductType[];
};

export interface BaseWarehousesType {
    base_warehouses: BaseWarehouseListType[],
    paginator: PaginationType
}

export interface BaseWarehouseDataType{
    name: NameType,
    base_id: number | null,
    capacity: number | null,
    measure_id: number | null,
    status?: StatusType | boolean,
    product_ids: number[]
}

