import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useSettingsStore } from "@/modules/Settings/store";

interface DynamicItemStateType {
    id: number,
    title: string,
    icon: string,
    route: string
}

export const useKitchenWarehouseStore = defineStore("kitchenWarehouse", () => {
    const settingsStore = useSettingsStore();

    const dynamicState = computed<DynamicItemStateType[]>(() => {
        return settingsStore.regional.managements.map((item: any) => {
            return {
                id: item.id,
                title: item.name,
                icon: "building-warehouse",
                route: `/kitchen-warehouse/${item.id}`
            };
        });
    });

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