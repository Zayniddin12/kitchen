import { defineStore } from "pinia";
import { computed, ref } from "vue";
import $axios from "@/plugins/axios/axios";

interface DistrictType {
  id: number;
  name: string;
}

export const useDistrictStore = defineStore("districtStore", () => {
  const districts = computed<DistrictType[]>(() => [
    { id: 1, name: "КП РУ Зарафшон" },
    { id: 2, name: "КП РУ Навои" },
    { id: 3, name: "КП РУ Нуробод" },
    { id: 4, name: "КП РУ Учкудук" },
    { id: 5, name: "КП РУ Зафаробод" },
  ]);
  const remaining_goods_list = ref<any>({ products: [] });
  const district = ref<DistrictType | null>(null);

  const getDistrict = (id: number): void => {
    district.value = districts.value.find((el) => el.id === id) ?? null;
  };

  const GET_REMAINING_GOODS_LIST = async (params?: any) => {
    const { data } = await $axios.get("/monitoring/remain-goods", { params });
    remaining_goods_list.value = data.data;
    return data.data;
  };

  return {
    remaining_goods_list,
    GET_REMAINING_GOODS_LIST,

    districts,
    district,
    getDistrict,
  };
});
