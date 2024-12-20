import { PaginationParamsType, PaginationType } from "@/types/pagination.type";

export interface ProductCommonType {
    transportation_costs_percent: number,
    markup_percent: number,
    profitability_percent: number,
    vat_percent: number
}

export interface UpdatePriceDataType extends ProductCommonType {
}

export interface ListProductCommonType extends ProductCommonType {
    id: number;
    product_name: string;
    quantity: number;
    unit_name: string;
    total_price: number,
    isEdit?: boolean;
}

export interface ListProductCommonParamsType {
    product_type_id?: number | "";
    quantity?: number | null;
    unit_id?: number | "";
    total_price?: number | null;
}

export interface ListProductsParamsType
    extends PaginationParamsType,
        ListProductCommonParamsType {
}

export interface GroupProductType {
    parent_name: string;
    products: ListProductType[];
}

export interface ListProductType extends ListProductCommonType {
    product_type_id: number;
}

export interface ListProductsResponseType {
    grouped_products: GroupProductType[];
    pagination: PaginationType;
}

export interface ListInvoicesParamsType extends PaginationParamsType, ListProductCommonParamsType {
    from_date?: string;
    to_date?: string;
    doc_number?: string;
    price?: number | null;
}

export interface ListInvoiceType extends ListProductCommonType {
    invoice_number: string;
}

export interface ListInvoicesResponseType {
    invoices: ListInvoiceType[];
    pagination: PaginationType;
}

export interface FillingPercentageResponseType {
    percentage: number;
}
