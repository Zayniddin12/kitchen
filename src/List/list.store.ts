import { defineStore } from "pinia";
import { ref } from "vue";
import { ListType } from "@/List/list.types";
import listApi from "@/List/list.api";

export const useListStore = defineStore("listStore", () => {

  const foodFactoriesLoading = ref(false);
  const foodFactories = ref<ListType>([]);

    const fetchFoodFactories = async (id: number) => {
    foodFactoriesLoading.value = true;

    try {
      const { food_factories } = await listApi.fetchList({
        id,
        parent_url: "managements",
        url: "food-factories",
      });
      foodFactories.value = food_factories;
    } finally {
      foodFactoriesLoading.value = false;
    }
  };

  const basesLoading = ref(false);

  const bases = ref<ListType>([]);

  const fetchBases = async (id: number) => {
    basesLoading.value = true;

    try {
      const response = await listApi.fetchList({
        id,
        parent_url: "food-factories",
        url: "bases",
      });
      bases.value = response.bases;
    } finally {
      basesLoading.value = false;
    }
  };

  const baseWarehousesLoading = ref(false);
  const baseWarehouses = ref<ListType>([]);

  const fetchBaseWarehouses = async (id: number) => {
    baseWarehousesLoading.value = true;

    try {
      const response = await listApi.fetchList({
        id,
        parent_url: "bases",
        url: "base-warehouses",
      });
      baseWarehouses.value = response["base-warehouses"];
    } finally {
      baseWarehousesLoading.value = false;
    }
  };

  const kitchenWarehousesLoading = ref(false);
  const kitchenWarehouses = ref<ListType>([]);

  const fetchKitchenWarehouses = async (id: number) => {
    kitchenWarehousesLoading.value = true;

    try {
      const response = await listApi.fetchList({
        id,
        parent_url: "bases",
        url: "kitchen-warehouses",
      });
      kitchenWarehouses.value = response["kitchen-warehouses"];
    } finally {
      kitchenWarehousesLoading.value = false;
    }
  };

  return {
    foodFactoriesLoading,
    foodFactories,
    fetchFoodFactories,
    basesLoading,
    bases,
    fetchBases,
    baseWarehousesLoading,
    baseWarehouses,
    fetchBaseWarehouses,
    kitchenWarehousesLoading,
    kitchenWarehouses,
    fetchKitchenWarehouses,
  };
});