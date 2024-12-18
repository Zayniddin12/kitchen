import { NameType, StatusType } from "@/types/common.type";
import { PaginationParamsType, PaginationType } from "@/types/pagination.type";

export interface PositionType {
  id: number;
  name: string,
  status: StatusType,
  work_place_name: string
}

export interface PositionsParamsType extends PaginationParamsType {
  getAll?: 1;
  search?: string;
}

export type PositionsType = PositionType[];

export interface PositionsPaginationType {
  positions: PositionsType,
  pagination: PaginationType
}

export interface PositionShowType extends Omit<PositionType, "name"> {
  name: NameType,
  work_place_id: number,
  work_place_type: string,
}

export type WorkPlaceType = "management" | "foodFactory" | "base" | "baseWarehouse" | "kitchenWarehouse" | "";

export interface PositionDataType {
  name: NameType,
  work_place_id: number | "",
  work_place_type: WorkPlaceType,
  status: StatusType | boolean,
}