import { NameType, StatusType } from "@/types/common.type";
import { PaginationType } from "@/types/pagination.type";

export interface BaseWarehousesParamsType {
    search?: string;
}

export interface BaseWarehouseType {
    id: number;
    name: NameType,
    base_id: number,
    capacity: number,
    measure_id: number,
    status: StatusType,
}

interface BaseWarehouseListType extends BaseWarehouseType {
    name: string;
}

export interface BaseWarehousesType {
    base_warehouses: BaseWarehouseListType[],
    paginator: PaginationType
}

export interface BaseWarehouseDataType{
    name: NameType,
    base_id: number | null,
    capacity: number | null,
    measure_id: number | null,
    status?: StatusType | boolean
}

