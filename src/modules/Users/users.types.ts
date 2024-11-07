import { NameType } from "@/types/common.type";
import { PaginationParamsType, PaginationType } from "@/types/pagination.type";

export interface UserType {
    id: number,
    firstname: string,
    lastname: string,
    patronymic: null | string,
    avatar: null | string,
    position: NameType | null,
    phone: string,
    is_oneid_enabled: boolean,
    status: string
}

export interface UsersType {
    users: UserType[];
    pagination: PaginationType;
}

export interface UsersParamsType extends PaginationParamsType {
    search?: string,
    status?: string,
}