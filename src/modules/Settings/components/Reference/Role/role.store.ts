import { defineStore } from "pinia";
import { ref } from "vue";
import { RolesParamsType, RolesType, PermissionsListType } from "@/modules/Settings/components/Reference/Role/role.types";
import roleApi from "@/modules/Settings/components/Reference/Role/role.api";
import { useCommonStore } from "@/stores/common.store";
import {useI18n} from "vue-i18n";

export const useRoleStore = defineStore("roleStore", () => {

  const {t} = useI18n();
  const commonStore = useCommonStore();
  const rolesLoading = ref(false);
  const permissionsLoading = ref(false);
  const roles = ref<RolesType>([]);
  const permissions = ref<PermissionsListType>();
  const permissionsbyId = ref<any>();
  const fetchRoles = async (params: RolesParamsType = {}) => {
    rolesLoading.value = true;

    try {
      roles.value = await roleApi.fetchRoles(params);
    } finally {
      rolesLoading.value = false;
    }
  };
  const fetchPermissions = async () => {
    permissionsLoading.value = true;

    try {
      permissions.value = await roleApi.fetchPermissions();
    } finally {
      permissionsLoading.value = false;
    }
  };

  const fetchPermissionsById= async (id: number) => {
    permissionsLoading.value = true;
    try {
      permissionsbyId.value = await roleApi.fetchPermissionsById(id);
    } finally {
      permissionsLoading.value = false;
    }
  }
  const updatePermissions= async (id: number, data:string[]) => {
    permissionsLoading.value = true;
    try {
      await commonStore.goodToast( t("successfullySent"));
     return  await roleApi.updatePermissions(id, data);

    }catch {
      await commonStore.errorToast( t("errorOccurred"));
      return 'error'
    } finally {
      permissionsLoading.value = false;
    }
  }
  const deleteRoleById = async (id: number) => {
    permissionsLoading.value = true;
    try {
      await commonStore.goodToast( t("successfullySent"));
     return await roleApi.deletePermissions(id);
    }catch {
      await commonStore.errorToast( t("errorOccurred"));
      return 'error'
    } finally {
      permissionsLoading.value = false;
    }
  }
  return {
    rolesLoading,
    permissionsLoading,
    permissions,
    roles,
    permissionsbyId,
    fetchRoles,
    fetchPermissions,
    fetchPermissionsById,
    updatePermissions,
    deleteRoleById
  };
});