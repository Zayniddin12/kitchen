import { defineStore } from "pinia";
import { RouteLocationRaw, useRouter } from "vue-router";
import { ElNotification } from "element-plus";

export const useCommonStore = defineStore("commonStore", () => {
    const router = useRouter();

    const redirectNotFound = (message: string) => {
        ElNotification({
            title: "Error 404",
            message,
            type: "error"
        });
        router.replace({ name: "notFound" });
    };

    const successToast = async (route: RouteLocationRaw) => {
        await router.push(route);
        ElNotification({
            title: "Успешно",
            message: "Успешно",
            type: "success"
        });
    };

    return {
        redirectNotFound,
        successToast
    };
});