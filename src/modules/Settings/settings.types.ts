import { NameType, StatusType } from "@/types/common.type";

export interface DocTypeListType {
  id: number,
  name: string,
  childs: DocTypeListType[]
}

export interface RespondentParamsType {
  search?: string;
}

export interface RespondentType {
  id: number,
  name: string,
  model_type: string
}

export interface KitchenWarehouseListParamsType {
  is_paid?: 0 | 1;
}

export interface KitchenWarehouseListItemType {
  id: number,
  name: string
}

export interface KitchenTypesListParamsType {
  search?: string;
}

export interface KitchenTypesListItemType extends KitchenWarehouseListItemType {
  is_paid: boolean,
}

export interface TypeProductDetailType {
  id: number,
  name: NameType,
  image: null | string,
  measurement_unit_id: number,
  measurement_unit_name: string,
  parent_id: number,
  parent_name: string,
  ready_to_eat: boolean,
}

export interface RationProductTypeType {
  id: number,
  unit_id: number,
  quantity: string,
  parent_id: number
}

export interface RationType {
  id: number,
  name: NameType,
  number: string,
  start_time: string,
  end_time: string,
  is_active: boolean,
  duration_in_days: number,
  kitchen_type_ids: number[],
  meals: any[],
  product_types: RationProductTypeType[]
}

export interface MealDetailCompositionType {
  unit: string,
  unit_id: number,
  product_type_name: string,
  product_type_id: number,
  product_type_parent_id: number,
  product_type_parent_name: string,
  quantity: string,
  price: number,
}

export interface MealDetailType {
  id: number,
  name: NameType,
  image: null | string,
  number: string,
  unit: string,
  unit_id: number,
  compositions: MealDetailCompositionType[],
  net_price: number,
  tax: number,
  price: number
}

export interface OrganizationDetailType {
  id: number,
  name: string,
  address: string,
  tin: string,
  status: StatusType,
  created_at: string,
  updated_at: string,
}

export interface ProviderDetailType extends OrganizationDetailType {
  oked: string,
  license: string,
  sertificate: string,
  sert_end_date: string,
  director: string,
  phone: string,
}

export interface RegionalDetailType {
  id: number,
  name: NameType,
  responsible_position: string,
  created_at: string,
  updated_at: string,
  status: StatusType,
}

export interface KitchenWarehouseDetailType {
  id: number,
  name: NameType,
  base_id: number,
  capacity: number,
  kitchen_capacity: number,
  kitchen_type_id: number,
  measure_id: number,
  status: StatusType,
  created_at: string,
  updated_at: string,
  warehouseProducts: Record<string, any>[]
}

export interface KitchenTypeDetailType {
  id: number,
  name: NameType,
  is_paid: boolean,
  status: StatusType,
  created_at: string,
  updated_at: string,
}