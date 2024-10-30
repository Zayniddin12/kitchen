export interface DocumentProductType{
    product_type_id: number,
    quantity: number,
    price: number,
    total_price: number
}

export interface DocumentCreateDataType {
    parent_id: number,
    doc_type_id: number,
    date: string,
    number: string,
    to_provider_id: number,
    through_whom: string,
    content: string,
    basis: string,
    shipping_method: string,
    status: "draft" | "send" | "",
    products: DocumentProductType[]
}