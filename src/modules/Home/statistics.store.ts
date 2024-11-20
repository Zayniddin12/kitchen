import {defineStore} from "pinia";
import {ref} from "vue";
import {
    KitchenPreparationParamsType,
    KitchenPreparationType, ProductsParamsType, ProductsType, StatisticCountParamsType, StatisticCountType,
    VisitorsParamsType,
    VisitorsType,
    WarehouseCapacityParamsType,
    WarehouseCapacityType
} from "@/modules/Home/statistics.types";
import statisticsApi from "@/modules/Home/statistics.api";

export const useStatisticsStore = defineStore("statisticsStore", () => {

    const warehouseCapacity = ref<WarehouseCapacityType | null>(null);
    const warehouseCapacityLoading = ref<boolean>(false);

    const fetchWarehouseCapacity = async (params: WarehouseCapacityParamsType = {}) => {
        warehouseCapacityLoading.value = true;

        try {
            warehouseCapacity.value = await statisticsApi.fetchWarehouseCapacity(params);
        } finally {
            warehouseCapacityLoading.value = false;
        }
    }

    const visitors = ref<VisitorsType | null>(null);
    const visitorsLoading = ref(false);

    const fetchVisitors = async (params: VisitorsParamsType = {}) => {
        visitorsLoading.value = true;

        try {
            visitors.value = await statisticsApi.fetchVisitors(params);
        } finally {
            visitorsLoading.value = false;
        }
    }

    const kitchenPreparations = ref<KitchenPreparationType | null>(null);
    const kitchenPreparationsLoading = ref(false);

    const fetchKitchenPreparations = async (params: KitchenPreparationParamsType = {}) => {
        kitchenPreparationsLoading.value = true;

        try {
            kitchenPreparations.value = await statisticsApi.fetchKitchenPreparations(params);
        } finally {
            kitchenPreparationsLoading.value = false;
        }
    }

    const products = ref<ProductsType>([]);
    const productsLoading = ref(false);

    const fetchProducts = async (params: ProductsParamsType = {}) => {
        productsLoading.value = true;

        try {
            products.value = await statisticsApi.fetchProducts(params);
        } finally {
            productsLoading.value = false;
        }
    }

    const kitchenCount = ref<StatisticCountType>([]);
    const kitchenCountLoading = ref(false);

    const fetchKitchenCount = async (params: StatisticCountParamsType = {}) => {
        kitchenCountLoading.value = true;

        try {
            kitchenCount.value = await statisticsApi.fetchKitchenCount();
        } finally {
            kitchenCountLoading.value = false;
        }
    }

    const warehouseCount = ref<StatisticCountType>([]);
    const warehouseCountLoading = ref(false);

    const fetchWarehouseCount = async (params: StatisticCountParamsType = {}) => {
        warehouseCountLoading.value = true;

        try {
            warehouseCount.value = await statisticsApi.fetchWarehouseCount();
        } finally {
            warehouseCountLoading.value = false;
        }
    }


    return {
        warehouseCapacity,
        warehouseCapacityLoading,
        fetchWarehouseCapacity,
        visitors,
        visitorsLoading,
        fetchVisitors,
        kitchenPreparations,
        kitchenPreparationsLoading,
        fetchKitchenPreparations,
        products,
        productsLoading,
        fetchProducts,
        kitchenCount,
        kitchenCountLoading,
        fetchKitchenCount,
        warehouseCount,
        warehouseCountLoading,
        fetchWarehouseCount
    };
});