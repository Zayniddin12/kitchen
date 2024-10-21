import {defineStore} from "pinia";
import $axios from "@/plugins/axios";
import {ref} from "vue";

export const useSettingsStore = defineStore("settingsStore", () => {

    // dilshod
    const typeProduct = ref<Array[]>([])
    const typeProductDetail = ref({})
    // dilshod


    // begzod


    // begzod end


    // dilshod
    const GET_TYPE_PRODUCT = async (params: any) => {
        const {data} = await $axios.get('get', {params})
        typeProduct.value = data
    }

    const GET_TYPE_PRODUCT_DETAIL = async (id: number) => {
        const {data} = await $axios.get(`/get/${id}/`)
        typeProductDetail.value = data
    }

    const CREATE_TYPE_PRODUCT = (data: any) => {
        return $axios.post('/create', data)
    }

    const UPDATE_TYPE_PRODUCT = ({id, data}: { id: string | number; data: any }) => {
        return $axios.patch(`/update/${id}/`, data)
    }
    // dilshod end


    return {
        // begzod


        // begzod end


        // dilshod
        typeProduct,
        typeProductDetail,
        GET_TYPE_PRODUCT,
        GET_TYPE_PRODUCT_DETAIL,
        CREATE_TYPE_PRODUCT,
        UPDATE_TYPE_PRODUCT
        // dilshod end
    }
})