import { defineStore } from "pinia";
import { computed, ref } from "vue";
import workshopsApi from "@/modules/WorkShops/workshops.api";
import { ActiveManagementBaseType } from "@/modules/WorkShops/workshops.types";
import { FillingPercentageResponseType } from "@/modules/KitchenWarehouse/kitchen-warehouse.types";
import {
  ManagementBasesType,
  WarehouseBasesInvoicesParamsType, WarehouseBasesInvoicesResponseType,
  WarehouseBasesProductsParamsType,
  WarehouseBasesProductsResponseType,
} from "@/modules/WorkShops/workshops.types";
import warehouseBasesApi from "@/modules/WarehouseBases/warehouse-bases.api";
import type { BaseWarehouseDataType } from "@/modules/Settings/components/Reference/MainBases/base-warehouses.type";
import $axios from "@/plugins/axios/axios";

export const useWorkshopsStore = defineStore("workshopsStore", () => {

  const createWorkshopUnpacking = (data: any, id: number | string) => {
    return $axios.post(`workshop-warehouses/${id}/unpacking`, data);
  };

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

  const activeManagementBase = ref<ActiveManagementBaseType | null>(null);
  const getManagementWorkshop = (management_id: number, workshop_id: number) => {
    const activeManagement = managementBases.value.find(el => el.id === management_id);

    if (activeManagement) {
      activeManagementBase.value = { ...activeManagement, workshops: null };

      const activeBase = activeManagement.workshops.find(el => el.id === workshop_id);

      if (activeBase) activeManagementBase.value.workshops = activeBase;
    }
  };

  const fillingPercentage = ref<null | FillingPercentageResponseType>(null);
  const fillingPercentageLoading = ref(false);

  const fetchFillingPercentage = async (id: number) => {
    fillingPercentageLoading.value = true;

    try {
      fillingPercentage.value = await workshopsApi.fetchFillingPercentage(id);
    } finally {
      fillingPercentageLoading.value = false;
    }
  };

  const products = ref<WarehouseBasesProductsResponseType | null>(null);
  const productsLoading = ref(false);

  const fetchProducts = async (id: number, params: WarehouseBasesProductsParamsType = {}) => {
    productsLoading.value = true;

    try {
      products.value = await workshopsApi.fetchProducts(id, params);
    } finally {
      productsLoading.value = false;
    }
  };

  const managementBasesWorkshopsMenu = computed(() => {
    return managementBases.value.map(el => {
      const menu: Record<string, any> = {
        id: el.id,
        title: el.name,
        icon: "building-warehouse",
      };
      if (el.workshops.length) {
        menu.children = el.workshops.map(workshop => {
          return {
            id: workshop.id,
            title: workshop.name,
            route: `/workshop/${el.id}/${workshop.id}`,
          };
        });
      }

      return menu;
    });
  });


  return {
    createWorkshopUnpacking,

    fetchProducts,
    productsLoading,
    products,

    fillingPercentageLoading,
    fillingPercentage,
    fetchFillingPercentage,

    activeManagementBase,
    getManagementWorkshop,

    managementBases,
    managementBasesLoading,

    fetchManagementBases,
    managementBasesWorkshopsMenu,
  };
});