import { defineStore } from "pinia";
import { computed, ref } from "vue";
import axios from "@/plugins/axios/axios";
import { ManagementBasesType } from "@/modules/WarehouseBases/warehouse-bases.types";
import workshopsApi from "@/modules/WorkShops/workshops.api";

export const useWorkshopsStore = defineStore("workshopsStore", () => {

  const managementBases = ref<ManagementBasesType>([]);
  const managementBasesLoading = ref(false);

  const fetchManagementBases = async () => {
    managementBasesLoading.value = true;
    try {
      managementBases.value = await workshopsApi.fetchManagementBases();
    } finally {
      managementBasesLoading.value = false;
    }
  };

  const managementBasesWorkshopsMenu = computed(() => {
    return managementBases.value.map(el => {
      const menu: Record<string, any> = {
        id: el.id,
        title: el.name,
        icon: "building-warehouse",
      };
      if (el.bases.length) {
        menu.children = el.bases.map(base => {
          return {
            id: base.id,
            title: base.name,
            route: `/workshop/${el.id}/${base.id}`,
          };
        });
      }

      return menu;
    });
  });


  return {
    managementBases,
    managementBasesLoading,

    fetchManagementBases,
    managementBasesWorkshopsMenu,
  };
});