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

export interface UserShowType extends UserType {
    birthday: null | string,
    nationality: null | string,
    gender: null | string,
    pass_number: null | string,
    pass_given_by: null | string,
    pass_given_at: null | string,
    pass_valid_until: null | string,
    pinfl: null | string,
    position_id: number,
    dining_locations: null | string
}

export interface UsersType {
    users: UserType[];
    pagination: PaginationType;
}

export interface UsersParamsType extends PaginationParamsType {
    search?: string,
    status?: string,
}