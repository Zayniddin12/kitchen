export type ManagementIdType = number | null;

export interface WarehouseCapacityParamsType {
    management_id?: ManagementIdType;
}

export interface WarehouseCapacityType {
    total_capacity: number,
    total_exist: number
}

export interface VisitorsParamsType extends WarehouseCapacityParamsType {
    from_date?: string,
    to_date?: string,
}

export interface VisitorsType {
    paid: number,
    free: number,
}

export interface KitchenPreparationParamsType extends VisitorsParamsType {
    type_id?: number | "",
}

export interface KitchenPreparationKitchenType {
    name: string,
    price: number,
}

export interface KitchenPreparationType {
    total_price: number,
    kitchens: KitchenPreparationKitchenType[]
}

export interface ProductsParamsType extends WarehouseCapacityParamsType {
}

export interface ProductType {
    product_image: null | string,
    product_name: string,
    product_parent_name: string,
    quantity: null | number,
    unit_name: string,
    base_name: string
}

export type ProductsType = ProductType[];

export interface GraphProductsParamsType extends VisitorsParamsType {
    type_id?: number | "",
}

export interface GraphProductDataType {
    date: string,
    value: number,
}

export interface GraphProductType {
    warehouse_name: string,
    color: string,
    data: GraphProductDataType[],
}

export type GraphProductsType = GraphProductType[];

export interface StatisticCountParamsType extends WarehouseCapacityParamsType {
}

export interface StatisticCountCountType {
    kitchen_type_name: string,
    count: number
}

export type StatisticCountType = StatisticCountCountType[];