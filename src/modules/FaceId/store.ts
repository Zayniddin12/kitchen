import { defineStore } from "pinia";
import { ref } from "vue";
import $axios from "@/plugins/axios/axios";
import tokenManager from "@/utils/token.manager";
import { ElNotification } from "element-plus";

export const useFaceStore = defineStore("faceStore", () => {
  const faceId = ref({
    user_id: "",
    face_path: "",
    user_name: "",
    work_place_name: "",
    ration: "",
    work_hours: "",
    order_id: "",
  });

  const FETCH_FACE_ID = async (params?: any) => {
    if (!tokenManager.getAccessToken()) return;
    const { data } = await $axios.get("/face-check", { params });
    faceId.value = data.data;
    if (data.success == false) {
      ElNotification({
        title: "Ogohlantirish!",
        message: "Siz ovqat olgansiz!",
        type: "warning",
      });
    }
    return data.data;
  };

  const CONFIRM_USER = async (id: number | string) => {
    if (!tokenManager.getAccessToken()) return;
    const { data } = await $axios.post(`/orders/${id}/accept`);
    return data;
  };

  return {
    faceId,
    FETCH_FACE_ID,
    CONFIRM_USER,
  };
});