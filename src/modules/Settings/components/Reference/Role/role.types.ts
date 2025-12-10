
export interface RolesParamsType {
  search?: string;
  depend_id?: number | "";
  depend_type?: string;
}

export interface RoleType {
  id: number,
  title: string,
  name?: string,
  users_count?: number,
  parent_name?: string,
}

export interface PermissionsListType  {
  "module_title": string,
  "module_name": string,
  "permissions":{
      "id": 152,
      "title": string | {
        "update-ocp-place"?: string,
        "index"?: string,
        "store"?: string,
        "categories"?: string,
        "show"?: string,
        "update"?: string,
        "destroy"?: string
      },
      "name": string
    }[]
}[]

export type RolesType = RoleType[];