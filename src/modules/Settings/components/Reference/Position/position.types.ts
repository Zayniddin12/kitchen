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

export interface PositionDataType {
  name: NameType,
  work_place_id: number | "",
  work_place_type: string,
  status: StatusType | boolean,
}