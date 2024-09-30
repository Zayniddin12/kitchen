import { defineStore } from "pinia";
import { ref } from "vue";

export const useKitchenWarehouseStore = defineStore("kitchenWarehouse", () => {
  const dynamicState = ref([
    {
      id: 1,
      title: "Зарафшан",
      icon: "building-warehouse",
      route: "/kitchen-warehouse",
    },
    {
      id: 2,
      title: "Навои",
      icon: "building-warehouse",
      route: "/kitchen-warehouse",
    },
    {
      id: 3,
      title: "Учкудук",
      icon: "building-warehouse",
      route: "/kitchen-warehouse",
    },
    {
      id: 4,
      title: "Нуробод",
      icon: "building-warehouse",
      route: "/kitchen-warehouse",
    },
    {
      id: 5,
      title: "Зафаробод",
      icon: "building-warehouse",
      route: "/kitchen-warehouse",
    },
  ]);

  return {
    dynamicState,
  };
});