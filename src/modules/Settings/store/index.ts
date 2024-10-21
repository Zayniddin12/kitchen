import {defineStore} from "pinia";
import $axios from "@/plugins/axios";
import {ref} from "vue";

export const useSettingsStore = defineStore("settingsStore", () => {

    // dilshod
    const typeProduct = ref<Array[]>([])
    // dilshod


    // begzod


    // begzod end


    // dilshod
    const GET_TYPE_PRODUCT = async () => {
        const {data} = await $axios.get('get')
        typeProduct.value = data
    }

    const CREATE_TYPE_PRODUCT = (data: any) => {
        return $axios.post('/create', data)
    }

    const UPDATE_TYPE_PRODUCT = ({id, data}: {id: string | number; data: any}) => {
        return $axios.patch(`/update/${id}/`, data)
    }
    // dilshod end


    return {
        // begzod


        // begzod end


        // dilshod
        typeProduct,
        GET_TYPE_PRODUCT,
        CREATE_TYPE_PRODUCT,
        UPDATE_TYPE_PRODUCT
        // dilshod end
    }
})