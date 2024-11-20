import {
    GraphProductsParamsType,
    GraphProductsType,
    KitchenPreparationParamsType, KitchenPreparationType, ProductsParamsType, ProductsType, StatisticCountType,
    VisitorsParamsType, VisitorsType,
    WarehouseCapacityParamsType,
    WarehouseCapacityType
} from "@/modules/Home/statistics.types";
import axios from "@/plugins/axios/axios";

const prefix = "statistics";

export default {
    async fetchWarehouseCapacity(params: WarehouseCapacityParamsType = {}): Promise<WarehouseCapacityType> {
        const { data }: { data: Record<string, any> } = await axios.get(`${prefix}/warehouse-capacity`, { params });
        return data.data as WarehouseCapacityType;
    },

    async fetchVisitors(params: VisitorsParamsType = {}): Promise<VisitorsType> {
        const { data }: { data: Record<string, any> } = await axios.get(`${prefix}/visitors`, { params });
        return data.data.visitors as VisitorsType;
    },

    async fetchKitchenPreparations(params: KitchenPreparationParamsType = {}): Promise<KitchenPreparationType> {
        const { data }: { data: Record<string, any> } = await axios.get(`${prefix}/kitchen-preparation`, { params });
        return data.data.kitchens as KitchenPreparationType;
    },

    async fetchProducts(params: ProductsParamsType = {}): Promise<ProductsType> {
        const { data }: { data: Record<string, any> } = await axios.get(`${prefix}/products`, { params });
        return data.data.products as ProductsType;
    },

    async fetchGraphProducts(url : "incoming-products" | "outgoing-products", params: GraphProductsParamsType = {}): Promise<GraphProductsType> {
        const { data }: { data: Record<string, any> } = await axios.get(`${prefix}/${url}`, { params });
        return data.data.graph as GraphProductsType;
    },

    async fetchKitchenCount():Promise<StatisticCountType>{
        const {data}:{data: Record<string, any>} = await axios.get(`${prefix}/kitchen-count`);
        return data.data.count as StatisticCountType;
    },

    async fetchWarehouseCount():Promise<StatisticCountType>{
        const {data}:{data: Record<string, any>} = await axios.get(`${prefix}/warehouse-count`);
        return data.data.warehouse_count as StatisticCountType;
    },
};