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