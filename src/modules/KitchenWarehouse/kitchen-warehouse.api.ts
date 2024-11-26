import axios from "@/plugins/axios/axios";
import { ListProductsParamsType, ListProductsResponseType } from "@/modules/KitchenWarehouse/kitchen-warehouse.types";

const prefix = "kitchen-warehouses";

export default {
    async fetchListProducts(id: number, params: ListProductsParamsType = {}): Promise<ListProductsResponseType> {
        const { data } = await axios.get(`${prefix}/${id}/list-products`, { params });
        return data.data as ListProductsResponseType;
    }
};