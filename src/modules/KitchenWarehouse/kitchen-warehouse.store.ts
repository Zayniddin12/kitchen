import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useSettingsStore } from "@/modules/Settings/store";
import {
    FillingPercentageResponseType,
    ListInvoicesParamsType,
    ListInvoicesResponseType,
    ListProductsParamsType,
    ListProductsResponseType, UpdatePriceDataType
} from "@/modules/KitchenWarehouse/kitchen-warehouse.types";
import kitchenWarehouseApi from "@/modules/KitchenWarehouse/kitchen-warehouse.api";
import axios from "@/plugins/axios/axios";


interface DynamicItemStateType {
    id: number;
    title: string;
    icon: string;
    route: string;
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
        dynamicItemState.value =
            dynamicState.value.find(el => el.id === id) ?? null;
    };

    const listProducts = ref<ListProductsResponseType | null>(null);
    const listProductsLoading = ref(false);

    const fetchListProducts = async (
        id: number,
        params: ListProductsParamsType = {}
    ) => {
        listProductsLoading.value = true;

        try {
            listProducts.value = await kitchenWarehouseApi.fetchListProducts(
                id,
                params
            );
        } finally {
            listProductsLoading.value = false;
        }
    };

    const listInvoices = ref<ListInvoicesResponseType | null>(null);
    const listInvoicesLoading = ref(false);

    const fetchListInvoices = async (
        id: number,
        params: ListInvoicesParamsType = {}
    ) => {
        listInvoicesLoading.value = true;

        try {
            listInvoices.value = await kitchenWarehouseApi.fetchListInvoices(
                id,
                params
            );
        } finally {
            listInvoicesLoading.value = false;
        }
    };

    const fillingPercentage = ref<null | FillingPercentageResponseType>(null);
    const fillingPercentageLoading = ref(false);

    const fetchFillingPercentage = async (id: number) => {
        fillingPercentageLoading.value = true;

        try {
            fillingPercentage.value =
                await kitchenWarehouseApi.fetchFillingPercentage(id);
        } finally {
            fillingPercentageLoading.value = false;
        }
    };

    const updatePriceLoading = ref(false);

    const updatePrice = async (id: number, data: UpdatePriceDataType) => {
        updatePriceLoading.value = true;

        try {
            await kitchenWarehouseApi.updatePrice(id, data);
        }finally {
            updatePriceLoading.value = false;
        }
    };

    const CREATE_FACTORY_KITCHEN = ({id, data}) => {
        return axios.post(`/kitchen-warehouses/${id}/unpacking`, data)
    }

    return {
        dynamicState,
        dynamicItemState,
        fetchDynamicItemState,

        listProducts,
        listProductsLoading,
        fetchListProducts,
        listInvoices,
        listInvoicesLoading,
        fetchListInvoices,
        fillingPercentage,
        fillingPercentageLoading,
        fetchFillingPercentage,
        updatePriceLoading,
        updatePrice,

        CREATE_FACTORY_KITCHEN
    };
});
