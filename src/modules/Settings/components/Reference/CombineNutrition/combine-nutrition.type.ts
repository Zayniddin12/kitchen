import { NameType } from "@/types/common.type";

export interface FoodFactoriesCreateFormType{
    name: NameType,
    management_id: number | null
}