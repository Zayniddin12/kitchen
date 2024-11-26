import { defineStore } from "pinia";
import { RouteLocationRaw, useRouter } from "vue-router";
import { ElNotification } from "element-plus";
import { GenderResponseType, GenderType } from "@/types/common.type";
import MaleAvatar from "@/assets/images/genders/male.png";
import FemaleAvatar from "@/assets/images/genders/female.png";

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

    const successToast = async (route?: RouteLocationRaw) => {
        if (route) await router.push(route);
        ElNotification({
            title: "Успешно",
            message: "Успешно",
            type: "success"
        });
    };

    const errorToast = async (message: string, route?: RouteLocationRaw) => {
        if (route) await router.push(route);
        ElNotification({
            title: "Error",
            message,
            type: "error"
        });
    };

    const getGender = (gender: GenderType): GenderResponseType | null => {
        if (!gender) return null;


        return {
            name: gender === "f" ? "Женский" : "Мужской",
            photo: gender === "f" ? FemaleAvatar : MaleAvatar
        };
    };

    return {
        redirectNotFound,
        successToast,
        errorToast,
        getGender
    };
});