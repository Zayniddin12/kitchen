import { FillingPercentageResponseType } from "@/modules/KitchenWarehouse/kitchen-warehouse.types";
import axios from "@/plugins/axios/axios";
import {
  ManagementBasesType,
  WarehouseBasesInvoicesParamsType, WarehouseBasesInvoicesResponseType,
  WarehouseBasesProductsParamsType,
  WarehouseBasesProductsResponseType,
} from "@/modules/WarehouseBases/warehouse-bases.types";

const prefix = "base-warehouses";

export default {
  async fetchManagementBases(): Promise<ManagementBasesType> {
    const { data }: { data: Record<string, any> } = await axios.get("managements/with-bases");
    return data.data.managements;
  },
};