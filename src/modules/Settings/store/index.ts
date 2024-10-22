import {defineStore} from "pinia";
import $axios from "@/plugins/axios";
import {ref} from "vue";

export const useSettingsStore = defineStore("settingsStore", () => {

    // dilshod
    const typeProduct = ref<any[]>([])
    const vidProduct = ref<any[]>([])
    const typeProductDetail = ref({})
    const units = ref<any[]>([])
    // dilshod


    // begzod


    // begzod end


    // dilshod
    // Продукты Типы документов
    const GET_TYPE_PRODUCT = async (params: any) => {
        const {data} = await $axios.get('/product-types/categories', {params})
        typeProduct.value = data.data
    }

    const GET_TYPE_PRODUCT_DETAIL = async (id: number) => {
        const {data} = await $axios.get(`/get/${id}/`)
        typeProductDetail.value = data
    }

    const CREATE_TYPE_PRODUCT = (data: any) => {
        return $axios.post('/product-types', data)
    }

    const UPDATE_TYPE_PRODUCT = ({id, data}: { id: string | number; data: any }) => {
        return $axios.patch(`/update/${id}/`, data)
    }

    const DELETE_TYPE_PRODUCT = (id: number) => {
        return $axios.delete(`/delete/${id}/`)
    }

    // Продукты Виды документов

    const GET_VID_PRODUCT = async (params: any) => {
        const {data} = await $axios.get('/product-types', {params})
        vidProduct.value = data.data
    }

    // Единицы измерения
    const GET_UNITS = async (params: any) => {
        const {data} = await $axios.get('/measurement-units', {params})
        units.value = data.data
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
        UPDATE_TYPE_PRODUCT,
        DELETE_TYPE_PRODUCT,

        vidProduct,
        GET_VID_PRODUCT,

        units,
        GET_UNITS
        // dilshod end
    }
})