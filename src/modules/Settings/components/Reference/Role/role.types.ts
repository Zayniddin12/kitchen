
export interface RolesParamsType {
  search?: string;
  depend_id?: number | "";
  depend_type?: string;
}

export interface RoleType {
  id: number,
  title: string,
  name: string,
  users_count: number,
  parent_name: string,
}

export type RolesType = RoleType[];