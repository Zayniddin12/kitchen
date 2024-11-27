import { PaginationParamsType, PaginationType } from "@/types/pagination.type";

export interface WarehouseBasesProductsParamsType extends PaginationParamsType {
    product_id?: number | "",
    measurement_unit_id?: number | "",
    quantity?: number | null,
    price?: number | null,
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
    warehouse_products: WarehouseBasesProductType[],
    paginator: PaginationType
}

export interface WarehouseBasesInvoicesParamsType extends WarehouseBasesProductsParamsType {
    from_date?: string,
    to_date?: string,
    document_id?: number | ""
}

export interface WarehouseBasesInvoiceType {

}

export interface WarehouseBasesInvoicesResponseType {
    invoices: WarehouseBasesInvoiceType[],
    pagination: PaginationType
}