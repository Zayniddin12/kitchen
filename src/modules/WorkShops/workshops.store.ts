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
  const headPantryBases = ref<ManagementBasesType>([]);
  const headPantryBasesLoading = ref(false);


  const fetchHeadPantryBases = async () => {
    headPantryBasesLoading.value = true;
    try {
      headPantryBases.value = await workshopsApi.fetchHeadPantryBases();
    } finally {
      headPantryBasesLoading.value = false;
    }
  };

  const fetchManagementBases = async () => {
    managementBasesLoading.value = true;
    try {
      managementBases.value = await workshopsApi.fetchManagementBases();
    } finally {
      managementBasesLoading.value = false;
    }
  };

  // Head Pantry
  const activeHeadPantryBase = ref<ActiveManagementBaseType | null>(null);

  const getHeadPantryWorkshop = (management_id: number, workshop_id: number) => {
    const activeManagement = headPantryBases.value.find(el => el.id === management_id);

    if (activeManagement) {
      activeHeadPantryBase.value = { ...activeManagement, pantries: null };

      const activeBase = activeManagement.pantries.find(el => el.id === workshop_id);

      if (activeBase) activeHeadPantryBase.value.pantries = activeBase;
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

  // HEAD PANTRY

  const headPantryWorkshopsMenu = computed(() => {
    return headPantryBases.value.map(el => {
      const menu: Record<string, any> = {
        id: el.id,
        title: el.name,
        icon: "building-warehouse",
      };
      if (el.pantries.length) {
        menu.children = el.pantries.map(pantrie => {
          return {
            id: pantrie.id,
            title: pantrie.name,
            route: `/pantry/${el.id}/${pantrie.id}`,
          };
        });
      }

      return menu;
    });
  });

  const fillingPercentagePantry = ref<null | FillingPercentageResponseType>(null);
  const fillingPercentagePantryLoading = ref(false);

  const fetchFillingPercentagePantry = async (id: number) => {
    fillingPercentagePantryLoading.value = true;

    try {
      fillingPercentagePantry.value = await workshopsApi.fetchFillingPercentageHeadPantry(id);
    } finally {
      fillingPercentagePantryLoading.value = false;
    }
  };

  const productsPantry = ref<WarehouseBasesProductsResponseType | null>(null);
  const productsPantryLoading = ref(false);

  const fetchProductsPantry = async (id: number, params: WarehouseBasesProductsParamsType = {}) => {
    productsPantryLoading.value = true;

    try {
      productsPantry.value = await workshopsApi.fetchProductsHeadPantry(id, params);
    } finally {
      productsPantryLoading.value = false;
    }
  };


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

    // HEAD PANTRY

    activeHeadPantryBase,
    getHeadPantryWorkshop,

    headPantryBases,
    headPantryBasesLoading,

    headPantryWorkshopsMenu,
    fetchHeadPantryBases,

    fillingPercentagePantry,
    fetchFillingPercentagePantry,
    fillingPercentagePantryLoading,

    fetchProductsPantry,
    productsPantryLoading,
    productsPantry
  };
});