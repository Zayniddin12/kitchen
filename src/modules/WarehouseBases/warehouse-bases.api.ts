import { FillingPercentageResponseType } from "@/modules/KitchenWarehouse/kitchen-warehouse.types";
import axios from "@/plugins/axios/axios";
import {
    ManagementBasesType,
    WarehouseBasesInvoicesParamsType, WarehouseBasesInvoicesResponseType,
    WarehouseBasesProductsParamsType,
    WarehouseBasesProductsResponseType
} from "@/modules/WarehouseBases/warehouse-bases.types";

const prefix = "base-warehouses";

export default {
    async fetchFillingPercentage(id: number): Promise<FillingPercentageResponseType> {
        const { data }: { data: Record<string, any> } = await axios.get(`${prefix}/${id}/filling-percentage`);
        return data.data as FillingPercentageResponseType;
    },

    async fetchProducts(id: number, params: WarehouseBasesProductsParamsType = {}): Promise<WarehouseBasesProductsResponseType> {
        const { data }: { data: Record<string, any> } = await axios.get(`${prefix}/${id}/products`, { params });
        return data.data as WarehouseBasesProductsResponseType;
    },

    async fetchInvoices(id: number, params: WarehouseBasesInvoicesParamsType = {}): Promise<WarehouseBasesInvoicesResponseType> {
        const { data }: { data: Record<string, any> } = await axios.get(`${prefix}/${id}/invoices`, { params });
        return data.data as WarehouseBasesInvoicesResponseType;
    },

    async fetchManagementBases(): Promise<ManagementBasesType> {
        const { data }: { data: Record<string, any> } = await axios.get("managements/with-bases");
        return data.data.managements;
    },
};