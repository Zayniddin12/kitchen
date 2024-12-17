import { defineStore } from "pinia";
import { ref } from "vue";
import { RolesParamsType, RolesType } from "@/modules/Settings/components/Reference/Role/role.types";
import roleApi from "@/modules/Settings/components/Reference/Role/role.api";

export const useRoleStore = defineStore("roleStore", () => {

  const rolesLoading = ref(false);
  const roles = ref<RolesType>([]);

  const fetchRoles = async (params: RolesParamsType = {}) => {
    rolesLoading.value = true;

    try {
      roles.value = await roleApi.fetchRoles(params);
    } finally {
      rolesLoading.value = false;
    }
  };

  return {
    rolesLoading,
    roles,
    fetchRoles,
  };
});