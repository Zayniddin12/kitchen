import { StatusType } from "@/types/common.type";
import { RouteLocationRaw } from "vue-router";
import { ElNotification } from "element-plus";
import {useRouter} from "vue-router";

export const formatDate = (date: Date) => {
    const daysOfWeek = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dayOfWeek = daysOfWeek[date.getDay()];

    return {
        date: `${day}.${month}.${year}`,
        week: dayOfWeek
    };
};


export const formatNumber = (value: number, format = " ") => {
    if (!value) return 0;
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, `${format}`);
};

export const generateRandomID = (): string => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let result = "";
    for (let i = 0; i < charactersLength; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
};

export const filterObjectValues = (obj: Record<string, any>): Record<string, any> => {
    return Object.fromEntries(
        Object.entries(obj)
            .filter(([_, value]) => value)
    );
};

export const togglePageScrolling = (disable = false) => {
    document.documentElement.classList.toggle(
        "el-popup-parent--hidden",
        disable
    );
};

export class Name {
    uz: string;
    ru: string;

    constructor(uz: string = "", ru: string = "") {
        this.uz = uz;
        this.ru = ru;
    }
}

export const getStatus = (status: StatusType) => {
    return status === "active";
};

export const setStatus = (status: boolean): StatusType => {
    return status ? "active" : "inactive";
};

export const deepEqual = (obj1:Record<string, any>, obj2: Record<string, any>) => {
    if (obj1 === obj2) return true;

    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
        return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }

    return true;
}

