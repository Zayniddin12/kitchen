export interface DocumentProductType {
    product_type_id: number | "",
    quantity: number | null,
    unit_id: number | "",
    price: number | null,
    total_price?: number | null,
    [key:string]: any,
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