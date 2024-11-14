import { PaginationParamsType, PaginationType } from "@/types/pagination.type";

export interface DocumentProductType {
    category_id: number | "";
    product_type_id: number | "",
    quantity: number | null,
    unit_id: number | "",
    price: number | null,
    total_price?: number | null,

    [key: string]: any,
}

export type DocumentStatusType = "sent" | "draft" | "";

export interface DocumentCreateDataDocumentType {
    doc_type_id?: number | null,
    date?: string,
    number?: string,
    from?: string,
    from_id?: number | null,
    from_type?: string,
    to?: string,
    to_id?: number | null,
    to_type?: string,
    through_whom?: string,
    subject?: string,
    basis?: string,
    shipping_method?: string,
    status?: DocumentStatusType,
    products?: DocumentProductType[],
    content?: string
}

export interface DocDetailsType {
    licence: string,
    licence_date: string,
    sanitary: string,
    sanitary_date: string,
    vetirinary: string,
    vetirinary_date: string,
    quality: string,
    quality_date: string,
    contract_details: string,
    contract_details_date: string,
    manufacturer: string,
}

export interface DocSignerType {
    signer_id: number,
}

export interface DocumentCreateDataActType {
    number: string,
    subject: string,
    content: string,
    shipping_method: string,
    products: DocumentProductType[],
    doc_details: DocDetailsType,
    doc_signers: DocSignerType[],
    doc_signer_obj: {
        signer_id_1: number | "",
        signer_id_2: number | "",
        signer_id_3: number | "",
        signer_id_4: number | "",
        signer_id_5: number | "",
    }
}

export interface DocumentCreateDataType {
    Document: DocumentCreateDataDocumentType,
    Act?: DocumentCreateDataActType
}

export interface DraftsParamsType extends PaginationParamsType {
    search?: string,
    from_date?: string,
    to_date?: string,
    number?: string,
    subject?: string,
    to_id?: number | "",
    from_id?: number | "",
    doc_type?: string
}

export interface DraftType {
    id: string,
    date: string,
    subject: null | string,
    status: string,
    from_name: string,
    to_name: string,
    number: string,
    content: ""
}

export interface DraftsResponseType {
    documents: DraftType[];
    paginator: PaginationType;
}

export interface DocumentType {
    id: string,
    type: string,
    date: string,
    number: string,
    to_id?: number | null,
    to_type?: string,
    to_name: string,
    subject: string | null,
    content: string | null,
    from_id?: null | number,
    from_type?: string,
    from_name: string,
}