import { PaginationParamsType, PaginationType } from "@/types/pagination.type";

export interface DocumentProductType {
    product_type_id: number | "",
    quantity: number | null,
    unit_id: number | "",
    price: number | null,
    total_price?: number | null,

    [key: string]: any,
}

export interface DocumentCreateDataType {
    parent_id?: number | null,
    doc_type_id: number | null,
    date: string,
    number: string,
    from_id: number | null,
    from_type: string,
    to_id: number | null,
    to_type: string,
    through_whom: string,
    subject: string,
    basis: string,
    shipping_method: string,
    status: string,
    products: DocumentProductType[]
}

export interface DraftsParamsType extends PaginationParamsType {
    search?: string,
    from_date?: string,
    to_date?: string,
    number?: string,
    subject?: string,
    to_id?: number | "",
    from_id?: number | "",
}

export interface DraftType {
    id: string,
    date: string,
    subject: null | string,
    status: string,
    from_name: string,
    to_name: string,
}

export interface DraftsResponseType {
    documents: DraftType[];
    paginator: PaginationType;
}