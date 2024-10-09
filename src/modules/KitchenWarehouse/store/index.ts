import { defineStore } from "pinia";
import { ref } from "vue";

interface DynamicItemStateType {
  id: number,
  title: string,
  icon: string,
  route: string
}

export const useKitchenWarehouseStore = defineStore("kitchenWarehouse", () => {
  const dynamicState = ref<DynamicItemStateType[]>([
    {
      id: 1,
      title: "Зарафшан",
      icon: "building-warehouse",
      route: "/kitchen-warehouse/1",
    },
    {
      id: 2,
      title: "Навои",
      icon: "building-warehouse",
      route: "/kitchen-warehouse/2",
    },
    {
      id: 3,
      title: "Учкудук",
      icon: "building-warehouse",
      route: "/kitchen-warehouse/3",
    },
    {
      id: 4,
      title: "Нуробод",
      icon: "building-warehouse",
      route: "/kitchen-warehouse/4",
    },
    {
      id: 5,
      title: "Зафаробод",
      icon: "building-warehouse",
      route: "/kitchen-warehouse/10",
    },
  ]);

  const dynamicItemState = ref<null | DynamicItemStateType>(null);

  const fetchDynamicItemState = (id: number) => {
    dynamicItemState.value = dynamicState.value.find(el => el.id === id) ?? null;
  };

  return {
    dynamicState,
    dynamicItemState,
    fetchDynamicItemState
  };
});