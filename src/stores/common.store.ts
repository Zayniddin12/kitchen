import { defineStore } from "pinia";
import { RouteLocationRaw, useRouter } from "vue-router";
import { ElNotification } from "element-plus";
import { GenderResponseType, GenderType } from "@/types/common.type";
import MaleAvatar from "@/assets/images/genders/male.png";
import FemaleAvatar from "@/assets/images/genders/female.png";
import { ref } from "vue";
import { getSessionItem, removeSessionItem, setSessionItem } from "@/utils/sessionStorage";

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

    const titles = ref<Record<string, string>>({});
    const titlesKey = "page-titles";

    const setTitle = (key: string, value: string) => {
        titles.value[key] = value;
        setSessionItem(titlesKey, JSON.stringify(titles.value));
    };

    const getTitle = (key:string) => {
        return titles.value[key] ?? "";
    }

    const getTitles = () => {
        const storageTitles = getSessionItem(titlesKey);
        if (!storageTitles) return;
        titles.value = JSON.parse(storageTitles);
    };

    const removeTitles = () => {
        titles.value = {};
        removeSessionItem(titlesKey);
    };

    return {
        redirectNotFound,
        successToast,
        errorToast,
        getGender,
        titles,
        setTitle,
        getTitle,
        getTitles,
        removeTitles
    };
});