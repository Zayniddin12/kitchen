import { defineStore } from "pinia";
import { ref } from "vue";
import { AuthCreateDataType, AuthLoginDataType } from "@/modules/Auth/auth.types";
import authApi from "@/modules/Auth/auth.api";

export const useAuthStore = defineStore("authStore", () => {
    const createLoading = ref(false);

    const create = async (data: AuthCreateDataType) => {
        createLoading.value = true;

        await authApi.create(data).finally(() => createLoading.value = false);
    };

    const loginLoading = ref(false);

    const login = async (data: AuthLoginDataType) => {
        loginLoading.value = true;

        await authApi.login(data)
            .then(response => {

            })
            .finally(() =>
                createLoading.value = false
            );
    };

    return {
        createLoading,
        create
    };
});