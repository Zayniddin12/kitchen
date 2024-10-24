import { NameType } from "@/types/common.type";

export interface FoodFactoriesCreateFormType{
    name: NameType,
    management_id: number | ""
}

export interface FoodFactoryType{
    id: number,
    name: NameType,
    management: Record<string, any>
}