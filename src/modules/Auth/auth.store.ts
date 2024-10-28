import { defineStore } from "pinia";
import { ref } from "vue";
import { AuthCreateDataType, AuthLoginDataType, SendCodeDataType, UserType } from "@/modules/Auth/auth.types";
import authApi from "@/modules/Auth/auth.api";
import { removeAccessToken, setAccessToken } from "@/utils/token.manager";
import { useRouter } from "vue-router";
import { useCommonStore } from "@/stores/common.store";


export const useAuthStore = defineStore("authStore", () => {
    const router = useRouter();
    const commonStore = useCommonStore();

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
                setAccessToken(response.token.access_token);
            })
            .finally(() =>
                createLoading.value = false
            );
    };

    const userLoading = ref(false);
    const user = ref<null | UserType>(null);

    const me = async () => {
        userLoading.value = true;

        await authApi.me()
            .then(response => {
                user.value = response;
            })
            .finally(() => {
                userLoading.value = false;
            });
    };

    const clear = async () => {
        user.value = null;
        removeAccessToken();
        await router.push({ name: "login" });
    };

    const logout = async () => {
        userLoading.value = true;
        await authApi.logout()
            .then(async () => {
                await clear();
                commonStore.successToast();
            })
            .finally(() => {
                userLoading.value = false;
            });
    };

    const sendCodeLoading = ref(false);


    const sendCode = (data: SendCodeDataType) => {
        data.reason = "forgot_password";

        sendCodeLoading.value = true;

        authApi.sendCode(data).then((response) => {

        })
    };

    return {
        createLoading,
        create,
        loginLoading,
        login,
        userLoading,
        user,
        me,
        clear,
        logout
    };
});