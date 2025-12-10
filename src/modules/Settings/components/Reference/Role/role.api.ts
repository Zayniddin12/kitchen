import {
  RolesParamsType,
  RolesType,
  PermissionsListType,
  RoleType,
} from "@/modules/Settings/components/Reference/Role/role.types";
import axios from "@/plugins/axios/axios";
import $axios from "@/plugins/axios/axios";

const prefix = "roles";

export default {
  async fetchRoles(params: RolesParamsType = {}) {
    const { data } = await axios.get(prefix, { params });
    return data.data.roles as RolesType;
  },
  async fetchPermissions() {
    const { data } = await axios.get('permissions');
    return data.data.permissionsGroups as PermissionsListType;
  },
  async fetchPermissionsById(id: number) {
    const { data } = await axios.get(`roles/${id}`);
    return data.data.permissions as RoleType[];
  },
  async updatePermissions( id: string | number, permissions: string[] ) {
    return await $axios.put("roles/" + id, {
        permissions:permissions
    });

  },
  async deletePermissions  (id: string | number) {
    return await $axios.delete("/pantry-warehouses/" + id);

  }
};