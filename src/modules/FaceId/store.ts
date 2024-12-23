import { defineStore } from "pinia";
import { ref } from "vue";
import $axios from "@/plugins/axios/axios";
import { useAuthStore } from "@/modules/Auth/auth.store";
import tokenManager from "@/utils/token.manager";


export const useFaceStore = defineStore("faceStore", () => {



  const faceId = ref({
    user_id: "",
    face_path: "",
    user_name: "",
    work_place_name: "",
    ration: "",
    work_hours: "",
  });

  const FETCH_FACE_ID = async (params?: any) => {
    if(!tokenManager.getAccessToken()) return ;
    const { data } = await $axios.get("/face-check", { params });
    faceId.value = data.data;
    return data.data;
  };

  return {
    faceId,
    FETCH_FACE_ID,
  };
});