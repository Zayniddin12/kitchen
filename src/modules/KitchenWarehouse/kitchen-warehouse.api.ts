import axios from "@/plugins/axios/axios";
import {
    FillingPercentageResponseType,
    ListInvoicesParamsType,
    ListInvoicesResponseType,
    ListProductsParamsType,
    ListProductsResponseType, UpdatePriceDataType
} from "@/modules/KitchenWarehouse/kitchen-warehouse.types";

const prefix = "kitchen-warehouses";

export default {
    async fetchListProducts(
        id: number,
        params: ListProductsParamsType = {}
    ): Promise<ListProductsResponseType> {
        const { data }: { data: Record<string, any> } = await axios.get(
            `${prefix}/${id}/list-products`,
            { params }
        );
        return data.data as ListProductsResponseType;
    },

    async fetchListInvoices(
        id: number,
        params: ListInvoicesParamsType = {}
    ): Promise<ListInvoicesResponseType> {
        const { data } = await axios.get(`${prefix}/${id}/list-invoices`, {
            params
        });
        return data.data as ListInvoicesResponseType;
    },

    async fetchFillingPercentage(id: number): Promise<FillingPercentageResponseType> {
        const { data }: { data: Record<string, any> } = await axios.get(
            `${prefix}/${id}/filling-percentage`
        );
        return data.data as FillingPercentageResponseType;
    },

    updatePrice(id: number, data: UpdatePriceDataType) {
        return axios.put(`${prefix}/${id}/update-price`, data);
    },


};
