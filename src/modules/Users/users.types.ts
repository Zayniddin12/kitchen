import { GenderType, NameType, StatusType } from "@/types/common.type";
import { PaginationParamsType, PaginationType } from "@/types/pagination.type";
import { WorkPlaceType } from "@/modules/Settings/components/Reference/Position/position.types";

export interface UserType {
  id: number,
  firstname: string,
  lastname: string,
  patronymic: null | string,
  avatar_link: string,
  avatar: null | string,
  face_image_link: string,
  face_image: string,
  position: string,
  phone: string,
  is_oneid_enabled: boolean,
  work_place: string,
  work_hours: number | null,
  status: StatusType,
  organization_id: number | null,
  organization_name: string | null
}

export interface UserShowType extends UserType {
  birthday: null | string,
  nationality: null | string,
  gender: GenderType,
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
  role_id: number | null,
  role_title?: string | null,
  food_factory_id?: number | null,
  management_id?: number | null,
  base_id?: number | null,
  base_warehouse_id?: number | null,
  kitchen_warehouse_id?: number | null
}

export interface UsersType {
  users: UserType[];
  pagination: PaginationType;
}

export interface UsersParamsType extends PaginationParamsType {
  search?: string,
  status?: StatusType,
  role_name?: string,
}

export type UserApiUrlType = "users" | "employee";

export interface SearchUserDataType {
  pinfl?: string,
  pass_number?: string,
  birthday?: string,
}

export interface UserCreateOrUpdateDataPrefixType {
  phone: string,
  is_oneid_enabled: boolean,
}

export interface UserCreateDiningLocationsChildType {
  ration_id: number
  kitchen_id: number | "",
}

export interface UserCreateDiningLocationsTemporaryType extends UserCreateDiningLocationsChildType {
  ration_id:  number
  start_date: string,
  end_date: string,
}

export interface UserCreateDiningLocationsType {
  permanent: UserCreateDiningLocationsChildType,
  temporary: UserCreateDiningLocationsTemporaryType
}

export interface UserCreateOrUpdateDataType extends UserCreateOrUpdateDataPrefixType {
  firstname: string,
  organization_id: string | number,
  lastname: string,
  patronymic: string,
  birthday: string,
  nationality: string,
  gender: string,
  pass_number: string,
  pass_given_by: string,
  pass_given_at: string,
  pass_valid_until: string,
  avatar?: string | File,
  pinfl: string,
  position_id?: number | "",
  role_id?: number | "",
  management_id?: number | "",
  work_hours?: number | "",
  dining_locations?: UserCreateDiningLocationsType,
  status?: StatusType | boolean,
  work_place_id: number | "",
  work_place_type: WorkPlaceType
}