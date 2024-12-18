import { PaginationParamsType } from "@/types/pagination.type";

export interface RolesParamsType {
  search?: string;
}

export interface RoleType {
  id: number,
  title: string,
  name: string,
  users_count: number,
  parent_name: string,
}

export type RolesType = RoleType[];