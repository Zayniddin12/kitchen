import { defineStore } from "pinia";
import { ref } from "vue";
import $axios from "@/plugins/axios/axios";

export const useCashier = defineStore("cashierStore", () => {

  const menuList = ref({});


  const GET_MENU_LIST = async (params) => {
    const { data } = await $axios.get(`/kitchen-sales/14/sell-menu-today`, {params});

    menuList.value = data.data;
  };
  return {
    menuList,
    GET_MENU_LIST,
  };
});