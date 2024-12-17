import { RolesParamsType, RolesType } from "@/modules/Settings/components/Reference/Role/role.types";
import axios from "@/plugins/axios/axios";

const prefix = "roles";

export default {
  async fetchRoles(params: RolesParamsType = {}) {
    const { data } = await axios.get(prefix, { params });
    return data.data.roles as RolesType;
  },
};