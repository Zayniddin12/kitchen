import { FillingPercentageResponseType } from "@/modules/KitchenWarehouse/kitchen-warehouse.types";
import axios from "@/plugins/axios/axios";
import {
  ManagementBasesType,
  WarehouseBasesInvoicesParamsType, WarehouseBasesInvoicesResponseType,
  WarehouseBasesProductsParamsType,
  WarehouseBasesProductsResponseType,
} from "@/modules/WorkShops/workshops.types";

const prefix = "workshop-warehouses";

export default {
  async fetchProducts(id: number, params: WarehouseBasesProductsParamsType = {}): Promise<WarehouseBasesProductsResponseType> {
    const { data }: { data: Record<string, any> } = await axios.get(`${prefix}/${id}/list-products`, { params });
    return data.data as WarehouseBasesProductsResponseType;
  },
  async fetchFillingPercentage(id: number): Promise<FillingPercentageResponseType> {
    const { data }: { data: Record<string, any> } = await axios.get(`${prefix}/${id}/filling-percentage`);
    return data.data as FillingPercentageResponseType;
  },
  async fetchManagementBases(): Promise<ManagementBasesType> {
    const { data }: { data: Record<string, any> } = await axios.get("workshop-warehouses/list-by-base");
    return data.data.managements;
  },

  // head pantry
  async fetchProductsHeadPantry(id: number, params: WarehouseBasesProductsParamsType = {}): Promise<WarehouseBasesProductsResponseType> {
    const { data }: { data: Record<string, any> } = await axios.get(`pantry-warehouses/${id}/list-products`, { params });
    return data.data as WarehouseBasesProductsResponseType;
  },

  async fetchHeadPantryBases(): Promise<ManagementBasesType> {
    const { data }: { data: Record<string, any> } = await axios.get("pantry-warehouses/list-by-base");
    return data.data.managements;
  },

  async fetchFillingPercentageHeadPantry(id: number): Promise<FillingPercentageResponseType> {
    const { data }: { data: Record<string, any> } = await axios.get(`pantry-warehouses/${id}/filling-percentage`);
    return data.data as FillingPercentageResponseType;
  },
};