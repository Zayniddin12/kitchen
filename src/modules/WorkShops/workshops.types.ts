import { PaginationParamsType, PaginationType } from "@/types/pagination.type";

export interface WarehouseBasesProductsParamsType extends PaginationParamsType {
  product_id?: number | "",
  measurement_unit_id?: number | "",
  quantity?: number | null,
  price?: number | null,
  net_price?: number | null,
}

export interface WarehouseProductType {
  id: number,
  name: string,
  measure: string
}

export interface WarehouseBasesProductType {
  id: number,
  product: WarehouseProductType,
  quantity: number | null,
  price: number,
  price_formatted: string
}

export interface WarehouseBasesProductsResponseType {
  grouped_products: WarehouseBasesProductType[],
  pagination: PaginationType
}

export interface WarehouseBasesInvoicesParamsType extends WarehouseBasesProductsParamsType {
  from?: string,
  to?: string,
  document_id?: number | ""
}

export interface WarehouseBasesInvoiceDocumentType {
  id: string,
  number: string,
  created_at: string,
  created_at_formatted: string,
}

export interface MeasurementUnitType{
  id: number,
  name: string,
}

export interface WarehouseBasesInvoiceProductType {
  id: number,
  name: string,
  measurement_unit: MeasurementUnitType
}

export interface WarehouseBasesInvoiceType {
  id: string,
  document: WarehouseBasesInvoiceDocumentType,
  product: WarehouseBasesInvoiceProductType,
  quantity: string,
  price: number,
  price_formatted: string,
  total_price: number,
  total_price_formatted: string,
}

export interface WarehouseBasesInvoicesResponseType {
  invoices: WarehouseBasesInvoiceType[],
  pagination: PaginationType
}

export interface ManagementBaseBaseType {
  id: number,
  name: string,
}

export interface ManagementBaseType {
  id: number,
  name: string,
  workshops: ManagementBaseBaseType[]
}

export type ManagementBasesType = ManagementBaseType[]

export interface ActiveManagementBaseType extends ManagementBaseBaseType {
  workshops: ManagementBaseBaseType | null;
}