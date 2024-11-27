import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useSettingsStore } from "@/modules/Settings/store";
import { FillingPercentageResponseType } from "@/modules/KitchenWarehouse/kitchen-warehouse.types";
import {
    WarehouseBasesInvoicesParamsType, WarehouseBasesInvoicesResponseType, WarehouseBasesProductsParamsType,
    WarehouseBasesProductsResponseType
} from "@/modules/WarehouseBases/warehouse-bases.types";
import warehouseBasesApi from "@/modules/WarehouseBases/warehouse-bases.api";

export const useWarehouseBasesStore = defineStore("warehouseBasesStore", () => {
    const settingsStore = useSettingsStore();

    const bases = ref<Map<number, Record<string, any>[]>>(new Map);

    const getBases = async (management_id: number) => {
        if (bases.value.has(management_id)) return;

        await settingsStore.GET_WAREHOUSE_BASES_LIST({ per_page: 100, management_id });

        bases.value.set(management_id, settingsStore.wareHouseList.bases);
    };

    const districts = ref<Record<string, any>>([]);

    const getDistricts = () => {
        settingsStore.regional.managements.forEach(async (item: any) => {
            await getBases(item.id);

            const activeBase = bases.value.get(item.id);

            if (activeBase && activeBase.length > 0 && !districts.value.find((el: any) => el.id === item.id)) districts.value.push({
                id: item.id,
                title: item.name,
                icon: "building-warehouse",
                children: activeBase.map(el => {
                    return {
                        id: el.id,
                        title: el.name,
                        route: `/warehouse/${item.id}/${el.id}`
                    };
                })
            });
        });
    };

    const product = ref<Record<string, any> | null>(null);
    const district = ref<Record<string, any> | null>(null);

    const getProduct = (district_id: number, product_id: number) => {


        district.value = districts.value.find((el: any) => el.id === district_id) ?? null;

        if (district.value && district.value.children) {
            product.value = district.value.children.find((el: any) => el.id === product_id) ?? null;
        } else {
            product.value = null;

        }
    };


    const fillingPercentage = ref<null | FillingPercentageResponseType>(null);
    const fillingPercentageLoading = ref(false);

    const fetchFillingPercentage = async (id: number) => {
        fillingPercentageLoading.value = true;

        try {
            await warehouseBasesApi.fetchFillingPercentage(id);
        } finally {
            fillingPercentageLoading.value = false;
        }
    };

    const products = ref<WarehouseBasesProductsResponseType | null>(null);
    const productsLoading = ref(false);

    const fetchProducts = async (id: number, params: WarehouseBasesProductsParamsType = {}) => {
        productsLoading.value = true;

        try {
            products.value = await warehouseBasesApi.fetchProducts(id, params);
        } finally {
            productsLoading.value = false;
        }
    };

    const invoices = ref<WarehouseBasesInvoicesResponseType | null>(null);
    const invoicesLoading = ref(false);

    const fetchInvoices = async (id: number, params: WarehouseBasesInvoicesParamsType = {}) => {
        invoicesLoading.value = true;

        try {
            invoices.value = await warehouseBasesApi.fetchInvoices(id, params);
        } finally {
            invoicesLoading.value = false;
        }
    };

    return {
        districts,
        district,
        product,
        getProduct,
        getDistricts,

        fillingPercentage,
        fillingPercentageLoading,
        fetchFillingPercentage,
        products,
        productsLoading,
        fetchProducts,
        invoices,
        invoicesLoading,
        fetchInvoices
    };
});