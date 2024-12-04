import { defineStore } from "pinia";
import $axios from "@/plugins/axios/axios";
import { reactive, ref } from "vue";
import type {
  FoodFactoriesCreateFormType, FoodFactoriesParamsType, FoodFactoriesType, FoodFactoryType,
} from "@/modules/Settings/components/Reference/CombineNutrition/combine-nutrition.type";
import type {
  BaseWarehouseDataType, BaseWarehousesParamsType, BaseWarehousesType,
  BaseWarehouseType,
} from "@/modules/Settings/components/Reference/MainBases/base-warehouses.type";
import {
  DocTypeListType, KitchenTypesListItemType, KitchenTypesListParamsType,
  KitchenWarehouseListItemType, KitchenWarehouseListParamsType,
  RespondentParamsType,
  RespondentType,
} from "@/modules/Settings/settings.types";
import KitchenType from "@/modules/Settings/components/Reference/KitchenType/KitchenType.vue";

interface TypeDocument {
  document_categories: Array<{ id: string | number, name: string }>;
}

interface VidDocument {
  documents: Array<{ id: string | number, name: string }>;
}

interface Params {
  search?: string | null;
  page?: number | string;
  per_page?: number | string;
  management_id?: number;
}

interface Pagination {
  current_page: number | null;
  per_page: number | null;
  has_more: boolean;
  items_count: number | null;
  total_count: number | null;
  pages_count: number | null;
}

interface rationList {
  rations: object[];
  pagination: Pagination;
}

interface WarehouseBasesList {
  bases: object[];
  paginator: Pagination;
}

interface Name {
  uz: string;
  ru: string;
}

interface WareHouseType {
  id?: number;
  name: Name;
  address: string;
  code: string;
  status: string;
}

interface WareHouseItemType {
  id: number;
  name: Name;
  address: string;
  code: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: null | string;
}

interface UnitParamsType {
  product_type_id?: number;
  search?: string;
}

export const useSettingsStore = defineStore("settingsStore", () => {
  // dilshod
  const typeProduct = ref({
    product_categories: [] as any,
  });
  const vidProduct = ref({
    product_types: [] as any,
    pagination: {} as any,
  });
  const units = ref({
    units: [] as any,
  });
  const providers = ref({
    providers: [] as any,
    paginator: {} as any,
  });
  const regional = ref({
    managements: [] as any,
    paginator: {} as any,
  });
  const organization = ref({
    organization: [] as any,
    paginator: {} as any,
  });
  const kitchenTypes = ref({
    kitchenTypes: [] as any,
    paginator: {} as any,
  });
  const meals = ref({
    meals: [] as any,
    pagination: {} as any,
  });
  const kitchenWarehouse = ref({
    kitchen_warehouses: [] as any,
    paginator: {} as any,
  });
  // dilshod


  // begzod
  const typeDocument = ref<TypeDocument>({
    document_categories: [],
  });
  const vidDocument = ref<VidDocument>({
    documents: [],
  });

  const rationList = ref<rationList>({
    rations: [],
    pagination: {
      current_page: 0,
      per_page: 0,
      has_more: false,
      items_count: 0,
      total_count: 0,
      pages_count: 0,
    },
  });


  const wareHouseList = ref<WarehouseBasesList>({
    bases: [],
    paginator: {
      current_page: 0,
      per_page: 0,
      has_more: false,
      items_count: 0,
      total_count: 0,
      pages_count: 0,
    },
  });

  const wareHouseItem = ref<WareHouseItemType | {}>({});

  // Документы Типы документов
  const GET_TYPE_DOCUMENT = async (params?: { search: string | null }) => {
    const { data } = await $axios.get("/document-types/categories", { params });
    typeDocument.value = data.data;
  };


  const GET_VID_DOCUMENT = async (params?: { search: string | null }) => {
    const { data } = await $axios.get("/document-types", { params });
    vidDocument.value = data.data;
  };


  const docTypeList = ref<DocTypeListType[]>([]);
  const docTypeListLoading = ref<boolean>(false);

  const getDocTypeList = async () => {
    docTypeListLoading.value = true;

    try {
      const { data }: { data: Record<string, any> } = await $axios.get("/document-types/list");
      docTypeList.value = data.data.doc_types;
    } finally {
      docTypeListLoading.value = false;
    }
  };

  const respondents = ref<RespondentType[]>([]);
  const respondentsLoading = ref<boolean>(false);

  const fetchRespondents = async (params: RespondentParamsType = {}) => {
    respondentsLoading.value = true;

    try {
      const { data }: { data: Record<string, any> } = await $axios.get("documents/respondents-list", { params });
      respondents.value = data.data.respondents;
    } finally {
      respondentsLoading.value = false;
    }
  };

  // Рационы

  const GET_RATION_LIST = async (params?: any) => {
    const { data } = await $axios.get("/rations", { params });
    rationList.value = data.data;
  };

  const GET_SHOW_ITEM = async (id: string | number) => {
    const { data } = await $axios.get(`/rations/${id}`);
    return data.data;
  };

  const CRETE_RATION = async (data: any) => {
    return await $axios.post("/rations/", data);

  };

  const UPDATE_RATION = async ({ id, data }: { id: string, data: any }) => {
    return await $axios.post(`/rations/${id}`, data);
  };

  const DELETE_RATION = async (id: string | number) => {
    return await $axios.delete("/rations/" + id);
  };


  // Базы складов

  const GET_WAREHOUSE_BASES_LIST = async (params?: Params) => {
    const { data } = await $axios.get("/bases", { params });
    wareHouseList.value = data.data;
  };

  const GET_WAREHOUSE_BASES_ITEM = async (id: string | number) => {
    const { data } = await $axios.get("/bases/" + id);
    wareHouseItem.value = data.data && data.data.base;
    return data.data;
  };

  const CRETE_WAREHOUSE_BASES = async (data: WareHouseType) => {
    return await $axios.post("/bases/", data);

  };

  const UPDATE_WAREHOUSE_BASES = async ({ id, data }: { id: string | number, data: WareHouseType }) => {
    return await $axios.put("/bases/" + id, data);

  };

  const DELETE_WAREHOUSE_BASES = async (id: string | number) => {
    return await $axios.delete("/bases/" + id);

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
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const UPDATE_VID_PRODUCT = ({ id, data }: { id: string | number; data: any }) => {
    return $axios.post(`/product-types/${id}/`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  // Единицы измерения
  const unitsData = ref<Map<number, Record<string, any>[]>>(new Map);

  const GET_UNITS = async (params?: UnitParamsType) => {
    const { data } = await $axios.get("/measurement-units", { params });
    units.value = data.data;
    if (params?.product_type_id) {
      unitsData.value.set(params.product_type_id, data.data.units);
    }
  };

  // поставщика
  const createProviderLoading = ref(false);
  const CREATE_PROVIDERS = (data: any) => {
    createProviderLoading.value = true;
    try {
      $axios.post("/providers", data);
    } finally {
      createProviderLoading.value = false;
    }
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

  const kitchenTypesList = ref<KitchenTypesListItemType[]>();
  const kitchenTypesListLoading = ref(false);

  const fetchKitchenTypesList = async (params: KitchenTypesListParamsType = {}) => {
    kitchenTypesListLoading.value = true;
    try {
      const { data } = await $axios.get("kitchen-types/list", { params });
      kitchenTypesList.value = data.data.kitchen_types;
    } finally {
      kitchenTypesListLoading.value = true;
    }
  };

  const GET_KITCHEN_TYPE_DETAIL = async (id: number) => {
    const { data } = await $axios.get(`/kitchen-types/${id}/`);
    return data.data;
  };

  const DELETE_KITCHEN_TYPE = async (id: number) => {
    return $axios.delete(`/kitchen-types/${id}`);
  };

  // Блюда
  const GET_MEALS = async (params?: any) => {
    const { data } = await $axios.get("/meals", { params });
    meals.value = data.data;
  };

  const CREATE_MEALS = (data: any) => {
    return $axios.post("/meals", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const GET_MEALS_DETAIL = async (id: number | string) => {
    const { data } = await $axios.get(`/meals/${id}`);
    return data.data;
  };

  const UPDATE_MEALS = ({ id, data }: { id: string | number; data: any }) => {
    return $axios.put(`/meals/${id}/`, data);
  };

  const DELETE_MEALS = async (id: number) => {
    return $axios.delete(`/meals/${id}`);
  };
  // Блюда end

  const parentProductType = ref({
    product_types: [] as [],
  });

  const dynamicVid = ref({
    product_types: [] as [],
  });
  const GET_MEALS_VID_PRO = async (params: any) => {
    const { data } = await $axios.get("/product-types", { params });
    parentProductType.value = data.data;
    return data.data;
  };

  // Склады кухни
  const GET_KITCHEN_WAREHOUSE = async (params: any) => {
    const { data } = await $axios.get("/kitchen-warehouses", { params });
    kitchenWarehouse.value = data.data;
  };

  const kitchenWarehouseList = ref<KitchenWarehouseListItemType[]>([]);
  const kitchenWarehouseListLoading = ref(false);

  const fetchKitchenWarehouseList = async (params: KitchenWarehouseListParamsType) => {
    kitchenWarehouseListLoading.value = true;

    try {
      const { data }: { data: Record<string, any> } = await $axios.get("kitchen-warehouses/all", { params });
      kitchenWarehouseList.value = data.data.kitchen_warehouses as KitchenWarehouseListItemType[];
    } finally {
      kitchenWarehouseListLoading.value = false;
    }
  };

  const CREATE_KITCHEN_WAREHOUSE = (data: any) => {
    return $axios.post("/kitchen-warehouses", data);
  };

  const UPDATE_KITCHEN_WAREHOUSE = ({ id, data }: { id: string | number; data: any }) => {
    return $axios.put(`/kitchen-warehouses/${id}/`, data);
  };

  const DELETE_KITCHEN_WAREHOUSE = async (id: number) => {
    return $axios.delete(`/kitchen-warehouses/${id}`);
  };

  const GET_KITCHEN_WAREHOUSE_DETAIL = async (id: number) => {
    const { data } = await $axios.get(`/kitchen-warehouses/${id}`);
    return data.data;
  };
  // dilshod end

  // abbos start

  // Комбинаты питания

  const foodFactoriesPrefix = "food-factories";

  const createFoodFactory = (data: FoodFactoriesCreateFormType) => {
    return $axios.post(foodFactoriesPrefix, data);
  };

  const updateFoodFactory = (id: number, data: FoodFactoriesCreateFormType) => {
    return $axios.put(`${foodFactoriesPrefix}/${id}`, data);
  };

  const foodFactory = ref<null | FoodFactoryType>(null);
  const foodFactoryLoading = ref(false);

  const showFoodFactory = async (id: number) => {
    foodFactoryLoading.value = true;
    await $axios.get(`${foodFactoriesPrefix}/${id}`).then(({ data }) => {
      if (data.data) {
        foodFactory.value = data.data.food_factory;
      }
    }).finally(() => foodFactoryLoading.value = false);
  };

  const deleteFoodFactory = async (id: number) => {
    return $axios.delete(`${foodFactoriesPrefix}/${id}`);
  };

  const foodFactories = ref<FoodFactoriesType | null>(null);
  const foodFactoriesLoading = ref(false);

  const fetchFoodFactories = async (params: FoodFactoriesParamsType) => {
    foodFactoriesLoading.value = true;

    await $axios.get(foodFactoriesPrefix, { params }).then(({ data }) => {
      if (data.data) foodFactories.value = data.data;
    }).finally(() => foodFactoriesLoading.value = false);
  };

  // Комбинаты питания end

  // Склады базы

  const baseWareHousesPrefix = "base-warehouses";

  const baseWarehouses = ref<null | BaseWarehousesType>(null);
  const baseWarehousesLoading = ref(false);
  const fetchBaseWarehouses = async (params: BaseWarehousesParamsType) => {
    baseWarehousesLoading.value = true;
    await $axios.get(baseWareHousesPrefix, { params }).then(({ data }) => {
      if (data.data) baseWarehouses.value = data.data;
    }).finally(() => baseWarehousesLoading.value = false);
  };

  const baseWarehouse = ref<null | BaseWarehouseType>(null);
  const baseWarehouseLoading = ref(false);

  const fetchBaseWarehouse = async (id: number) => {
    baseWarehouseLoading.value = true;
    await $axios.get(`${baseWareHousesPrefix}/${id}`).then(({ data }) => {
      if (data.data) {
        baseWarehouse.value = data.data.base_warehouse;
      }
    }).finally(() => baseWarehouseLoading.value = false);
  };

  const deleteBaseWarehouse = async (id: number) => {
    return $axios.delete(`${baseWareHousesPrefix}/${id}`);
  };

  const createBaseWarehouse = (data: BaseWarehouseDataType) => {
    return $axios.post(baseWareHousesPrefix, data);
  };

  const updateBaseWarehouse = (id: number, data: BaseWarehouseDataType) => {
    return $axios.put(`${baseWareHousesPrefix}/${id}`, data);
  };

  // Склады базы end

  // abbos end


  return {
    // begzod
    vidDocument,
    typeDocument,
    wareHouseList,
    wareHouseItem,
    GET_TYPE_DOCUMENT,
    GET_VID_DOCUMENT,
    GET_WAREHOUSE_BASES_LIST,
    GET_WAREHOUSE_BASES_ITEM,
    UPDATE_WAREHOUSE_BASES,
    CRETE_WAREHOUSE_BASES,
    DELETE_WAREHOUSE_BASES,
    kitchenWarehouseList,
    kitchenWarehouseListLoading,
    fetchKitchenWarehouseList,

    rationList,
    GET_RATION_LIST,
    CRETE_RATION,
    DELETE_RATION,
    UPDATE_RATION,
    GET_SHOW_ITEM,
    // begzod end

    //     abbos start
    createFoodFactory,
    updateFoodFactory,
    showFoodFactory,
    foodFactory,
    foodFactoryLoading,
    deleteFoodFactory,
    foodFactories,
    foodFactoriesLoading,
    fetchFoodFactories,
    docTypeList,
    docTypeListLoading,
    getDocTypeList,

    baseWarehouses,
    baseWarehousesLoading,
    fetchBaseWarehouses,
    baseWarehouse,
    baseWarehouseLoading,
    fetchBaseWarehouse,
    deleteBaseWarehouse,
    createBaseWarehouse,
    updateBaseWarehouse,
    respondents,
    respondentsLoading,
    fetchRespondents,
    createProviderLoading,


    // dilshod
    typeProduct,
    dynamicVid,
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
    unitsData,
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
    kitchenTypesList,
    kitchenTypesListLoading,
    fetchKitchenTypesList,

    meals,
    GET_MEALS,
    CREATE_MEALS,
    GET_MEALS_DETAIL,
    UPDATE_MEALS,
    GET_MEALS_VID_PRO,
    DELETE_MEALS,

    parentProductType,

    kitchenWarehouse,
    GET_KITCHEN_WAREHOUSE,
    CREATE_KITCHEN_WAREHOUSE,
    UPDATE_KITCHEN_WAREHOUSE,
    DELETE_KITCHEN_WAREHOUSE,
    GET_KITCHEN_WAREHOUSE_DETAIL,
    // dilshod end
  };
});