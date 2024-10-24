import { defineStore } from "pinia";
import $axios from "@/plugins/axios";
import { ref } from "vue";
import {
    FoodFactoriesCreateFormType, FoodFactoryType
} from "@/modules/Settings/components/Reference/CombineNutrition/combine-nutrition.type";

interface TypeDocument {
    document_categories: Array<{ id: string | number, name: string }>;
}

interface VidDocument {
    documents: Array<{ id: string | number, name: string }>;
}


export const useSettingsStore = defineStore("settingsStore", () => {
    // dilshod
    const typeProduct = ref({
        product_categories: [] as any
    });
    const vidProduct = ref({
        product_types: [] as any
    });
    const units = ref({
        units: [] as any
    });
    const providers = ref({
        providers: [] as any,
        paginator: {} as any
    });
    const regional = ref({
        managements: [] as any,
        paginator: {} as any
    });
    const organization = ref({
        organization: [] as any,
        paginator: {} as any
    });
    const kitchenTypes = ref({
        kitchenTypes: [] as any,
        paginator: {} as any
    });
    const meals = ref({
        meals: [] as any,
        pagination: {} as any
    });
    // dilshod


    // begzod
    const typeDocument = ref<TypeDocument>({
        document_categories: []
    });
    const vidDocument = ref<VidDocument>({
        documents: []
    });

    // begzod end


    // begzod

    // Документы Типы документов
    const GET_TYPE_DOCUMENT = async (params?: { search: string | null }) => {
        const { data } = await $axios.get("/documents/categories", { params });
        typeDocument.value = data.data;
    };


    const GET_VID_DOCUMENT = async (params?: { search: string | null }) => {
        const { data } = await $axios.get("/documents", { params });
        vidDocument.value = data.data;
    };


    // begzod end

    // dilshod
    // Продукты Типы документов
    const GET_TYPE_PRODUCT = async (params?: any) => {
        const { data } = await $axios.get("/product-types/categories", { params });
        typeProduct.value = data.data;
    };

    const GET_TYPE_PRODUCT_DETAIL = async (id: number) => {
        const { data } = await $axios.get(`/product-types/${id}/`);
        return data;
    };

    const CREATE_TYPE_PRODUCT = (data: any) => {
        return $axios.post("/product-types", data);
    };

    const UPDATE_TYPE_PRODUCT = ({ id, data }: { id: string | number; data: any }) => {
        return $axios.put(`/product-types/${id}/`, data);
    };

    const DELETE_TYPE_PRODUCT = (id: number) => {
        return $axios.delete(`/product-types/${id}/`);
    };

    // Продукты Виды документов
    const GET_VID_PRODUCT = async (params: any) => {
        const { data } = await $axios.get("/product-types", { params });
        vidProduct.value = data.data;
    };

    const CREATE_VID_PRODUCT = (data: any) => {
        return $axios.post("/product-types", data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    };

    const UPDATE_VID_PRODUCT = ({ id, data }: { id: string | number; data: any }) => {
        return $axios.put(`/product-types/${id}/`, data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    };

    // Единицы измерения
    const GET_UNITS = async (params?: any) => {
        const { data } = await $axios.get("/measurement-units", { params });
        units.value = data.data;
    };

    // поставщика
    const CREATE_PROVIDERS = (data: any) => {
        return $axios.post("/providers", data);
    };

    const UPDATE_PROVIDERS = ({ id, data }: { id: string | number; data: any }) => {
        return $axios.put(`/providers/${id}/`, data);
    };

    const GET_PROVIDERS = async (params: any) => {
        const { data } = await $axios.get("/providers", { params });
        providers.value = data.data;
    };

    const GET_PROVIDERS_DETAIL = async (id: number) => {
        const { data } = await $axios.get(`/providers/${id}/`);
        return data.data;
    };

    const DELETE_PROVIDERS = async (id: number) => {
        return $axios.delete(`/providers/${id}`);
    };

    // региональное управление
    const CREATE_REGIONAL = (data: any) => {
        return $axios.post("/managements", data);
    };

    const UPDATE_REGIONAL = ({ id, data }: { id: string | number; data: any }) => {
        return $axios.put(`/managements/${id}/`, data);
    };

    const GET_REGIONAL = async (params: any) => {
        const { data } = await $axios.get("/managements", { params });
        regional.value = data.data;
    };

    const GET_REGIONAL_DETAIL = async (id: number) => {
        const { data } = await $axios.get(`/managements/${id}/`);
        return data;
    };

    const DELETE_REGIONAL = async (id: number) => {
        return $axios.delete(`/managements/${id}`);
    };

    // Организации
    const CREATE_ORGANIZATION = (data: any) => {
        return $axios.post("/organizations", data);
    };

    const UPDATE_ORGANIZATION = ({ id, data }: { id: string | number; data: any }) => {
        return $axios.put(`/organizations/${id}/`, data);
    };

    const GET_ORGANIZATION = async (params: any) => {
        const { data } = await $axios.get("/organizations", { params });
        organization.value = data.data;
    };

    const GET_ORGANIZATION_DETAIL = async (id: number) => {
        const { data } = await $axios.get(`/organizations/${id}/`);
        return data.data;
    };

    const DELETE_ORGANIZATION = async (id: number) => {
        return $axios.delete(`/organizations/${id}`);
    };

    // тип кухни
    const CREATE_KITCHEN_TYPE = (data: any) => {
        return $axios.post("/kitchen-types", data);
    };

    const UPDATE_KITCHEN_TYPE = ({ id, data }: { id: string | number; data: any }) => {
        return $axios.put(`/kitchen-types/${id}/`, data);
    };

    const GET_KITCHEN_TYPE = async (params: any) => {
        const { data } = await $axios.get("/kitchen-types", { params });
        kitchenTypes.value = data.data;
    };

    const GET_KITCHEN_TYPE_DETAIL = async (id: number) => {
        const { data } = await $axios.get(`/kitchen-types/${id}/`);
        return data.data;
    };

    const DELETE_KITCHEN_TYPE = async (id: number) => {
        return $axios.delete(`/kitchen-types/${id}`);
    };

    // Блюда
    const GET_MEALS = async (params: any) => {
        const { data } = await $axios.get("/meals", { params });
        meals.value = data.data;
    };
    // dilshod end

    // abbos start

    // Комбинаты питания

    const foodFactoriesPrefix = "food-factories";

    const createFoodFactory = async (data: FoodFactoriesCreateFormType) => {
        return await $axios.post(foodFactoriesPrefix, data);
    };

    const updateFoodFactory = async (id: number, data: FoodFactoriesCreateFormType) => {
        return await $axios.put(`${foodFactoriesPrefix}/${id}`, data);
    };

    const foodFactory = ref<null | FoodFactoryType>(null);
    const foodFactoryLoading = ref(false);

    const showFoodFactory = async (id: number) => {
         await $axios.get(`${foodFactoriesPrefix}/${id}`).then(({data}) => {

         }).finally(() => foodFactoryLoading.value = false);
    };

    // abbos end

    return {
        // begzod
        vidDocument,
        typeDocument,
        GET_TYPE_DOCUMENT,
        GET_VID_DOCUMENT,
        // begzod end


        // dilshod
        typeProduct,
        GET_TYPE_PRODUCT,
        GET_TYPE_PRODUCT_DETAIL,
        CREATE_TYPE_PRODUCT,
        UPDATE_TYPE_PRODUCT,
        DELETE_TYPE_PRODUCT,

        vidProduct,
        GET_VID_PRODUCT,
        CREATE_VID_PRODUCT,
        UPDATE_VID_PRODUCT,

        units,
        GET_UNITS,

        providers,
        CREATE_PROVIDERS,
        UPDATE_PROVIDERS,
        GET_PROVIDERS,
        GET_PROVIDERS_DETAIL,
        DELETE_PROVIDERS,

        regional,
        CREATE_REGIONAL,
        UPDATE_REGIONAL,
        GET_REGIONAL,
        GET_REGIONAL_DETAIL,
        DELETE_REGIONAL,

        organization,
        CREATE_ORGANIZATION,
        GET_ORGANIZATION,
        UPDATE_ORGANIZATION,
        GET_ORGANIZATION_DETAIL,
        DELETE_ORGANIZATION,

        kitchenTypes,
        CREATE_KITCHEN_TYPE,
        UPDATE_KITCHEN_TYPE,
        GET_KITCHEN_TYPE,
        GET_KITCHEN_TYPE_DETAIL,
        DELETE_KITCHEN_TYPE,

        meals,
        GET_MEALS,
        // dilshod end
        //     abbos start
        createFoodFactory,
        updateFoodFactory,
        showFoodFactory
    };
});