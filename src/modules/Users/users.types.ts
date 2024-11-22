import { NameType, StatusType } from "@/types/common.type";
import { PaginationParamsType, PaginationType } from "@/types/pagination.type";

export interface UserType {
    id: number,
    firstname: string,
    lastname: string,
    patronymic: null | string,
    avatar: null | string,
    position: string,
    phone: string,
    is_oneid_enabled: boolean,
    work_place: string,
    work_hours: number | null,
    status: StatusType
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
    dining_locations: null | string,
    responsible_id: null | number,
    responsible_name: string,
    responsible_type: string,
}

export interface UsersType {
    users: UserType[];
    pagination: PaginationType;
}

export interface UsersParamsType extends PaginationParamsType {
    search?: string,
    status?: StatusType,
}

export type UserApiUrlType = "users" | "employee";

export interface SearchUserDataType {
    pinfl?: string,
    pass_number?: string,
    birthday?: string,
}