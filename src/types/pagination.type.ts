export interface PaginationParamsType {
    page?: number | null;
    per_page?: number | null;
}

export interface PaginationType{
    current_page: number;
    per_page: number;
    items_count: number,
    total_count: number,
    pages_count: number
}